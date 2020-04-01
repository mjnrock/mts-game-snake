import React from "react";
import MTSLib from "@lespantsfancy/message-transfer-system";

import SignalTypes from "./../../SignalTypes";

export default class Alphabet extends React.Component {
    onClick(e, char) {
        let letter = String.fromCharCode(char);
        
        this.context.message((new MTSLib.Message(
            SignalTypes.NEW_GUESS,
            letter
        )).elevate());
    }

    render() {
        let chars = [];
        for(let i = 65; i <= 90; i++) {
            chars.push( i );
        }

        if(this.context.state.Word === "") {
            return (
                <div className="mt4 code tc f3">Waiting for game to begin...</div>
            )
        }

        return (
            <div className="flex flex-wrap items-center justify-around">
                {
                    chars.map(char => {
                        let color = "#888";

                        if(this.context.state.Letters.Incorrect.includes(String.fromCharCode(char))) {
                            color = "#b24343";
                        } else if(this.context.state.Letters.Correct.includes(String.fromCharCode(char))) {
                            color = "#3ab242";
                        }

                        return (
                            <button
                                className="code b f4 ba bw2 br2 mt3"
                                style={{
                                    color: color,
                                    borderColor: color,
                                    width: "4.75rem",
                                    height: "4.75rem",
                                    // width: "78px",
                                    // height: "78px",
                                }}
                                key={ char }
                                onClick={ e => this.onClick(e, char) }
                            >{ String.fromCharCode(char) }</button>
                        );
                    })
                }
            </div>
        );
    }
};