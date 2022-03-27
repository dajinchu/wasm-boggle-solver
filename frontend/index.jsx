import * as wasm from "wasm-boggle-solver";
import React from "react";
import ReactDOM from "react-dom";
import { App } from './src/App';

ReactDOM.render(<App/>, document.getElementById("root"));
alert(wasm.is_word("hello"))