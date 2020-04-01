import MTSLib from "@lespantsfancy/message-transfer-system";
import Message from "@lespantsfancy/message-transfer-system/lib/Message";

const express = require("express");
const path = require("path");
const app = express();
const expressWs = require("express-ws")(app);
const port = 3000;

const Game = {
    SignalTypes: {
        REQUEST_GAME: "Game.RequestGame",

        NEW_GAME: "Game.NewGame",
        NEW_PLAYER: "Game.NewPlayer",
        NEW_GUESS: "Game.NewGuess",
        NEW_WORD: "Game.NewWord",

        DECLARE_MODE: "Game.DeclareMode",
        DECLARE_PLAYERS: "Game.DeclarePlayers",
        DECLARE_LETTERS: "Game.DeclareLetters",
        DECLARE_WORD: "Game.DeclareWord",
        DECLARE_WINNER: "Game.DeclareWinner",

        SYNC_STATE: "Game.SyncState",
    },
    State: {
        Players: [],
        Viewers: [],
        Scribe: null,
        Winner: false,
        Word: "",
        Letters: {
            Correct: [],
            Incorrect: [],
            Remaining: []
        },
    },
    init() {
        Game.State.Winner = false;
        Game.State.Letters = {
            Correct: [],
            Incorrect: [],
            Remaining: []
        };

        for(let i = 65; i <= 90; i++) {
            Game.State.Letters.Remaining.push(String.fromCharCode(i));
        }

        Game.assignScribe();

        MTS.message((new MTSLib.Message(
            Game.SignalTypes.NEW_GAME,
            {
                Players: [],
                Scribe: Game.State.Scribe,
                Winner: false,
                Word: "",
                Letters: {
                    Correct: [],
                    Incorrect: [],
                    Remaining: []
                },
            }
        )).elevate());
    },
    check() {
        if(Game.State.Word.length > 1) {
            let word = Game.State.Word.split("").filter(l => l.charCodeAt(0) >= 65 && l.charCodeAt(0) <= 90);

            if(Game.State.Letters.Incorrect.length === 5) {
                MTS.message((new MTSLib.Message(
                    Game.SignalTypes.DECLARE_WINNER,
                    "Scribe"
                )).elevate());
                
                Game.State.Winner = "Scribe";
            } else if(word.every(l => Game.State.Letters.Correct.includes(l))) {
                MTS.message((new MTSLib.Message(
                    Game.SignalTypes.DECLARE_WINNER,
                    "Players"
                )).elevate());
                
                Game.State.Winner = "Players";
            }
        }
    },
    assignScribe() {
        if(Game.State.Players.length) {
            Game.State.Scribe = Game.State.Players[ 0 ];
        } else {
            Game.State.Scribe = null;
        }

        MTS.message((new MTSLib.Message(
            Game.SignalTypes.SYNC_STATE,
            Game.State
        )).elevate());
    }
};

const MTS = (new MTSLib.Main({
    receive: function(msg) {
        if(msg.type === Game.SignalTypes.NEW_PLAYER) {
            if(Game.State.Players.length === 0) {
                Game.State.Scribe = msg.payload;
            }

            Game.State.Players.push(msg.payload);

            MTS.message((new MTSLib.Message(
                Game.SignalTypes.SYNC_STATE,
                Game.State
            )).elevate());
        } else if(msg.type === Game.SignalTypes.NEW_WORD) {
            Game.init();
            Game.State.Word = msg.payload.toUpperCase();

            MTS.message((new MTSLib.Message(
                Game.SignalTypes.SYNC_STATE,
                Game.State
            )).elevate());
        } else if(msg.type === Game.SignalTypes.NEW_GUESS) {
            let letter = msg.payload;

            if(Game.State.Word.includes(letter) && !Game.State.Letters.Correct.includes(letter)) {
                Game.State.Letters.Correct.push(letter);
            } else if(!Game.State.Letters.Incorrect.includes(letter)) {
                Game.State.Letters.Incorrect.push(letter);
            }
            Game.State.Letters.Remaining = Game.State.Letters.Remaining.filter(l => l !== letter);

            MTS.message((new MTSLib.Message(
                Game.SignalTypes.SYNC_STATE,
                Game.State
            )).elevate());

            Game.check();
        } else if(msg.type === Game.SignalTypes.NEW_GAME) {
            Game.init();
        } else if(msg.type === Game.SignalTypes.DECLARE_MODE) {
            let id = MTSLib.Registry.SanitizeId(msg.source);
            
            if(msg.payload === "VIEWPORT") {
                Game.State.Players = Game.State.Players.filter(p => p !== id);
                Game.State.Viewers.push(id);
            }

            Game.assignScribe();
        }
    }
})).loadNetwork(true);

Game.init();

app.ws("/", function (ws, req) {
    let id = MTS.Network.webSocketNode({
        ws,
        onClose: (wsn) => {
            Game.State.Players = Game.State.Players.filter(p => p !== wsn.id);
            Game.State.Viewers = Game.State.Viewers.filter(p => p !== wsn.id);            

            if(Game.State.Players.length) {
                Game.State.Scribe = Game.State.Players[ 0 ];
            } else {
                Game.State.Scribe = null;
            }
            
            MTS.message((new MTSLib.Message(
                Game.SignalTypes.SYNC_STATE,
                Game.State
            )).elevate());
        }
    });

    MTS.message(new MTSLib.Message(
        Game.SignalTypes.NEW_PLAYER,
        id
    ));    
            
    MTS.message((new MTSLib.Message(
        Game.SignalTypes.SYNC_STATE,
        Game.State
    )).elevate());
});

app.listen(port, () => {
    console.log(`Hangman server is running on port: ${ port }`)
});