'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Loader2, Play, Flame, Timer, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface WordData { word: string; pronunciation: string; type: string; meaning: string; example: string; image: string; level: string;}
interface ResultData { score: number; level: string; suggestion: string; corrected_sentence: string;}
interface ChartData { time: string; score: number; }

export default function WorddeePage() {
  const [view, setView] = useState<'challenge' | 'result' | 'dashboard'>('challenge');
  const [isLoading, setIsLoading] = useState(false);
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [inputSentence, setInputSentence] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const SKIP_LIMIT = 3; 
  const COOLDOWN_DURATION = 30;
  const [skipCount, setSkipCount] = useState(0);
  const [cooldown, setCooldown] = useState(0); 

  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
      if (cooldown > 0) {
          const timer = setInterval(() => {
              setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
          }, 1000);
          return () => clearInterval(timer);
      } else if (cooldown === 0 && skipCount > 0) {
          setSkipCount(0); 
      }
  }, [cooldown, skipCount]);

  const goToChallenge = () => {
    setView('challenge');
  };

  const loadDashboard = async () => {
  try {
    const res = await axios.get(`${API_URL}/summary`);
    const formatted = res.data.dates.map((d:string, i:number) => ({ time: d, score: res.data.scores[i] }));
    setChartData(formatted);
    setStreak(res.data.current_streak || 0);
    setTotalMinutes(res.data.total_minutes || 0);
    setView('dashboard');
  } catch (error) { console.error("Error dashboard:", error); }
};

  const fetchNewWord = async () => {
      if (cooldown > 0 || isLoading) return;

      const nextCount = skipCount + 1;
      if (nextCount >= SKIP_LIMIT) {
          setCooldown(COOLDOWN_DURATION);
          setSkipCount(0);
      } else {
          setSkipCount(nextCount);
      }

      try {
        const res = await axios.get(`${API_URL}/word`);
        setWordData(res.data);
        setInputSentence('');
        setResult(null);
        setView('challenge');
      } catch (error) { 
        setSkipCount(c => c > 0 ? c - 1 : 0);
        console.error("Error fetching word:", error); 
      }
  };

  useEffect(() => { fetchNewWord(); }, []);

  const handleSubmit = async () => {
      if (cooldown > 0 || isLoading) return;
      if (!inputSentence || !wordData) return;
      setIsLoading(true);

      try {
          const res = await axios.post(`${API_URL}/validate`, {
              word: wordData.word, sentence: inputSentence
          });
          setResult(res.data);
          setView('result');
          setCooldown(0);

      } catch (error: any) {
          alert(`Error connecting to AI Server. Details: ${error.response?.data?.detail || error.message}`);
      } finally {
          setIsLoading(false);
      }
  };

  if (!wordData) return <div className="h-screen flex items-center justify-center bg-[#8da3a6] text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#8da3a6] font-sans text-gray-800">

      <nav className="flex justify-between items-center px-8 py-5 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="text-xl font-bold font-serif tracking-tight text-gray-900 cursor-pointer" onClick={goToChallenge}>worddee.ai</div>
        <div className="flex gap-8 text-sm text-gray-500 font-medium">
          <button onClick={loadDashboard} className="text-blue-500 hover:text-blue-700">My Progress</button>
          <button onClick={goToChallenge} className="text-blue-500 hover:text-blue-700">Word of the Day</button>
        </div>
        <div className="w-8 h-8 bg-[#0ea5e9] rounded-full flex items-center justify-center text-white cursor-pointer"><User size={18} /></div>
      </nav>

      <main className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">

        <div className={`bg-white rounded-[2rem] shadow-xl w-full p-8 md:p-12 transition-all duration-500 ${view === 'dashboard' ? 'max-w-4xl' : 'max-w-3xl'}`}>

          {view === 'challenge' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#1f2937] mb-2">Word of the day</h1>
                    <p className="text-gray-500 text-sm">Practice writing a meaningful sentence using today's word.</p>
                </div>

                <div className="border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row gap-6 relative mb-8">
                    <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={wordData.image} alt={wordData.word} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = "https://i.postimg.cc/9MD9mRxY/02.jpg"; }}/>
                    </div>
                    <div className="flex-1 py-1">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-4xl font-serif font-bold text-[#1f2937]">{wordData.word}</h2>
                            </div>
                            <span className="bg-[#fef3c7] text-[#92400e] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Level {wordData.level || 'General'}
                            </span>
                        </div>
                        
                        <p className="text-gray-400 font-sans text-sm font-medium mb-3 ml-8 tracking-wide">{wordData.pronunciation}</p>
                        <div className="space-y-3 text-sm">
                            <p className="text-gray-800"><span className="font-bold text-gray-900">Meaning: </span>{wordData.meaning}</p>
                            <p className="text-gray-500 italic">"{wordData.example}"</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <textarea className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none h-24" placeholder={`Compose a sentence with "${wordData.word}"...`} value={inputSentence} onChange={(e) => setInputSentence(e.target.value)}/>
                </div>

                <div className="flex justify-between items-center">
                    <button 
                        onClick={fetchNewWord} 
                        disabled={cooldown > 0 || isLoading} 
                        className="px-8 py-3 rounded-full border border-gray-300 text-[#1f2937] font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        {cooldown > 0 ? `Retry in ${cooldown}s` : 'Skip / New Word'}
                    </button>
                    
                    <button 
                        onClick={handleSubmit}
                        disabled={!inputSentence || isLoading || cooldown > 0} 
                        className="bg-[#1f2937] text-white px-10 py-3 rounded-full font-semibold hover:bg-black transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading && <Loader2 className="animate-spin" size={18} />} {isLoading ? 'Checking...' : 'Submit'}
                    </button>
                </div>
            </div>
          )}

          {view === 'result' && result && (
             <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
               <h1 className="text-3xl font-serif font-bold text-gray-800">Challenge completed</h1>
               
                <div className="flex justify-center gap-4">
                    <span className="bg-[#fef3c7] text-[#92400e] px-4 py-1 rounded-full font-semibold text-sm shadow-sm">Level {result.level}</span>
                    <span className="bg-[#f3e8ff] text-[#6b21a8] px-4 py-1 rounded-full font-semibold text-sm shadow-sm">Score {result.score.toFixed(1)}</span>
                </div>
                
                <div className="text-left py-4 px-2 border-b border-gray-200">
                    <p className="font-bold text-sm mb-1">Your sentence:</p>
                    <p className="text-gray-700 font-medium text-lg">"{inputSentence}"</p>
                </div>

                <div className="bg-[#ecfdf5] border border-[#d1fae5] rounded-xl p-6 text-left space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#10b981]"></div>
                    
                    <div>
                        <p className="text-[#047857] font-bold text-sm mb-1 uppercase tracking-wide">AI Feedback</p>
                        <p className="text-[#065f46] text-sm leading-relaxed">{result.suggestion}</p>
                    </div>

                    <div className="pt-4 border-t border-[#a7f3d0]">
                       <p className="text-[#047857] font-bold text-sm mb-1 uppercase tracking-wide">Better Version</p>
                       <p className="text-[#065f46] italic text-sm">"{result.corrected_sentence}"</p>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <button onClick={fetchNewWord} className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition shadow-sm">Close</button>
                    <button onClick={loadDashboard} className="bg-[#1f2937] text-white px-8 py-3 rounded-full font-semibold hover:bg-black transition shadow-lg">View my progress</button>
                </div>
            </div>
          )}

          {view === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">

                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Student's learner dashboard</h1>
                    <p className="text-gray-500 mt-1">Your missions today</p> 
                </div>

                <div className="space-y-2">
                    <div className="bg-gray-100 rounded-lg p-3 text-gray-700 font-medium text-sm flex items-center gap-2 border border-gray-200">
                        <span className="text-green-600">✔</span> Well done! You've completed all your missions.
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-gray-700">Overview</h2>

                    <div className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-around items-center gap-6 bg-white shadow-sm">

                <div className="flex flex-col items-center">
                        <h3 className="text-lg font-serif font-bold text-gray-700 mb-2">Learning consistency</h3>
                        <div className="flex items-center gap-2">
                            <Flame className="text-green-500 animate-pulse" size={28} fill="#22c55e" />
                            <span className="text-4xl font-bold text-gray-800">{streak}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">Day streak</p>
                    </div>

                    <div className="hidden md:block w-px h-16 bg-gray-200"></div>
                <div className="flex flex-col items-center justify-end h-full pt-8">
                    <h3 className="text-lg font-serif font-bold text-gray-700 mb-2">Total learning time</h3>
                        <div className="flex items-center gap-2">
                            <Timer className="text-blue-500" size={28} />
                            <span className="text-4xl font-bold text-gray-800">{totalMinutes}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1 text-center">Minutes learned</p>
                    </div>
                </div>
                    <div className="border border-gray-200 rounded-xl p-6 md:p-8 bg-white shadow-sm relative min-h-[400px]">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
                            <div className="flex gap-3 items-center">
                                <button className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-1">IELTS speaking test <ChevronDown size={14} /></button>
                                <button className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-1">All parts <ChevronDown size={14} /></button>
                                <span className="text-xs font-bold uppercase text-gray-400 ml-4 hidden md:block">Progress</span>
                            </div>
                            <a href="#" className="text-blue-500 text-xs font-medium hover:underline">View scoring criteria</a>
                        </div>

                        <div className="h-[250px] w-full mt-4">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} dx={-10}/>
                                        <Tooltip />
                                        <Line type="monotone" dataKey="score" stroke="#1f2937" strokeWidth={3} dot={{r: 4, fill: "#1f2937"}} activeDot={{r: 6}}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                                    {'No data available yet. Play a game to see your graph!'}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button onClick={goToChallenge} className="bg-[#1f2937] text-white px-12 py-3 rounded-full font-bold hover:bg-black shadow-lg transition-transform hover:scale-105">
                                Take the test
                            </button>
                        </div>

                    </div>
                </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}