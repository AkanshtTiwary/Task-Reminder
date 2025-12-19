import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    FormControlLabel,
    Switch,
    IconButton,
    LinearProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [completeDialog, setCompleteDialog] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        dueDate: new Date(),
        reminderTime: new Date(),
        repeat: 'none',
        isRecurring: false,
        status: 'pending'
    });

    useEffect(() => {
        loadTask();
    }, [id]);

    const loadTask = async () => {
        try {
            setLoading(true);
            const response = await taskService.getTask(id);
            const task = response.data.task;
            
            setFormData({
                title: task.title,
                description: task.description || '',
                category: task.category,
                priority: task.priority,
                dueDate: new Date(task.dueDate),
                reminderTime: new Date(task.reminderTime),
                repeat: task.repeat,
                isRecurring: task.isRecurring,
                status: task.status
            });
        } catch (error) {
            toast.error('Failed to load task');
            navigate('/tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name) => (date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        setSaving(true);

        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                priority: formData.priority,
                dueDate: formData.dueDate.toISOString(),
                reminderTime: formData.reminderTime.toISOString(),
                repeat: formData.isRecurring ? formData.repeat : 'none',
                status: formData.status
            };

            await taskService.updateTask(id, taskData);
            toast.success('Task updated successfully!');
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating task');
            toast.error('Failed to update task');
        } finally {
            setSaving(false);
        }
    };

    const handleCompleteTask = async () => {
        try {
            await taskService.completeTask(id);
            toast.success('Task marked as complete!');
            navigate('/tasks');
        } catch (error) {
            toast.error('Failed to complete task');
        } finally {
            setCompleteDialog(false);
        }
    };

    const categories = [
        { value: 'work', label: 'Work' },
        { value: 'personal', label: 'Personal' },
        { value: 'health', label: 'Health' },
        { value: 'education', label: 'Education' },
        { value: 'other', label: 'Other' }
    ];

    const priorities = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

    const repeatOptions = [
        { value: 'none', label: 'No Repeat' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ];

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/tasks')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">Edit Task</Typography>
                </Box>
                
                {formData.status !== 'completed' && (
                    <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => setCompleteDialog(true)}
                        sx={{ backgroundColor: '#10B981' }}
                    >
                        Mark Complete
                    </Button>
                )}
            </Box>

            <Paper sx={{ p: 3, borderRadius: '6px', background: '#161B22', border: '1px solid #30363D' }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Task Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label="Category"
                                    disabled={saving}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    label="Priority"
                                    disabled={saving}
                                >
                                    {priorities.map((pri) => (
                                        <MenuItem key={pri.value} value={pri.value}>
                                            {pri.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Due Date"
                                    value={formData.dueDate}
                                    onChange={handleDateChange('dueDate')}
                                    slotProps={{ textField: { fullWidth: true, required: true } }}
                                    disabled={saving}
                                    minDate={new Date()}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="Reminder Time"
                                    value={formData.reminderTime}
                                    onChange={handleDateChange('reminderTime')}
                                    slotProps={{ textField: { fullWidth: true, required: true } }}
                                    disabled={saving}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isRecurring}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            isRecurring: e.target.checked,
                                            repeat: e.target.checked ? 'daily' : 'none'
                                        }))}
                                        disabled={saving}
                                    />
                                }
                                label="Recurring Task"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={() => navigate('/tasks')} disabled={saving}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Dialog open={completeDialog} onClose={() => setCompleteDialog(false)}>
                <DialogTitle>Mark Task as Complete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to mark "{formData.title}" as complete?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCompleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleCompleteTask} variant="contained" color="success">
                        Mark Complete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditTask;