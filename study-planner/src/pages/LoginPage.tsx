import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, type LoginFormData } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError(null);
        try {
            await login(data);
            navigate('/profile');
        } catch (err) {
            setServerError(
                err instanceof Error ? err.message : 'Помилка входу. Перевірте логін та пароль.'
            );
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                Вхід у Study Planner
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                Тестові дані DummyJSON: <code className="font-semibold">emilys</code> /{' '}
                <code className="font-semibold">emilyspass</code>
            </p>

            {serverError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                    <label
                        htmlFor="login-username"
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
                    >
                        Username
                    </label>
                    <input
                        id="login-username"
                        type="text"
                        autoComplete="username"
                        disabled={isSubmitting}
                        placeholder="emilys"
                        {...register('username')}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
                    />
                    {errors.username && (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="login-password"
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
                    >
                        Password
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        placeholder="••••••"
                        {...register('password')}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
                    />
                    {errors.password && (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Виконується вхід...' : 'Увійти'}
                </button>
            </form>
        </div>
    );
};