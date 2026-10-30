import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-slate-800">
                Study Planner
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
                Планувальник навчальних завдань
            </p>
        </header>
    );
};