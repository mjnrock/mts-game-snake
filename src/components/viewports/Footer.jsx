/* eslint-disable no-unused-vars */
import React from "react";

import Context from "./../../Context";

export default class Footer extends React.Component {    
    render() {
        return (
            <div className="footer">
                <a className="footer-left flex flex-column code f6" target="_blank" rel="noopener noreferrer" href={ `http://${ Context.MTS.internal.URL }/c` }>
                    <span>Controller</span>
                    <img alt="url" src={ Context.MTS.internal.QRCODE.controller } />
                </a>
                <a className="footer-right flex flex-column code f6" target="_blank" rel="noopener noreferrer" href={ `http://${ Context.MTS.internal.URL }/v` }>
                    <span>Viewport</span>
                    <img alt="url" src={ Context.MTS.internal.QRCODE.viewport } />
                </a>
            </div>
        );
    }
};