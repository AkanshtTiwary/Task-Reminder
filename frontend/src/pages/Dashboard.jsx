import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    IconButton,
    Button,
    Tooltip as MuiTooltip
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    AccessTime as AccessTimeIcon,
    Warning as WarningIcon,
    Today as TodayIcon,
    Task as TaskIcon,
    TrendingUp as TrendingUpIcon,
    Add as AddIcon,
    NavigateNext as NavigateNextIcon,
    CalendarToday,
    Schedule,
    TrendingUp,
    PieChart as PieChartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { taskService } from '../services/taskService';
import { format } from 'date-fns';
import AnimatedBackground from '../components/AnimatedBackground';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, tasksRes] = await Promise.all([
                taskService.getDashboardStats(),
                taskService.getTasks({ limit: 5, sort: '-dueDate' })
            ]);

            setStats(statsRes.data.stats);
            setTasks(tasksRes.data.tasks);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ stat, index }) => (
        <Grid item xs={12} sm={6} md={4} lg={2}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
            >
                <Card
                    className="hover-lift"
                    sx={{
                        height: '100%',
                        background: stat.gradient,
                        border: 'none',
                        borderRadius: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: stat.shadow,
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '100px',
                            height: '100px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                            borderRadius: '50%',
                            transform: 'translate(30%, -30%)',
                        }}
                    />
                    <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Box
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    p: 1.5,
                                    color: 'white',
                                }}
                            >
                                {React.cloneElement(stat.icon, { sx: { fontSize: 24 } })}
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
                                {stat.value}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                            {stat.title}
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>
        </Grid>
    );

    const statCards = [
        {
            title: 'Total Tasks',
            value: stats?.total || 0,
            icon: <TaskIcon />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            shadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        },
        {
            title: 'Completed',
            value: stats?.completed || 0,
            icon: <CheckCircleIcon />,
            gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            shadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        },
        {
            title: 'Pending',
            value: stats?.pending || 0,
            icon: <PendingIcon />,
            gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            shadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
        },
        {
            title: 'Today',
            value: stats?.today || 0,
            icon: <TodayIcon />,
            gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            shadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        },
        {
            title: 'Overdue',
            value: stats?.overdue || 0,
            icon: <WarningIcon />,
            gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            shadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
        },
        {
            title: 'In Progress',
            value: stats?.inProgress || 0,
            icon: <AccessTimeIcon />,
            gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            shadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
        }
    ];

    const getPriorityColor = (priority) => {
        const priorityColors = {
            urgent: '#DC2626',
            high: '#EF4444',
            medium: '#F59E0B',
            low: '#10B981'
        };
        return priorityColors[priority] || '#6B7280';
    };

    const getStatusColor = (status) => {
        const statusColors = {
            completed: '#10B981',
            'in-progress': '#3B82F6',
            pending: '#F59E0B',
            overdue: '#EF4444'
        };
        return statusColors[status] || '#6B7280';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon sx={{ color: '#10B981' }} />;
            case 'in-progress':
                return <AccessTimeIcon sx={{ color: '#3B82F6' }} />;
            case 'overdue':
                return <WarningIcon sx={{ color: '#EF4444' }} />;
            default:
                return <PendingIcon sx={{ color: '#F59E0B' }} />;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <LinearProgress sx={{ width: '100%' }} />
            </Box>
        );
    }

    // Calculate completion percentage
    const completionRate = stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0;

    // Prepare pie chart data
    const pieData = [
        { name: 'Completed', value: stats?.completed || 0, color: '#10B981' },
        { name: 'In Progress', value: stats?.inProgress || 0, color: '#3B82F6' },
        { name: 'Pending', value: stats?.pending || 0, color: '#F59E0B' },
        { name: 'Overdue', value: stats?.overdue || 0, color: '#EF4444' }
    ];

    // Weekly progress data
    const weeklyData = [
        { day: 'Mon', completed: Math.floor(Math.random() * 10), created: Math.floor(Math.random() * 15) },
        { day: 'Tue', completed: Math.floor(Math.random() * 10), created: Math.floor(Math.random() * 15) },
        { day: 'Wed', completed: Math.floor(Math.random() * 10), created: Math.floor(Math.random() * 15) },
        { day: 'Thu', completed: Math.floor(Math.random() * 10), created: Math.floor(Math.random() * 15) },
        { day: 'Fri', completed: Math.floor(Math.random() * 10), created: Math.floor(Math.random() * 15) },
        { day: 'Sat', completed: Math.floor(Math.random() * 10), created: Math.floor(Math.random() * 15) },
        { day: 'Sun', completed: Math.floor(Math.random() * 10), created: Math.floor(Math.random() * 15) }
    ];

    return (
        <Box sx={{ position: 'relative' }}>
            <AnimatedBackground variant="blue" />
            
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Overview of your tasks and productivity
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/tasks/create')}
                    sx={{
                        backgroundColor: '#4F46E5',
                        '&:hover': { backgroundColor: '#4338CA' },
                        px: 3,
                        py: 1
                    }}
                >
                    New Task
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                    <StatCard key={stat.title} stat={stat} index={index} />
                ))}
            </Grid>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Recent Tasks - Left Column */}
                <Grid item xs={12} lg={8}>
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: '6px',
                            background: '#161B22',
                            border: '1px solid #30363D',
                            boxShadow: 'none',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Recent Tasks
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => navigate('/tasks')}
                                sx={{ color: '#4F46E5' }}
                            >
                                View All
                            </Button>
                        </Box>
                        
                        {tasks.length > 0 ? (
                            <List disablePadding>
                                {tasks.map((task, index) => (
                                    <motion.div
                                        key={task._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <ListItem
                                            sx={{
                                                mb: 1,
                                                p: 1.5,
                                                borderRadius: '6px',
                                                background: '#0D1117',
                                                border: '1px solid #21262D',
                                                '&:hover': {
                                                    background: '#161B22',
                                                    cursor: 'pointer',
                                                    border: '1px solid #30363D',
                                                }
                                            }}
                                            onClick={() => navigate(`/tasks/edit/${task._id}`)}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                {getStatusIcon(task.status)}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                            {task.title}
                                                        </Typography>
                                                        <Chip
                                                            label={task.priority}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getPriorityColor(task.priority),
                                                                color: 'white',
                                                                fontWeight: 'medium',
                                                                height: 20
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                                        <Chip
                                                            icon={<CalendarToday sx={{ fontSize: 14 }} />}
                                                            label={format(new Date(task.dueDate), 'MMM dd')}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 24 }}
                                                        />
                                                        <Chip
                                                            icon={<Schedule sx={{ fontSize: 14 }} />}
                                                            label={format(new Date(task.dueDate), 'hh:mm a')}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 24 }}
                                                        />
                                                        <Chip
                                                            label={task.category}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ 
                                                                height: 24,
                                                                borderColor: getStatusColor(task.status),
                                                                color: getStatusColor(task.status)
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                            />
                                            <IconButton size="small" sx={{ color: '#6B7280' }}>
                                                <NavigateNextIcon />
                                            </IconButton>
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <TaskIcon sx={{ fontSize: 60, color: '#9CA3AF', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No tasks yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Create your first task to get started
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/tasks/create')}
                                    sx={{
                                        backgroundColor: '#4F46E5',
                                        '&:hover': { backgroundColor: '#4338CA' }
                                    }}
                                >
                                    Create Task
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Stats & Charts - Right Column */}
                <Grid item xs={12} lg={4}>
                    <Grid container spacing={3} direction="column">
                        {/* Completion Rate */}
                        <Grid item>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <TrendingUpIcon sx={{ color: '#4F46E5', mr: 1.5 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Completion Rate
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h2" sx={{ 
                                        fontWeight: 'bold', 
                                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 1 
                                    }}>
                                        {completionRate}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tasks completed
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    height: 8, 
                                    background: 'rgba(30, 41, 59, 0.8)', 
                                    borderRadius: 4, 
                                    overflow: 'hidden',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                }}>
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: `${completionRate}%`,
                                            background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                                            borderRadius: 4,
                                            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                                            transition: 'width 0.5s ease',
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Task Distribution Pie Chart */}
                        <Grid item>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                    height: '100%'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <PieChartIcon sx={{ color: '#4F46E5', mr: 1.5 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Task Distribution
                                    </Typography>
                                </Box>
                                <Box sx={{ height: 250 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData.filter(item => item.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => 
                                                    percent > 0.1 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                                                }
                                                outerRadius={80}
                                                innerRadius={40}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => [`${value} tasks`, 'Count']}
                                                contentStyle={{ 
                                                    borderRadius: 8,
                                                    border: 'none',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                }}
                                            />
                                            <Legend 
                                                verticalAlign="bottom" 
                                                height={36}
                                                formatter={(value) => (
                                                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                                                        {value}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Weekly Progress */}
            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    mt: 3
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUp sx={{ color: '#4F46E5', mr: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Weekly Activity
                    </Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={weeklyData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="day" 
                                stroke="#6B7280"
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <YAxis 
                                stroke="#6B7280"
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: 8,
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                formatter={(value) => [value, 'Tasks']}
                            />
                            <Legend 
                                verticalAlign="top"
                                height={36}
                                formatter={(value) => (
                                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                                        {value}
                                    </span>
                                )}
                            />
                            <Bar 
                                dataKey="created" 
                                name="Created Tasks" 
                                fill="#4F46E5" 
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                            <Bar 
                                dataKey="completed" 
                                name="Completed Tasks" 
                                fill="#10B981" 
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Box>
    );
};

export default Dashboard;
