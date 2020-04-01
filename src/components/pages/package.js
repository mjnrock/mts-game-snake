import Alphabet from "./Alphabet";
import Game from "./Game";

import Context from "./../../Context";
Alphabet.contextType = Context.MTSContext;
Game.contextType = Context.MTSContext;

export default {
    Alphabet,
    Game
};