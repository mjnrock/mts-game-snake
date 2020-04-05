import React from "react";
import MTSLib from "@lespantsfancy/message-transfer-system";
import SignalTypes from "./SignalTypes";

const MTS = MTSLib.Modules.Network(new MTSLib.MasterNode({
    receive: function(msg) {
        if(msg.type === SignalTypes.DECLARE_LETTERS) {
            this.state = {
                ...this.state,
                Letters: msg.payload
            };
        } else if(msg.type === SignalTypes.DECLARE_WORD) {
            this.state = {
                ...this.state,
                Word: msg.payload
            };
        } else if(msg.type === SignalTypes.DECLARE_WINNER) {
            this.state = {
                ...this.state,
                Winner: msg.payload
            };
        } else if(msg.type === SignalTypes.NEW_GAME || msg.type === SignalTypes.SYNC_STATE) {
            this.state = {
                ...msg.payload
            };
        }
    }
}));
MTS.toggleStateEmission();

MTS.internal.MODE = "CONTROLLER";

const MTSContext = React.createContext(MTS);

export default {
    MTS,
    MTSContext
};