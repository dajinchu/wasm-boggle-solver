#!/bin/bash
# amazon-linux-extras install rust1
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh 
wasm-pack build ./rust
cd frontend && npm run build
