export interface TranslationResponse {
  japanese: string;
  romaji: string;
  syllables: string;
}

export interface TranslationRequest {
  text: string;
}
