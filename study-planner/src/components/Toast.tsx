import React, { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

export const Toast: React.FC = () => {
    const { toast, hideToast, pendingDeleteId, undoDelete } = useTaskContext();
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!toast || !toast.duration) return;

        setProgress(100);
        const intervalTime = 50;
        const step = (intervalTime / toast.duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - step;
            });
        }, intervalTime);

        const dismissTimer = setTimeout(() => {
            hideToast();
        }, toast.duration);

        return () => {
            clearInterval(timer);
            clearTimeout(dismissTimer);
        };
    }, [toast]);

    if (!toast) return null;

    const typeStyles = {
        success: 'bg-emerald-600 text-white',
        info: 'bg-indigo-600 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-rose-600 text-white',
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end animate-bounce-in">
            <div
                className={`relative overflow-hidden px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-4 min-w-[280px] max-w-md ${
                    typeStyles[toast.type]
                }`}
            >
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{toast.message}</span>
                </div>

                {pendingDeleteId !== null && toast.type === 'warning' && (
                    <button
                        onClick={() => undoDelete(pendingDeleteId)}
                        className="px-2.5 py-1 bg-white text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        Скасувати
                    </button>
                )}

                {toast.duration && (
                    <div
                        className="absolute bottom-0 left-0 h-1 bg-white/40 transition-all ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                )}
            </div>
        </div>
    );
};