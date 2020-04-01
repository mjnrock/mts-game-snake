import QRCode from "qrcode";
import React from "react";
import ReactDOM from "react-dom";

import Context from "./Context";
import App from "./App";

Context.MTS.internal.URL = `192.168.86.100:3001`;
Context.MTS.internal.QRCODE = {    
    controller: null,
    viewport: null
};
QRCode.toDataURL(`${ Context.MTS.internal.URL }/c`, function(err, url) {
    Context.MTS.internal.QRCODE.controller = url;
});
QRCode.toDataURL(`${ Context.MTS.internal.URL }/v`, function(err, url) {
    Context.MTS.internal.QRCODE.viewport = url;
});
Context.MTS.Network.webSocketNode({ uri: Context.MTS.internal.URL });


ReactDOM.render(
    <App />,
    document.getElementById("root")
);