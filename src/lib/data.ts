export type WordData = {
  id: string;
  word: string;
  partOfSpeech: string;
  level: string;
  meaning: string;
  example: string;
  imageUrl: string;
};

export const MOCK_WORDS: WordData[] = [
  {
    id: "1",
    word: "Runway",
    partOfSpeech: "Noun",
    level: "Beginner",
    meaning: "A strip of hard ground along which aircraft take off and land.",
    example: "The jet braked hard as its wheels touched the runway.",
    imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&q=80", // รูปตัวอย่าง
  },
  {
    id: "2",
    word: "Serendipity",
    partOfSpeech: "Noun",
    level: "Advanced",
    meaning: "The occurrence of events by chance in a happy or beneficial way.",
    example: "It was pure serendipity that we met at the coffee shop right before the rain started.",
    imageUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&q=80",
  }
];

export const mockGradeSentence = async (sentence: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    score: (Math.random() * (10 - 6) + 6).toFixed(1),
    feedback: "The airport's runway is undergoing extensive reconstruction to enhance safety measures.",
    comment: "Great attempt! Your sentence structure is clear.",
  };
};