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

const SIZE = 50;
const CANVAS_SIZE = 500;
const TILE_SIZE = ~~(CANVAS_SIZE / SIZE);

const Spec = {
    Grid: new GridNode(SIZE, SIZE),
    Canvas: new MTSLib.Worker.CanvasNode({
        canvas: document.getElementById("canvas")
    })
};

const MainState = new MTSLib.StateNode({ name: "MainState" });
MainState.state = {
    x: 2,
    y: 2,
    facing: "E"
};

const MTS = MTSLib.Modules.BrowserInput(new MTSLib.MasterNode({
    nodes: [
        MainState
    ],
    receive: msg => MTSLib.$.MRSP(msg, { node: MainState })
        // .if(MTSLib.Browser.Input.MouseNode.SignalTypes.MOUSE_CLICK)
        //     .run(({ payload }) => Spec.Canvas.relPos(payload.x, payload.y), "relpos")
        //     .resultProp({
        //         pos: "relpos"
        //     })
        //     .call(Spec.Canvas.draw.bind(Spec.Canvas))
        .if(MTSLib.Browser.Input.KeyboardNode.SignalTypes.KEY_DOWN)
            .run(({ payload }) => {
                let { key } = payload;

                if(key === 65) {    // L
                    MainState.state.facing = "W";
                } else if(key === 68) { // R
                    MainState.state.facing = "E";
                } else if(key === 87) { // U
                    MainState.state.facing = "N";
                } else if(key === 83) { // D
                    MainState.state.facing = "S";
                }
            })
            // .call(Spec.Canvas.draw.bind(Spec.Canvas))
    , routes: [
        MTSLib.Browser.Input.KeyboardNode.SignalTypes.KEY_UP,
        MTSLib.Browser.Input.KeyboardNode.SignalTypes.KEY_DOWN,
        MTSLib.Browser.Input.KeyboardNode.SignalTypes.KEY_MASK,
        MTSLib.Browser.Input.MouseNode.SignalTypes.MOUSE_CLICK
    ]
}), {
    Mouse: true,
    Keys: true,
});

MTS.register(Spec.Grid, Spec.Canvas);

// let intId = MTS.addCallback(function() {
//     if(MainState.state.facing === "E") {
//         MainState.state.x += 1;
//     } else if(MainState.state.facing === "W") {
//         MainState.state.x -= 1;
//     } else if(MainState.state.facing === "N") {
//         MainState.state.y -= 1;
//     } else if(MainState.state.facing === "S") {
//         MainState.state.y += 1;
//     }

//     let { x, y } = MainState.state;
//     if(x < 5 || y < 5 || x > Spec.Grid.internal.Width - 5 || y > Spec.Grid.internal.Height - 5) {
//         MTS.clearInterval(intId);
//     }

//     Spec.Canvas.draw();
// }, 200);



Spec.Canvas.resize(CANVAS_SIZE, CANVAS_SIZE);
Spec.Canvas.setDraw(function(ts) {
    this.clear();
    Spec.Grid.each(({ x, y, set, check }) => {
        if(check(x, y).isEdge()) {
            // set(x, y, Infinity);
            this.prop({
                fillStyle: "#000"
            })
        } else {
            // set(x, y, 0);
            this.prop({
                fillStyle: "#eee"
            })
        }
        this.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, { isFilled: true });
    });

    let [ SN ] = this._mnode.find("MainState");

    // console.log(SN.state);
    if(SN.state) {
        let { x, y } = SN.state;

        this.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, { isFilled: true });
    }
});

Spec.Canvas.draw();

console.log(Spec);


ReactDOM.render(
    <SpecApp />,
    // <App />,
    document.getElementById("root")
);