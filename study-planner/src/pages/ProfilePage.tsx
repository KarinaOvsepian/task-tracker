import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-3">
            {user.image && (
                    <img
                        src={user.image}
                alt={user.username}
                className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-600 object-cover"
                    />
    )}
    <div>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">
        {user.firstName} {user.lastName}
    </h1>
    <p className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</p>
        </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
        {isAuthenticated ? '● Авторизовано' : '○ Не авторизовано'}
        </span>
        </div>

        <div className="space-y-3 text-sm">
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex justify-between">
    <span className="text-slate-500 dark:text-slate-400">Username:</span>
    <span className="font-semibold text-slate-800 dark:text-slate-100">
        {user.username}
        </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex justify-between">
    <span className="text-slate-500 dark:text-slate-400">Email:</span>
    <span className="font-semibold text-slate-800 dark:text-slate-100">
        {user.email}
        </span>
        </div>
        </div>

        <div className="pt-2 flex justify-end">
    <button
        type="button"
    onClick={handleLogout}
    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
        >
        Вийти з акаунту (Logout)
    </button>
    </div>
    </div>
);
};