import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailsPage } from './pages/TaskDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <TaskProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Navigate to="/tasks" replace />} />

                            <Route element={<AppLayout />}>
                                <Route path="/tasks" element={<TasksPage />} />
                                <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
                                <Route path="/login" element={<LoginPage />} />

                                <Route element={<ProtectedRoute />}>
                                    <Route path="/profile" element={<ProfilePage />} />
                                </Route>
                            </Route>

                            <Route path="*" element={<Navigate to="/tasks" replace />} />
                        </Routes>
                    </BrowserRouter>
                </TaskProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;