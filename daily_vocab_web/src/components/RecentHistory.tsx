"use client";

import { useEffect, useState } from 'react';

export default function RecentHistory() {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('wordHistory') || '[]');
        setHistory(storedHistory.slice(-5).reverse());
    }, []);

    return (
        <div className="space-y-4">
            {history.length > 0 ? (
                history.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-lg text-gray-800">{item.word}</p>
                            <p className={`font-bold text-xl ${item.score >= 8 ? 'text-success' : item.score >= 6 ? 'text-warning' : 'text-danger'}`}>
                                {item.score.toFixed(1)}
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 italic">"{item.sentence}"</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-8">No recent history. Start practicing!</p>
            )}
        </div>
    );
}
