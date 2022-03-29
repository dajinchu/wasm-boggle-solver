use crate::{linkedlist::TrieLinkedList, timer::Timer};

pub type Board = Vec<Vec<char>>;
// Row, Col format
pub type Pos = (usize, usize);

pub fn board_from_string(str: String) -> Board {
    let mut board: Board = Vec::new();
    for row in str.lines() {
        board.push(row.chars().collect::<Vec<char>>());
    }
    board
}

// Find longest word in the board
pub fn find_best(words: &TrieLinkedList, board: &Board) -> (String, Vec<Pos>) {

    let _timer = Timer::new("find_best");
    let mut best = ("".to_string(), Vec::new());
    let height = board.len();
    let width = board[0].len();
    for row in 0..height {
        for col in 0..width {
            let word = find_best_acc(
                words,
                board,
                (row, col),
                &mut "".to_string(),
                &mut Vec::new(),
            );
            if let Some(w) = word {
                if w.1.len() > best.1.len() {
                    best = w;
                }
            }
        }
    }
    best
}

// Find longest word in the board if we've already taken the given path to build the given string
fn find_best_acc(
    words: &TrieLinkedList,
    board: &Board,
    pos: Pos,
    word_so_far: &mut String,
    path: &mut Vec<Pos>,
) -> Option<(String, Vec<Pos>)> {
    let char_at = board[pos.0][pos.1];
    if !char_at.is_alphabetic() {
        return None;
    }
    word_so_far.push(char_at);
    // println!("path: {:?}, word: {:?}", path, word_so_far);

    match words.traverse(&char_at.to_string()) {
        Some(dict) => {
            path.push(pos);
            let best = neighbors(board, pos)
                .iter()
                .filter(|p| !path.contains(*p))
                .filter_map(|p| {
                    find_best_acc(dict, board, *p, &mut word_so_far.clone(), &mut path.clone())
                })
                .max_by(|x, y| x.1.len().cmp(&y.1.len()));
            // println!("word so far: {:} best: {:?}", word_so_far, best);
            match best {
                Some(s) => Some(s),
                None => {
                    if dict.is_word() {
                        Some((word_so_far.to_string(), path.to_vec()))
                    } else {
                        None
                    }
                }
            }
        }
        None => None,
    }
}

// get the neighbors of this pos
fn neighbors(board: &Board, pos: Pos) -> Vec<Pos> {
    let width = board[0].len();
    let height = board.len();
    let mut v = Vec::with_capacity(8);

    let row = pos.0;
    let col = pos.1;
    if row > 0 {
        if col > 0 {
            v.push((row - 1, col - 1));
        }
        if col + 1 < width {
            v.push((row - 1, col + 1));
        }
        v.push((row - 1, col));
    }
    if row + 1 < height {
        if col > 0 {
            v.push((row + 1, col - 1));
        }
        if col + 1 < width {
            v.push((row + 1, col + 1));
        }
        v.push((row + 1, col));
    }
    if col > 0 {
        v.push((row, col - 1));
    }
    if col + 1 < width {
        v.push((row, col + 1));
    }
    v
}

#[cfg(test)]
mod tests {
    use super::*;

    // fn make_dict() -> impl Trie {
    //     TrieLinkedListArena::from_file("./words_alpha.txt").unwrap()
    // }

    #[test]
    fn board_from_string_works() {
        assert_eq!(
            board_from_string("hey\nbro".to_string()),
            vec![vec!['h', 'e', 'y'], vec!['b', 'r', 'o']]
        );
    }

    #[test]
    fn solve_3by3() {
        let words = TrieLinkedList::from_file("./words_alpha.txt").unwrap();
        let board = vec![
            vec!['x', 'y', 'q'],
            vec!['h', ' ', 'o'],
            vec!['e', 'l', 'l'],
        ];
        assert_eq!(
            find_best(&words, &board),
            (
                "hello".to_string(),
                vec![(1, 0), (2, 0), (2, 1), (2, 2), (1, 2)]
            )
        );
    }

    #[test]
    fn solve_single_row() {
        let words = TrieLinkedList::from_file("./words_alpha.txt").unwrap();
        let board = vec![vec!['h', 'e', 'l', 'l', 'o']];
        assert_eq!(
            find_best(&words, &board),
            (
                "hello".to_string(),
                vec![(0, 0), (0, 1), (0, 2), (0, 3), (0, 4)]
            )
        );
    }
}
