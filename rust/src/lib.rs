#![feature(test)]
#[macro_use]
extern crate lazy_static;
extern crate test;
extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}
mod linkedlist;
mod solver;
mod timer;
mod utils;

use linkedlist::TrieLinkedList;
use solver::{find_best, Board};
use wasm_bindgen::prelude::*;

use crate::{
    solver::{board_from_string, Pos},
    timer::Timer,
};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

const WORDS_EN: &str = include_str!("../words_alpha.txt");

lazy_static! {
    static ref DICT_EN: TrieLinkedList = {
        let mut dict = TrieLinkedList::blank(' ');
        WORDS_EN.lines().for_each(|word| dict.add_word(word));
        dict
    };
}

#[wasm_bindgen]
pub fn init() {
    // initialize dict
    lazy_static::initialize(&DICT_EN);
}

#[wasm_bindgen]
pub struct Solver {
    path: String,
    word: String,
}

#[wasm_bindgen]
impl Solver {
    pub fn new() -> Solver {
        Solver {
            word: String::new(),
            path: String::new(),
        }
    }

    pub fn solve(&mut self, word: String) {
        let _timer = Timer::new("Solver::solve");
        let best = find_best(&*DICT_EN, &board_from_string(word));
        self.word = best.0;
        self.path = best
            .1
            .iter()
            .map(|p| format!("{},{}", p.0, p.1))
            .collect::<Vec<String>>()
            .join("|");
    }

    pub fn path(&self) -> String {
        self.path.clone()
    }
}
