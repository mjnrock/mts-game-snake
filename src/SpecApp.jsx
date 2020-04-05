/* eslint-disable no-unused-vars */
import React from "react";

import Context from "./Context";

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