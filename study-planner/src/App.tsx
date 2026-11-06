import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';

export function App() {
    return (
        <ThemeProvider>
            <TaskProvider>
                <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-10 px-4 font-sans transition-colors">
                    <div className="max-w-xl mx-auto">
                        <Header />
                        <TaskForm />
                        <TaskStats />
                        <TaskFilters />
                        <TaskList />
                        <Toast />
                    </div>
                </div>
            </TaskProvider>
        </ThemeProvider>
    );
}

export default App;