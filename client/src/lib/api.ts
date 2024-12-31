interface TranslationResponse {
  japanese: string;
  romaji: string;
  syllables: string;
}

export async function translateText(text: string): Promise<TranslationResponse> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}
