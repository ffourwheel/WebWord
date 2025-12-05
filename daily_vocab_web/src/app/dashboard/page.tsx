
"use client";

import BarChart from "@/components/BarChart";
import RecentHistory from "@/components/RecentHistory";
import StatsCard from "@/components/StatsCard";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [totalPractices, setTotalPractices] = useState(0);
  const [averageScore, setAverageScore] = useState(0.0);
  const [wordsPracticed, setWordsPracticed] = useState(0);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('wordHistory') || '[]');
    setTotalPractices(history.length);

    if (history.length > 0) {
      const totalScore = history.reduce((sum: number, item: any) => sum + item.score, 0);
      setAverageScore(totalScore / history.length);
      const uniqueWords = new Set(history.map((item: any) => item.word));
      setWordsPracticed(uniqueWords.size);
    } else {
      setAverageScore(0.0);
      setWordsPracticed(0);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Practices" value={totalPractices.toString()} />
        <StatsCard title="Average Score" value={averageScore.toFixed(1)} />
        <StatsCard title="Words Practiced" value={wordsPracticed.toString()} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Practice Distribution</h2>
          <BarChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent History</h2>
          <RecentHistory />
        </div>
      </div>
    </div>
  );
}
