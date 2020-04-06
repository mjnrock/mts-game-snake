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
import LinkedList from "./spec/LinkedList";

const EnumTileType = {
    VOID: Infinity,
    GROUND: 0,
    HEAD: 1,
    BODY: 2,

    APPLE: 4
}

const SIZE = 25;
const CANVAS_SIZE = 300;
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
    body: new LinkedList(),
    facing: "E",
    points: 0
};

const MTS = MTSLib.Modules.BrowserInput(new MTSLib.MasterNode({
    nodes: [
        MainState
    ],
    receive: msg => MTSLib.$.MRSP(msg, { node: MainState })
        .if(MTSLib.Browser.Input.KeyboardNode.SignalTypes.KEY_DOWN)
            .run(({ payload }) => {
                let { key } = payload,
                    { x, y } = MainState.state;

                if(key === 65) {    // L
                    if(Spec.Grid.get(x - 1, y) !== EnumTileType.BODY) {
                        MainState.state.facing = "W";
                    }
                } else if(key === 68) { // R
                    if(Spec.Grid.get(x + 1, y) !== EnumTileType.BODY) {
                        MainState.state.facing = "E";
                    }
                } else if(key === 87) { // U
                    if(Spec.Grid.get(x, y - 1) !== EnumTileType.BODY) {
                        MainState.state.facing = "N";
                    }
                } else if(key === 83) { // D
                    if(Spec.Grid.get(x, y + 1) !== EnumTileType.BODY) {
                        MainState.state.facing = "S";
                    }
                }
            })
        .if(MTSLib.Browser.Input.TouchNode.SignalTypes.SWIPE_LEFT)
            .call(() => {
                if(Spec.Grid.get(MainState.state.x - 1, MainState.state.y) !== EnumTileType.BODY) {
                    MainState.state.facing = "W";
                }
            })
        .if(MTSLib.Browser.Input.TouchNode.SignalTypes.SWIPE_RIGHT)
            .call(() => {
                if(Spec.Grid.get(MainState.state.x + 1, MainState.state.y) !== EnumTileType.BODY) {
                    MainState.state.facing = "E";
                }
            })
        .if(MTSLib.Browser.Input.TouchNode.SignalTypes.SWIPE_UP)
            .call(() => {
                if(Spec.Grid.get(MainState.state.x, MainState.state.y - 1) !== EnumTileType.BODY) {
                    MainState.state.facing = "N";
                }
            })
        .if(MTSLib.Browser.Input.TouchNode.SignalTypes.SWIPE_DOWN)
            .call(() => {
                console.log(9876);
                if(Spec.Grid.get(MainState.state.x, MainState.state.y + 1) !== EnumTileType.BODY) {
                    MainState.state.facing = "S";
                }
            })
        .if(MTSLib.Browser.Input.TouchNode.SignalTypes.TOUCH_CLICK)
            .call(() => {
                console.log(1234);
            })
    , routes: [
        MTSLib.Browser.Input.KeyboardNode.SignalTypes.KEY_DOWN,
        MTSLib.Browser.Input.TouchNode.SignalTypes.SWIPE_LEFT,
        MTSLib.Browser.Input.TouchNode.SignalTypes.SWIPE_RIGHT,
        MTSLib.Browser.Input.TouchNode.SignalTypes.SWIPE_UP,
        MTSLib.Browser.Input.TouchNode.SignalTypes.SWIPE_DOWN,
        MTSLib.Browser.Input.TouchNode.SignalTypes.TOUCH_CLICK,
    ]
}), {
    Touch: true,
    Keys: true,
});

MTS.register(Spec.Grid, Spec.Canvas);


Spec.Grid.each(({ x, y, set, check }) => {
    if(check(x, y).isEdge()) {
        set(x, y, EnumTileType.VOID);
    } else if(x === MainState.state.x && y === MainState.state.y) {
        set(x, y, EnumTileType.HEAD);
    } else {
        set(x, y, EnumTileType.GROUND);
    }
});

let renders = 0;

MTS.addInterval(function() {
    let px = MainState.state.x,
        py = MainState.state.y,
        tpx, tpy,
        npx = px,
        npy = py;

    if(MainState.state.facing === "E") {
        npx += 1;
    } else if(MainState.state.facing === "W") {
        npx -= 1;
    } else if(MainState.state.facing === "N") {
        npy -= 1;
    } else if(MainState.state.facing === "S") {
        npy += 1;
    }

    MainState.state.x = npx;
    MainState.state.y = npy;

    let npos = Spec.Grid.get(npx, npy);
    if(npos === EnumTileType.GROUND) {
        Spec.Grid.swap(px, py, npx, npy);
    } else if(npos === EnumTileType.APPLE) {        
        MainState.state.points += 10;

        MainState.state.body.add({
            npx,
            npy
        });
        
        Spec.Grid.set(px, py, EnumTileType.GROUND);
        Spec.Grid.set(npx, npy, EnumTileType.HEAD);
    } else if(npos === EnumTileType.VOID || npos === EnumTileType.BODY) {
        EndGame();
    }

    if(!MainState.state.body.isEmpty()) {
        MainState.state.body.each((part, i) => {
            tpx = part.data.x;
            tpy = part.data.y;

            Spec.Grid.set(tpx, tpy, EnumTileType.GROUND);

            part.data.x = px;
            part.data.y = py;

            Spec.Grid.set(px, py, EnumTileType.BODY);

            px = tpx;
            py = tpy;
        });
    }

    let { x, y } = MainState.state;
    if(Spec.Grid.check(x, y).isEdge()) {
        EndGame();
    }
}, 200, { name: "tick" });

MTS.addInterval(function() {
    Spec.Canvas.draw();
}, 100, { name: "draw" });

MTS.addRandomInterval(function() {
    let x = Dice.random(1, Spec.Grid.width - 1),
        y = Dice.random(1, Spec.Grid.height - 1);

    while(Spec.Grid.check(x, y).isEdge() || (x === MainState.state.x && y === MainState.state.y)) {
        x = Dice.random(1, Spec.Grid.width - 1);
        y = Dice.random(1, Spec.Grid.height - 1);
    }

    Spec.Grid.set(x, y, EnumTileType.APPLE);
}, 3000, 6000, { name: "fruit" });



function EndGame() {    
    MTS.clearInterval("tick");
    MTS.clearInterval("draw");
    MTS.clearInterval("fruit");
}



Spec.Canvas.resize(CANVAS_SIZE, CANVAS_SIZE);
Spec.Canvas.setDraw(function(ts) {
    ++renders;

    this.clear();
    Spec.Grid.each(({ x, y, entry, check }) => {
        if(check(x, y).isEdge()) {
            this.prop({
                fillStyle: "#000"
            });
        } else if(entry() === 0) {
            this.prop({
                fillStyle: "#eee"
            });
        } else if(entry() === 1) {
            this.prop({
                fillStyle: "#458940"
            });
        } else if(entry() === 2) {
            this.prop({
                fillStyle: "#418ec1"
            });
        } else if(entry() === 4) {
            this.prop({
                fillStyle: "#a83939"
            });
        }
        this.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, { isFilled: true });
    });

    document.getElementById("code").innerHTML = `${ MainState.state.points } | ${ renders }`;
});

Spec.Canvas.draw();

console.log(Spec);


ReactDOM.render(
    <SpecApp />,
    // <App />,
    document.getElementById("root")
);