import QRCode from "qrcode";
import React from "react";
import ReactDOM from "react-dom";

import Context from "./Context";
import App from "./App";

Context.MTS.internal.URL = `192.168.86.100`;
Context.MTS.internal.QRCODE = {    
    controller: null,
    viewport: null
};
QRCode.toDataURL(`http://${ Context.MTS.internal.URL }:3001/c`, function(err, url) {
    Context.MTS.internal.QRCODE.controller = url;
});
QRCode.toDataURL(`http://${ Context.MTS.internal.URL }:3001/v`, function(err, url) {
    Context.MTS.internal.QRCODE.viewport = url;
});
Context.MTS.Network.webSocketNode({ uri: `${ Context.MTS.internal.URL }:3000` });


ReactDOM.render(
    <App />,
    document.getElementById("root")
);