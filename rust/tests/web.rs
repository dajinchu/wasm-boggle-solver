//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;
extern crate wasm_boggle_solver;
use wasm_boggle_solver::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn test_solve() {
    let mut solver = Solver::new();
    solver.solve("dfjhello".to_string());
    assert_eq!(solver.path(), "hello");
}
