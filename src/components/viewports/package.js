import Game from "./Game";
import Footer from "./Footer";

import Context from "./../../Context";
Game.contextType = Context.MTSContext;
Footer.contextType = Context.MTSContext;

export default {
    Game,
    Footer
};