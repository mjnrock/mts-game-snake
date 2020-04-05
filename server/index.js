import MTSLib from "@lespantsfancy/message-transfer-system";

const express = require("express");
const path = require("path");
const app = express();
const expressWs = require("express-ws")(app);
const port = 3000;

const Game = {
    SignalTypes: {
        NEW_PLAYER: "Game.NewPlayer",
        DECLARE_MODE: "Game.DeclareMode",
        SYNC_STATE: "Game.SyncState",
    },
    State: {
        Players: [],
        Viewers: []
    }
};

const MTS = MTSLib.Modules.Network(new MTSLib.MasterNode({
    receive: msg => MTSLib.$.MRSP(msg, {
            node: MTS
        })
        .if(Game.SignalTypes.NEW_PLAYER)
            .run(msg => {
                if(Game.State.Players.length === 0) {
                    Game.State.Scribe = msg.payload;
                }

                Game.State.Players.push(msg.payload);
            })
            .send(Game.SignalTypes.SYNC_STATE, Game.State, { elevate: true })
        .if(Game.SignalTypes.DECLARE_MODE)
            .run(msg => {                
                let id = MTSLib.Registry.SanitizeId(msg.source);
                
                if(msg.payload === "VIEWPORT") {
                    Game.State.Players = Game.State.Players.filter(p => p !== id);
                    Game.State.Viewers.push(id);
                }
            })
}));

app.ws("/", function (ws, req) {
    let id = MTS.Network.webSocketNode({
        ws,
        onClose: (wsn) => {
            Game.State.Players = Game.State.Players.filter(p => p !== wsn.id);
            Game.State.Viewers = Game.State.Viewers.filter(p => p !== wsn.id);
            
            MTS.send(Game.SignalTypes.SYNC_STATE, Game.State, { elevate: true });
        }
    });

    MTS.send(Game.SignalTypes.NEW_PLAYER, id);    
});

app.listen(port, () => {
    console.log(`Snake server is running on port: ${ port }`)
});