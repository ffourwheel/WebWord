import { NextResponse } from "next/server";
import { scoreSentence } from "@/lib/scoring";

export async function POST(request: Request) {
  const { word, sentence } = await request.json();

  if (!word || !sentence) {
    return NextResponse.json(
      { error: "Missing word or sentence in request body" },
      { status: 400 }
    );
  }

  const score = scoreSentence(word, sentence);

  return NextResponse.json({ score });
}
