import WordChoice from "./WordChoice";
import Alphabet from "./Alphabet";
import Winner from "./Winner";
import Game from "./Game";

import Context from "./../../Context";
WordChoice.contextType = Context.MTSContext;
Alphabet.contextType = Context.MTSContext;
Winner.contextType = Context.MTSContext;
Game.contextType = Context.MTSContext;

export default {
    WordChoice,
    Alphabet,
    Winner,
    Game
};