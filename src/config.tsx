type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
type Accidental = 'bb' | 'b' | '' | '#' | 'x';
type Octave =
  | -4
  | -3
  | -2
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11;

export const availableLetters: Letter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export const availableAccidentals: Accidental[] = ['b', '#', ''];
export const availableOctaves: Octave[] = [1, 2, 3];
