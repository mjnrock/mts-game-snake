import MTSLib from "@lespantsfancy/message-transfer-system";

const Node = MTSLib.Node;
const { GenerateUUID } = MTSLib.Helper;

// import Node from "./../../Node";
// import { GenerateUUID } from "./../../helper";

export default class GridNode extends Node {
    constructor(width, height, { name = null, populator = null, receive = null, mnode = null, packager = null } = {}) {
        super({
            name: name || GenerateUUID(),
            receive: receive,
            mnode: mnode,
            packager: packager
        });

        this.internal = {
            Width: width,
            Height: height,
            Contents: {}
        };

        if(typeof populator === "function") {
            populator(this.internal.Contents, width, height);
        } else {
            for(let x = 0; x < width; x++) {
                for(let y = 0; y < height; y++) {
                    this.set(x, y, null);
                }
            }
        }
    }

    getSize() {
        return {
            w: this.internal.Width,
            h: this.internal.Height,
            size: this.internal.Width * this.internal.Height
        };
    }

    /**
     * Check if the entry set contains the position
     * @param {number} x 
     * @param {number} y 
     */
    exists(x, y) {
        return `${ x }.${ y }` in this.internal.Contents;
    }
    /**
     * Check if the position is NULL
     * @param {number} x 
     * @param {number} y 
     */
    isEmpty(x, y) {
        return this.get(x, y) === null;
    }

    get(x, y) {
        return this.internal.Contents[ `${ x }.${ y }` ];
    }
    /**
     * Set the contents of the position
     * @param {number} x 
     * @param {number} y 
     * @param {any} value 
     */
    set(x, y, value) {
        this.internal.Contents[ `${ x }.${ y }` ] = value;

        return this;
    }

    /**
     * Swap the contents pos0 and pos1
     * @param {number} x0 
     * @param {number} y0 
     * @param {number} x1 
     * @param {number} y1 
     */
    swap(x0, y0, x1, y1) {
        let temp = this.get(x0, y0);

        this.set(x0, y0, this.get(x1, y1));
        this.set(x1, y1, temp);

        return this;
    }
    /**
     * Move the contents from pos0 to pos1, the empty the contents of pos0.
     * ! This will move pos0 to pos1, then DESTROY the (now) pos0 contents (i.e. the original pos1)
     * @param {number} x0 
     * @param {number} y0 
     * @param {number} x1 
     * @param {number} y1 
     */
    move(x0, y0, x1, y1) {
        this.swap(x0, y0, x1, y1);
        this.empty(x0, y0);

        return this;
    }

    /**
     * NULLIFY the position
     * @param {number} x 
     * @param {number} y 
     */
    empty(x, y) {
        this.set(x, y, null);

        return this;
    }

    check(x, y) {
        return {
            isEdge: () => {
                if(x === 0 && (y >= 0 && y <= this.internal.Height - 1)) {
                    return true;
                } else if((x === this.internal.Width - 1) && (y >= 0 && y <= this.internal.Height - 1)) {
                    return true;
                }

                if(y === 0 && (x >= 0 && x <= this.internal.Width - 1)) {
                    return true;
                } else if((y === this.internal.Height - 1) && (x >= 0 && x <= this.internal.Width - 1)) {
                    return true;
                }

                
                return false;
            }
        }
    }


    each(fn) {
        if(typeof fn === "function") {            
            for(let x = 0; x < this.internal.Width; x++) {
                for(let y = 0; y < this.internal.Height; y++) {
                    fn({ entry: () => this.get(x, y), x, y, name: `${ x }.${ y }`, get: this.get.bind(this), set: this.set.bind(this), check: this.check.bind(this) });
                }
            }
        }
    }
};