/* eslint-disable no-unused-vars */
import QRCode from "qrcode";
import React from "react";
import ReactDOM from "react-dom";

import Context from "./Context";
import App from "./App";
import SpecApp from "./SpecApp";




import MTSLib from "@lespantsfancy/message-transfer-system";

import Dice from "./spec/Dice";
import GridNode from "./spec/GridNode";

const MTS = MTSLib.Modules.BrowserInput(new MTSLib.MasterNode({
    nodes: [
        new MTSLib.StateNode({ name: "MainState" })
    ],
    receive: msg => MTSLib.$.MRSP(msg, { node: MTS.find("MainState")[ 0 ] })
        .if(MTSLib.Browser.Input.MouseNode.SignalTypes.MOUSE_CLICK)
            .run(({ payload }) => Spec.Canvas.relPos(payload.x, payload.y), "relpos")
            .resultProp({
                pos: "relpos"
            })
            .call(Spec.Canvas.draw.bind(Spec.Canvas))
    ,routes: [
        MTSLib.Browser.Input.MouseNode.SignalTypes.MOUSE_CLICK
    ]
}), {
    Mouse: true
});

const Spec = {
    Grid: new GridNode(20, 20),
    Canvas: new MTSLib.Worker.CanvasNode({
        canvas: document.getElementById("canvas")
    })
};

MTS.register(Spec.Grid, Spec.Canvas);

let tsize = ~~(500 / 20);

Spec.Canvas.resize(500, 500);
Spec.Canvas.setDraw(function(ts) {
    this.clear();
    Spec.Grid.each(({ x, y, set, check }) => {
        if(check(x, y).isEdge()) {
            set(x, y, Infinity);
            this.prop({
                fillStyle: "#000"
            })
        } else {
            set(x, y, 0);
            this.prop({
                fillStyle: "#eee"
            })
        }
        this.rect(x * tsize, y * tsize, tsize, tsize, { isFilled: true });
    });

    let [ SN ] = MTS.find("MainState");

    // console.log(SN.state);
    if(SN.state.pos) {
        let { x, y } = SN.state.pos;
        this.circle(x, y, 20);
    }
});
Spec.Canvas.draw();

console.log(Spec);


ReactDOM.render(
    <SpecApp />,
    // <App />,
    document.getElementById("root")
);