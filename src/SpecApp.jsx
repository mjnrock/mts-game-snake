/* eslint-disable no-unused-vars */
import React from "react";
import MTSLib from "@lespantsfancy/message-transfer-system";

import Context from "./Context";

import Dice from "./spec/Dice";
import GridNode from "./spec/GridNode";


const Spec = {
    Grid: new GridNode(20, 20),
    Canvas: new MTSLib.Worker.CanvasNode({
        canvas: document.getElementById("canvas")
    })
};

let tsize = ~~(500 / 20);
Spec.Canvas.resize(500, 500);

Spec.Grid.each(function({ x, y, set, check }) {
    if(check(x, y).isEdge()) {
        set(x, y, Infinity);
        Spec.Canvas.prop({
            fillStyle: "#000"
        })
    } else {
        set(x, y, 0);
        Spec.Canvas.prop({
            fillStyle: "#eee"
        })
    }
    Spec.Canvas.rect(x * tsize, y * tsize, tsize, tsize, { isFilled: true });
});

console.log(Spec);

export default class App extends React.Component {
    static contextType = Context.MTSContext;

    render() {
        return (
            <div>
                Test!
            </div>
        )
    }
};