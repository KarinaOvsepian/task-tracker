import React, { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TOAST_TYPE, type ToastType } from '../types/task';

const TYPE_STYLES: Record<ToastType, string> = {
    [TOAST_TYPE.SUCCESS]: 'bg-emerald-600 text-white',
    [TOAST_TYPE.INFO]: 'bg-indigo-600 text-white',
    [TOAST_TYPE.WARNING]: 'bg-amber-500 text-white',
    [TOAST_TYPE.ERROR]: 'bg-rose-600 text-white',
};

export const Toast: React.FC = () => {
    const { toast, hideToast } = useTaskContext();
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
    }, [toast, hideToast]);

    if (!toast) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
            <div
                className={`relative overflow-hidden px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-4 min-w-[260px] max-w-md ${
                    TYPE_STYLES[toast.type]
                }`}
            >
                <span className="text-sm font-medium">{toast.message}</span>

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