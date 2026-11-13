import React, { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TOAST_TYPE, type ToastMessage, type ToastType } from '../types/task';

const TYPE_STYLES: Record<ToastType, string> = {
    [TOAST_TYPE.SUCCESS]: 'bg-emerald-600 text-white',
    [TOAST_TYPE.INFO]: 'bg-indigo-600 text-white',
    [TOAST_TYPE.WARNING]: 'bg-amber-500 text-white',
    [TOAST_TYPE.ERROR]: 'bg-rose-600 text-white',
};

interface ToastItemProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
    onUndo: (taskId: number) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose, onUndo }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!toast.duration) return;

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
            onClose(toast.id);
        }, toast.duration);

        return () => {
            clearInterval(timer);
            clearTimeout(dismissTimer);
        };
    }, [toast.id, toast.duration, onClose]);

    return (
        <div
            className={`relative overflow-hidden px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 min-w-[280px] max-w-md transition-all ${
                TYPE_STYLES[toast.type]
            }`}
        >
            <span className="text-sm font-medium">{toast.message}</span>

            <div className="flex items-center gap-2 shrink-0">
                {toast.undoTaskId !== undefined && (
                    <button
                        type="button"
                        onClick={() => onUndo(toast.undoTaskId!)}
                        className="px-2.5 py-1 bg-white text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                        Скасувати
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onClose(toast.id)}
                    className="text-white/80 hover:text-white text-xs font-bold px-1"
                    title="Закрити"
                >
                    ✕
                </button>
            </div>

            {toast.duration && (
                <div
                    className="absolute bottom-0 left-0 h-1 bg-white/40 transition-all ease-linear"
                    style={{ width: `${progress}%` }}
                />
            )}
        </div>
    );
};

export const Toast: React.FC = () => {
    const { toasts, hideToast, undoDelete } = useTaskContext();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 items-end">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={hideToast}
                    onUndo={undoDelete}
                />
            ))}
        </div>
    );
};