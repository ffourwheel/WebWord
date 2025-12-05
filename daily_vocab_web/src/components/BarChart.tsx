"use client";

import { useEffect, useState } from 'react';

export default function BarChart() {
    const [data, setData] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('wordHistory') || '[]');
        const distribution = {
            Beginner: 0,
            Intermediate: 0,
            Advanced: 0,
        };

        history.forEach((item: any) => {
            if (distribution[item.difficulty] !== undefined) {
                distribution[item.difficulty]++;
            }
        });

        setData([
            { name: 'Beginner', value: distribution.Beginner },
            { name: 'Intermediate', value: distribution.Intermediate },
            { name: 'Advanced', value: distribution.Advanced },
        ]);
    }, []);

    return (
        <div className="h-64 bg-gray-50 p-4 rounded-lg flex justify-around items-end border border-gray-200">
            {data.map((item) => (
                <div key={item.name} className="flex flex-col items-center h-full justify-end">
                    <div
                        className="w-12 bg-info rounded-t-lg shadow-md transform hover:scale-105 transition-transform duration-200 ease-in-out"
                        style={{ height: `${(item.value / (Math.max(...data.map(d => d.value)) || 1)) * 90}%` }} // 90% to leave space for label
                    ></div>
                    <span className="text-sm mt-2 text-gray-600 font-medium">{item.name} ({item.value})</span>
                </div>
            ))}
        </div>
    );
}
