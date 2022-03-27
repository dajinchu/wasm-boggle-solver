#![feature(test)]
#[macro_use]
extern crate lazy_static;
extern crate test;
mod linkedlist;
mod solver;
mod utils;

use linkedlist::TrieLinkedList;
use wasm_bindgen::prelude::*;

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
pub fn is_word(word: String) -> bool {
    DICT_EN.traverse(&word).map_or(false, |d| d.is_word())
}
