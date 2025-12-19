import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366F1',
            light: '#818CF8',
            dark: '#4F46E5',
        },
        secondary: {
            main: '#8B5CF6',
            light: '#A78BFA',
            dark: '#7C3AED',
        },
        background: {
            default: '#0A0E1A',
            paper: '#1A1F35',
        },
        text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
        },
        success: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
        },
        warning: {
            main: '#F59E0B',
            light: '#FBBF24',
            dark: '#D97706',
        },
        error: {
            main: '#EF4444',
            light: '#F87171',
            dark: '#DC2626',
        },
        info: {
            main: '#3B82F6',
            light: '#60A5FA',
            dark: '#2563EB',
        },
    },
    typography: {
        fontFamily: '"Inter", -apple-system, sans-serif',
        h4: { fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em' },
        h5: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
        h6: { fontWeight: 700, fontSize: '1.25rem' },
        button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.5px' },
    },
    shape: { borderRadius: 16 },
    shadows: [
        'none',
        '0 2px 8px rgba(0,0,0,0.15)',
        '0 4px 12px rgba(0,0,0,0.15)',
        '0 8px 24px rgba(0,0,0,0.2)',
        '0 12px 32px rgba(0,0,0,0.25)',
        '0 16px 48px rgba(0,0,0,0.3)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '12px 28px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.5s',
                    },
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 28px rgba(99, 102, 241, 0.4)',
                        '&::before': {
                            left: '100%',
                        },
                    },
                    '&:active': {
                        transform: 'translateY(-1px)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    color: 'white',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    },
                },
                outlined: {
                    borderWidth: '2px',
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                        borderWidth: '2px',
                        borderColor: '#6366F1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(26, 31, 53, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(26, 31, 53, 0.8)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    borderRadius: 16,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-6px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.4)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 12,
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                            borderColor: 'rgba(148, 163, 184, 0.25)',
                            borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6366F1',
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 10,
                    backdropFilter: 'blur(8px)',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: 10,
                    padding: '10px 16px',
                    fontSize: '0.875rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                },
                arrow: {
                    color: 'rgba(15, 23, 42, 0.95)',
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Toaster position="top-right" />
            <Router>
                <AuthProvider>
                    <NotificationProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                                <Route index element={<Navigate to="/dashboard" />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="tasks" element={<Tasks />} />
                                <Route path="tasks/create" element={<CreateTask />} />
                                <Route path="tasks/edit/:id" element={<EditTask />} />
                                <Route path="notifications" element={<Notifications />} />
                                <Route path="profile" element={<Profile />} />
                            </Route>
                        </Routes>
                    </NotificationProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;