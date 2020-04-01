import React from "react";
import MTSLib from "@lespantsfancy/message-transfer-system";

import SignalTypes from "./../../SignalTypes";

export default class Winner extends React.Component {
    onRequestNewGame(e) {
        this.context.message((new MTSLib.Message(
            SignalTypes.NEW_GAME,
            true
        )).elevate());
    }

    render() {
        return (
            <div className="tc mt4 flex flex-column items-center justify-around">
                <h1 className="f1 h3 code"><span role="img" aria-label="yay">🎊</span> Winner <span role="img" aria-label="yay">🎊</span></h1>
                <h3 className="f3 h3 code"><span className="b">{ this.context.state.Winner }</span> { this.context.state.Winner === "Scribe" ? "has" : "have" } won!</h3>
                <br /><br /><br />
                <button className="pa4 w-90 ba br2 f4 blue b--blue code" onClick={ this.onRequestNewGame.bind(this) }>Play Again</button>
            </div>
        );
    }
};