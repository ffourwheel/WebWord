export function scoreSentence(word: string, sentence: string): number {
    if (!sentence.trim()) {
        return 0;
    }

    let score = 0;

    // Rule 1: Sentence must contain the word
    if (sentence.toLowerCase().includes(word.toLowerCase())) {
        score += 5; // Base score for including the word
    }

    // Rule 2: Sentence length (encourages more descriptive sentences)
    const wordsInSentence = sentence.split(/\s+/).filter(Boolean).length;
    if (wordsInSentence >= 5) {
        score += Math.min(3, (wordsInSentence - 5) * 0.5); // Max 3 points for length
    }

    // Rule 3: Word used correctly (simple check: not just the word itself)
    if (sentence.toLowerCase().trim() !== word.toLowerCase().trim()) {
        score += 1; // Small bonus for not just repeating the word
    }

    // Normalize score to a 0-10 scale
    // Max possible score with these rules: 5 (contains word) + 3 (length) + 1 (not just word) = 9
    // Let's scale it to 10, so 9 becomes 10.
    return Math.min(10, (score / 9) * 10);
}
