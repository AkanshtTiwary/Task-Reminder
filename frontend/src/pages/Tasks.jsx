import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    IconButton,
    Chip,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as AccessTimeIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';

const Tasks = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({
        status: 'all',
        category: 'all',
        priority: 'all'
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                ...filter
            };
            
            const response = await taskService.getTasks(params);
            setTasks(response.data.tasks);
            setTotal(response.data.pagination.total);
        } catch (error) {
            console.error('Error loading tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, filter]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleFilterChange = useCallback((name, value) => {
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(0);
    }, []);

    const handleMenuOpen = (event, task) => {
        setAnchorEl(event.currentTarget);
        setSelectedTask(task);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTask(null);
    };

    const handleEdit = () => {
        if (selectedTask) {
            navigate(`/tasks/edit/${selectedTask._id}`);
        }
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setDeleteDialog(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        try {
            await taskService.deleteTask(selectedTask._id);
            toast.success('Task deleted successfully');
            loadTasks();
        } catch (error) {
            toast.error('Failed to delete task');
        } finally {
            setDeleteDialog(false);
            setSelectedTask(null);
        }
    };

    const handleComplete = async (taskId) => {
        try {
            await taskService.completeTask(taskId);
            toast.success('Task marked as complete');
            loadTasks();
        } catch (error) {
            toast.error('Failed to complete task');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon sx={{ color: '#10B981' }} />;
            case 'in-progress':
                return <AccessTimeIcon sx={{ color: '#F59E0B' }} />;
            case 'overdue':
                return <WarningIcon sx={{ color: '#EF4444' }} />;
            default:
                return <AccessTimeIcon sx={{ color: '#6B7280' }} />;
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            urgent: '#DC2626',
            high: '#EF4444',
            medium: '#F59E0B',
            low: '#10B981'
        };
        return colors[priority] || '#6B7280';
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: '#10B981',
            'in-progress': '#3B82F6',
            pending: '#6B7280',
            overdue: '#EF4444'
        };
        return colors[status] || '#6B7280';
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <AnimatedBackground variant="default" />
            
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    My Tasks
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/tasks/create')}
                    sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        '&:hover': { 
                            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        }
                    }}
                >
                    New Task
                </Button>
            </Box>

            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: '6px',
                    background: '#161B22',
                    border: '1px solid #30363D',
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={filter.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        label="Status"
                                    >
                                        <MenuItem value="all">All Status</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="in-progress">In Progress</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                        <MenuItem value="overdue">Overdue</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={filter.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        label="Category"
                                    >
                                        <MenuItem value="all">All Categories</MenuItem>
                                        <MenuItem value="work">Work</MenuItem>
                                        <MenuItem value="personal">Personal</MenuItem>
                                        <MenuItem value="health">Health</MenuItem>
                                        <MenuItem value="education">Education</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={filter.priority}
                                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                                        label="Priority"
                                    >
                                        <MenuItem value="all">All Priorities</MenuItem>
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                        <MenuItem value="urgent">Urgent</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <LinearProgress />
            ) : (
                <>
                    <TableContainer component={Paper} sx={{ 
                        borderRadius: '6px', 
                        background: '#161B22',
                        border: '1px solid #30363D',
                        boxShadow: 'none',
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Task</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Due Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow key={task._id} hover>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                    {task.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {task.description?.substring(0, 50)}...
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={task.category} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.priority}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getPriorityColor(task.priority),
                                                    color: 'white',
                                                    fontWeight: 'medium'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getStatusIcon(task.status)}
                                                <Chip
                                                    label={task.status}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: getStatusColor(task.status),
                                                        color: getStatusColor(task.status)
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {task.status !== 'completed' && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleComplete(task._id)}
                                                        sx={{ color: '#10B981' }}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/tasks/edit/${task._id}`)}
                                                    sx={{ color: '#3B82F6' }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuOpen(e, task)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                    />

                    {tasks.length === 0 && (
                        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                No tasks found
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Create your first task to get started
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/tasks/create')}
                            >
                                Create Task
                            </Button>
                        </Paper>
                    )}
                </>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: '#EF4444' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{selectedTask?.title}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tasks;