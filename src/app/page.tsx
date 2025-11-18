"use client";

import { useState, useEffect } from "react";
import { ArrowRight, UserCircle } from "lucide-react";

export default function Home() {
  const [wordData, setWordData] = useState<any>(null);
  const [sentence, setSentence] = useState("");
  const [status, setStatus] = useState<"loading_word" | "input" | "evaluating" | "result">("loading_word");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchWord();
  }, []);

  const fetchWord = async () => {
    setStatus("loading_word");
    try {
      const res = await fetch("/api/word");
      const data = await res.json();
      
      if (!data.word) {
        console.error("API Error:", data);
        throw new Error("Data incomplete");
      }

      setWordData(data);
      setStatus("input");
      setSentence("");
      setResult(null);
    } catch (e) {
      console.error(e);

      setWordData({
        word: "Error",
        partOfSpeech: "System",
        level: "N/A",
        meaning: "Failed to fetch data. Please check your API Key.",
        example: "Please check console logs.",
        imageUrl: "https://placehold.co/400?text=Error"
      });
      setStatus("input");
    }
  };

  const handleSubmit = async () => {
    if (!sentence) return;
    setStatus("evaluating");
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        body: JSON.stringify({ word: wordData.word, userSentence: sentence }),
      });
      const data = await res.json();
      setResult(data);
      setStatus("result");
    } catch (e) {
      console.error(e);
      setStatus("input");
    }
  };

  return (
    <div className="min-h-screen bg-bg-main font-sans p-8 flex flex-col">
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center mb-10">
        <div className="font-bold text-xl tracking-tight">worddee.ai</div>
        <div className="flex gap-6 text-sm text-gray-500 font-medium">
          <a href="#" className="text-blue-500">My Progress</a>
          <a href="#" className="text-blue-400">Word of the Day</a>
        </div>
        <UserCircle className="text-teal-600 w-8 h-8" />
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-bg-card rounded-sm p-12 min-h-[600px] flex items-center justify-center relative shadow-2xl">
          
          {(status === "loading_word" || status === "input") && (
            <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-4xl flex gap-8 animate-in fade-in duration-500">
              {status === "loading_word" ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-400">Generating Word...</div>
              ) : (
                <>
                  <div className="w-[240px] flex-shrink-0">
                    <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-inner">
                      <img 
                        src={`https://source.unsplash.com/random/400x400/?${wordData.word}`} 
                        alt={wordData.word} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/400x400/e2e8f0/1e293b?text=No+Image")}
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Word of the day</span>
                      <p className="text-gray-500 text-sm mt-1">Practice writing a meaningful sentence using today's word.</p>
                    </div>

                    <hr className="my-4 border-gray-100"/>

                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-serif font-bold text-gray-900">▶ {wordData.word}</h1>
                        <span className="bg-[#FDF6B2] text-[#723B13] text-xs px-2 py-1 rounded font-bold border border-yellow-200 shadow-sm">
                          Level {wordData.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono mb-2">{wordData.partOfSpeech} [{wordData.word.toLowerCase()}]</p>
                      <p className="text-sm text-gray-700 font-medium mb-2"><span className="font-bold text-gray-900">Meaning:</span> {wordData.meaning}</p>
                      <p className="text-sm text-gray-500 italic">"{wordData.example}"</p>
                    </div>

                    <div className="mt-auto">
                      <input 
                        type="text"
                        value={sentence}
                        onChange={(e) => setSentence(e.target.value)}
                        placeholder={`The ${wordData.word.toLowerCase()} is...`}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 mb-6 shadow-sm"
                      />
                      
                      <div className="flex justify-between items-center">
                        <button onClick={fetchWord} className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                          Do it later
                        </button>
                        <button 
                          onClick={handleSubmit}
                          disabled={!sentence}
                          className="px-10 py-2.5 rounded-full bg-[#1F3A3D] text-white text-sm font-bold hover:bg-opacity-90 transition shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {status === "evaluating" && (
            <div className="bg-white rounded-2xl p-12 shadow-xl w-full max-w-2xl flex flex-col items-center justify-center text-center animate-pulse">
               <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
               <div className="h-4 bg-gray-200 rounded w-1/2 mb-10"></div>
               <div className="h-12 w-full bg-gray-100 rounded-lg mb-4"></div>
               <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
               <p className="mt-8 text-gray-400 text-sm font-medium animate-bounce">AI is checking your grammar...</p>
            </div>
          )}

          {status === "result" && result && (
            <div className="bg-white rounded-2xl p-10 shadow-xl w-full max-w-3xl animate-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Challenge completed</h2>
                <div className="flex justify-center gap-3">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold border border-yellow-200">
                    Level {wordData.level}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold border border-purple-200">
                    Score {result.score}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Your sentence</label>
                   <div className="text-gray-800 text-base font-serif border-l-4 border-gray-300 pl-4 py-1">
                     {sentence}
                   </div>
                </div>

                <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-xl p-5">
                   <label className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 block">Suggestion</label>
                   <p className="text-green-900 text-sm leading-relaxed font-medium mb-2">
                     {result.feedback}
                   </p>
                   <p className="text-green-700 text-xs italic opacity-80">
                     Reason: {result.reasoning}
                   </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-10">
                <button onClick={fetchWord} className="px-8 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50">
                  New Word
                </button>
                <button className="px-8 py-2.5 rounded-full bg-btn-primary text-white text-sm font-bold hover:bg-opacity-90 flex items-center gap-2 shadow-lg">
                  View my progress <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}