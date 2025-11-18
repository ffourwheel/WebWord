"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";
import { ArrowLeft, Clock, Flame } from "lucide-react";

// ข้อมูลจำลองสำหรับกราฟ (IELTS Progress)
const data = [
  { name: 'Test 1', score: 5.5 },
  { name: 'Test 2', score: 6.0 },
  { name: 'Test 3', score: 6.0 },
  { name: 'Test 4', score: 6.5 },
  { name: 'Test 5', score: 7.0 },
  { name: 'Test 6', score: 6.5 },
  { name: 'Test 7', score: 7.5 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-brand-bg p-8 font-sans">
      {/* Header / Nav */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-8">
             <h1 className="text-2xl font-bold text-brand-primary">worddee.ai</h1>
             <div className="w-8 h-8 rounded-full bg-teal-600"></div>
        </div>
        
        <Link href="/" className="text-sm text-gray-500 hover:text-brand-primary flex items-center gap-1 mb-4">
            <ArrowLeft size={16} /> Back to Word of the Day
        </Link>

        <h2 className="text-3xl font-serif text-brand-primary mb-6">User’s learner dashboard</h2>

        {/* Missions Alert */}
        <div className="bg-gray-100 border-l-4 border-teal-600 p-4 rounded mb-8">
            <h3 className="font-bold text-brand-primary mb-1">Your missions today</h3>
            <p className="text-sm text-gray-600">Well done! You've completed all your missions.</p>
        </div>

        {/* Overview Section */}
        <h3 className="text-xl font-serif font-bold text-brand-primary mb-4">Overview</h3>
        
        {/* Stats Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h4 className="font-bold text-gray-700 mb-4">Learning consistency</h4>
            <div className="flex justify-around items-center">
                <div className="text-center">
                    <div className="flex justify-center text-green-500 mb-2"><Flame size={32} /></div>
                    <div className="text-3xl font-bold text-gray-800">1</div>
                    <div className="text-xs text-gray-400 uppercase">Day streak</div>
                </div>
                <div className="h-12 w-px bg-gray-200"></div>
                <div className="text-center">
                    <div className="flex justify-center text-blue-500 mb-2"><Clock size={32} /></div>
                    <div className="text-3xl font-bold text-gray-800">10</div>
                    <div className="text-xs text-gray-400 uppercase">[Hours / Minutes] learned</div>
                </div>
            </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2 items-center text-sm font-bold text-gray-700">
                    <span>IELTS speaking test</span>
                    <span>All parts</span>
                </div>
                <button className="text-xs text-blue-500 hover:underline">View scoring criteria</button>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mb-4">
                 <span>Latest band scores</span>
                 <span>Progress</span>
            </div>

            {/* The Graph */}
            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" hide />
                        <YAxis domain={[0, 9]} tickCount={10} stroke="#9ca3af" fontSize={12}/>
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#2F4F4F" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: "#2F4F4F" }} 
                            activeDot={{ r: 6 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-center mt-4">
                 <button className="bg-brand-primary text-white px-8 py-2 rounded-full text-sm font-bold hover:bg-brand-dark">
                    Take the test
                 </button>
            </div>
        </div>

      </div>
    </div>
  );
}