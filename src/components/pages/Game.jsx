/* eslint-disable no-unused-vars */
import React from "react";
import MTSLib from "@lespantsfancy/message-transfer-system";

import SignalTypes from "./../../SignalTypes";

import Alphabet from "./Alphabet";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            subscriptionId: null
        };
    }
    componentDidMount() {
        let id = this.context.subscribe(() => this.forceUpdate());

        this.setState({
            subscriptionId: id
        });
        
        setTimeout(() => {
            this.context.internal.MODE = "CONTROLLER";
            this.context.message((new MTSLib.Message(
                SignalTypes.DECLARE_MODE,
                this.context.internal.MODE
            )).elevate());
        }, 0);
    }    
    componentWillUnmount() {
        this.context.unsubscribe(this.state.subscriptionId)
    }

    render() {
        return (
            <Alphabet />
        );
    }
};