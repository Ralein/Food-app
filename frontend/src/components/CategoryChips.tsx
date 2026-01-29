'use client';

import { useState } from 'react';

const categories = [
    { id: '1', name: 'All', icon: '🥗' },
    { id: '2', name: 'Salads', icon: '🥗' },
    { id: '3', name: 'Bowls', icon: '🍲' },
    { id: '4', name: 'Smoothies', icon: '🥤' },
    { id: '5', name: 'Snacks', icon: '🍎' },
    { id: '6', name: 'Juice', icon: '🍹' },
    { id: '7', name: 'Vegan', icon: '🌿' },
];

export default function CategoryChips() {
    const [active, setActive] = useState('1');

    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActive(cat.id)}
                    className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all whitespace-nowrap
            ${active === cat.id
                            ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                            : 'bg-surface border-border text-text-secondary hover:border-primary/30 hover:bg-background'}
          `}
                >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm font-semibold">{cat.name}</span>
                </button>
            ))}
        </div>
    );
}
