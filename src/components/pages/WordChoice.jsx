import React from "react";
import MTSLib from "@lespantsfancy/message-transfer-system";

import SignalTypes from "./../../SignalTypes";

export default class WordChoice extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            word: ""
        };
    }
    
    onChange(e) {
        this.setState({
            word: e.target.value
        });
    }

    onKeyUp(e) {
        if(e.which === 13) {
            e.preventDefault();

            this.context.message((new MTSLib.Message(
                SignalTypes.NEW_WORD,
                this.state.word.trim()
            )).elevate());
            
            this.setState({
                word: e.target.value.trim()
            });
        }
    }
    onSetWordClick(e) {        
        this.context.message((new MTSLib.Message(
            SignalTypes.NEW_WORD,
            this.state.word.trim()
        )).elevate());
        
        this.setState({
            word: e.target.value.trim()
        });
    }
    
    onRequestNewGame(e) {
        this.context.message((new MTSLib.Message(
            SignalTypes.NEW_GAME,
            true
        )).elevate());
    }

    render() {
        let props = this.context.state.Word === "" ? {} : { readOnly: true };

        return (
            <div className="flex flex-column items-center justify-around">
                <h2 className="mt2 f3 tc code">You're the Scribe</h2>
                <textarea
                    className={ `f2 mt4 w-90 code overflow-hidden ba br2 b--black-40 ${ this.context.state.Word !== "" ? "bg-light-gray" : ""}` }
                    style={{
                        resize: "none"
                    }}
                    rows="5"
                    maxLength="30"
                    onKeyUp={ this.onKeyUp.bind(this) } 
                    onChange={ this.onChange.bind(this) }
                    value={ this.state.word }
                    { ...props }
                ></textarea>

                <button className={ `mt4 pa4 w-90 ba br2 f4 dark-blue b--blue code ${ this.context.state.Word !== "" ? "bg-light-gray" : "bg-light-blue"}` } onClick={ this.onSetWordClick.bind(this) }>Set Word/Phrase</button>

                <button className="mt3 pa3 w-90 ba br2 f4 white b--red code bg-light-red" onClick={ this.onRequestNewGame.bind(this) }>Start New Game</button>
            </div>
        );


        // if(this.context.state.Word === "") {
        //     return (
        //         <div className="flex flex-column items-center justify-around">
        //             <textarea
        //                 className="f2 mt4 w-90 code overflow-hidden"
        //                 style={{
        //                     resize: "none"
        //                 }}
        //                 rows="5"
        //                 maxLength="30"
        //                 onChange={ this.onChange.bind(this) }
        //                 value={ this.state.word }
        //             ></textarea>
    
        //             <button className="mt4 pa4 w-90 ba br2 f4 blue b--blue code" onClick={ this.onBeginClick.bind(this) }>Begin</button>
        //         </div>
        //     );
        // }

        // return (
        //     <div>
        //         <div className="flex flex-wrap items-center justify-around tc code">
        //             {
        //                 this.context.state.Word.split("").map((l, i)  => {
        //                     if(l.charCodeAt(0) < 65 || l.charCodeAt(0) > 90) {
        //                         return (
        //                             <div className="f3 pb2 ma1 w2" key={ i }>{ l }</div>
        //                         );
        //                     }

        //                     if(this.context.state.Letters.Correct.includes(l)) {                            
        //                         return (
        //                             <div className="f3 pb2 bb ma1 w2" key={ i }>{ l }</div>
        //                         );
        //                     }

        //                     return (
        //                         <div className="f3 pb2 bb ma1 w2" key={ i }>&nbsp;</div>
        //                     );
        //                 })
        //             }
        //         </div>
        //     </div>
        // );
    }
};