import { Character } from "../types";

export const allKatakana: Character[] = [
  { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, 
  { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, 
  { char: 'オ', romaji: 'o' }, { char: 'カ', romaji: 'ka' },
  { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' },
  { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' }
];

export const katakanaRows = [
  [
    { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, 
    { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, 
    { char: 'オ', romaji: 'o' }
  ],
  [
    { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, 
    { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, 
    { char: 'コ', romaji: 'ko' }
  ],
  // ... Add remaining rows
];
