/* eslint-disable no-unused-vars */
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Context from "./Context";
import Viewports from "./components/viewports/package";
import Pages from "./components/pages/package";

export default class App extends React.Component {
    static contextType = Context.MTSContext;

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Pages.Game />
                    </Route>
                    <Route path="/c">
                        <Pages.Game />
                    </Route>
                    <Route path="/v">
                        <Viewports.Game />
                    </Route>
                </Switch>
            </Router>
        )
    }
};