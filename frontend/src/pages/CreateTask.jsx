import React, { useState } from 'react';
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
    Chip,
    Fade,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    InputAdornment,
    Avatar,
    Tooltip,
    alpha,
    styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    AccessTime as AccessTimeIcon,
    CalendarToday as CalendarIcon,
    Flag as FlagIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    NotificationsActive as NotificationIcon,
    Repeat as RepeatIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { taskService } from '../services/taskService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '6px',
    background: '#161B22',
    boxShadow: 'none',
    border: `1px solid #30363D`,
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.primary,
    '& svg': {
        color: theme.palette.primary.main,
    }
}));

const PriorityChip = styled(Chip)(({ priority, theme }) => {
    const colors = {
        low: { bg: alpha('#10B981', 0.1), color: '#065F46' },
        medium: { bg: alpha('#F59E0B', 0.1), color: '#92400E' },
        high: { bg: alpha('#EF4444', 0.1), color: '#991B1B' },
        urgent: { bg: alpha('#DC2626', 0.15), color: '#DC2626' }
    };
    return {
        backgroundColor: colors[priority]?.bg || alpha(theme.palette.primary.main, 0.1),
        color: colors[priority]?.color || theme.palette.primary.main,
        fontWeight: 600,
        '& .MuiChip-icon': {
            color: colors[priority]?.color,
        }
    };
});

const CategoryAvatar = styled(Avatar)(({ category, theme }) => {
    const colors = {
        work: { bg: alpha('#3B82F6', 0.1), color: '#1D4ED8' },
        personal: { bg: alpha('#8B5CF6', 0.1), color: '#7C3AED' },
        health: { bg: alpha('#10B981', 0.1), color: '#047857' },
        education: { bg: alpha('#F59E0B', 0.1), color: '#D97706' },
        other: { bg: alpha('#6B7280', 0.1), color: '#374151' }
    };
    return {
        backgroundColor: colors[category]?.bg || alpha(theme.palette.primary.main, 0.1),
        color: colors[category]?.color || theme.palette.primary.main,
        width: 32,
        height: 32,
    };
});

const steps = ['Basic Info', 'Details', 'Schedule', 'Review'];

const CreateTask = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [subtasks, setSubtasks] = useState(['']);
    const [isImportant, setIsImportant] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        dueDate: new Date(),
        reminderTime: new Date(new Date().getTime() + 60 * 60 * 1000),
        repeat: 'none',
        isRecurring: false,
        notifications: ['email', 'push']
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (name) => (date) => {
        setFormData(prev => ({
            ...prev,
            [name]: date
        }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 0:
                if (!formData.title.trim()) {
                    setError('Please enter a task title');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setError('');
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubtaskChange = (index, value) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = value;
        setSubtasks(newSubtasks);
    };

    const addSubtask = () => {
        setSubtasks([...subtasks, '']);
    };

    const removeSubtask = (index) => {
        const newSubtasks = subtasks.filter((_, i) => i !== index);
        setSubtasks(newSubtasks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const taskData = {
                ...formData,
                dueDate: formData.dueDate.toISOString(),
                reminderTime: formData.reminderTime.toISOString(),
                subtasks: subtasks.filter(subtask => subtask.trim() !== ''),
                isImportant,
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            await taskService.createTask(taskData);
            toast.success('🎉 Task created successfully!', {
                duration: 4000,
                icon: '✅',
                style: {
                    background: '#10B981',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: 600,
                }
            });
            
            // Add success animation before navigation
            setTimeout(() => {
                navigate('/tasks');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating task');
            toast.error('❌ Failed to create task', {
                duration: 4000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '12px',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { value: 'work', label: 'Work', icon: '💼' },
        { value: 'personal', label: 'Personal', icon: '🏠' },
        { value: 'health', label: 'Health', icon: '🏥' },
        { value: 'education', label: 'Education', icon: '📚' },
        { value: 'other', label: 'Other', icon: '📝' }
    ];

    const priorities = [
        { value: 'low', label: 'Low', icon: '🟢' },
        { value: 'medium', label: 'Medium', icon: '🟡' },
        { value: 'high', label: 'High', icon: '🟠' },
        { value: 'urgent', label: 'Urgent', icon: '🔴' }
    ];

    const repeatOptions = [
        { value: 'none', label: 'No Repeat' },
        { value: 'daily', label: 'Every Day' },
        { value: 'weekly', label: 'Every Week' },
        { value: 'monthly', label: 'Every Month' },
        { value: 'yearly', label: 'Every Year' }
    ];

    const notificationOptions = [
        { value: 'email', label: 'Email' },
        { value: 'push', label: 'Push Notification' },
        { value: 'sms', label: 'SMS' },
        { value: 'in-app', label: 'In-App Alert' }
    ];

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SectionHeader variant="h6">
                            <DescriptionIcon /> Task Details
                        </SectionHeader>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Task Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FlagIcon sx={{ color: '#94A3B8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                            '& fieldset': {
                                                borderColor: 'rgba(99, 102, 241, 0.2)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(99, 102, 241, 0.4)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#6366F1',
                                                borderWidth: '2px',
                                            },
                                        },
                                    }}
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
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DescriptionIcon sx={{ color: 'text.secondary', mt: 2 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <SectionHeader variant="h6">
                                    <CategoryIcon /> Category
                                </SectionHeader>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {categories.map((cat) => (
                                        <Card
                                            key={cat.value}
                                            onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                                            sx={{
                                                minWidth: 120,
                                                cursor: 'pointer',
                                                border: formData.category === cat.value 
                                                    ? '2px solid #6366F1'
                                                    : '1px solid rgba(99, 102, 241, 0.2)',
                                                background: formData.category === cat.value 
                                                    ? 'rgba(99, 102, 241, 0.15)'
                                                    : 'rgba(30, 41, 59, 0.5)',
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                                                    border: '2px solid #6366F1',
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                                <Typography variant="h4" sx={{ mb: 1 }}>
                                                    {cat.icon}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {cat.label}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </motion.div>
                );

            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SectionHeader variant="h6">
                            <FlagIcon /> Priority & Subtasks
                        </SectionHeader>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                                    Select Priority Level
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {priorities.map((pri) => (
                                        <PriorityChip
                                            key={pri.value}
                                            label={pri.label}
                                            icon={<span>{pri.icon}</span>}
                                            priority={pri.value}
                                            onClick={() => setFormData(prev => ({ ...prev, priority: pri.value }))}
                                            variant={formData.priority === pri.value ? 'filled' : 'outlined'}
                                            sx={{ 
                                                py: 2,
                                                px: 2,
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <SectionHeader variant="h6">
                                        Add Subtasks
                                    </SectionHeader>
                                    <Tooltip title="Add subtask">
                                        <IconButton 
                                            onClick={addSubtask}
                                            sx={{ 
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'primary.dark',
                                                }
                                            }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                
                                <AnimatePresence>
                                    {subtasks.map((subtask, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder={`Subtask ${index + 1}`}
                                                    value={subtask}
                                                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box sx={{ 
                                                                    width: 20, 
                                                                    height: 20, 
                                                                    border: '2px solid',
                                                                    borderColor: 'divider',
                                                                    borderRadius: '4px',
                                                                    mr: 1
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '8px',
                                                        }
                                                    }}
                                                />
                                                {subtasks.length > 1 && (
                                                    <IconButton 
                                                        onClick={() => removeSubtask(index)}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isImportant}
                                            onChange={(e) => setIsImportant(e.target.checked)}
                                            color="warning"
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {isImportant ? <StarIcon color="warning" /> : <StarBorderIcon />}
                                            <Typography>Mark as Important</Typography>
                                        </Box>
                                    }
                                />
                            </Grid>
                        </Grid>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SectionHeader variant="h6">
                            <CalendarIcon /> Schedule & Reminders
                        </SectionHeader>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Due Date"
                                        value={formData.dueDate}
                                        onChange={handleDateChange('dueDate')}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                InputProps: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CalendarIcon sx={{ color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    }
                                                }
                                            }
                                        }}
                                        disabled={loading}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="Reminder Time"
                                        value={formData.reminderTime}
                                        onChange={handleDateChange('reminderTime')}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                InputProps: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    }
                                                }
                                            }
                                        }}
                                        disabled={loading}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Repeat</InputLabel>
                                    <Select
                                        name="repeat"
                                        value={formData.repeat}
                                        onChange={handleChange}
                                        label="Repeat"
                                        disabled={loading || !formData.isRecurring}
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ mr: 1 }}>
                                                <RepeatIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        }
                                        sx={{
                                            borderRadius: '12px',
                                        }}
                                    >
                                        {repeatOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isRecurring}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                isRecurring: e.target.checked,
                                                repeat: e.target.checked ? 'daily' : 'none'
                                            }))}
                                            disabled={loading}
                                        />
                                    }
                                    label="Recurring Task"
                                    sx={{ mt: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <SectionHeader variant="h6">
                                    <NotificationIcon /> Notifications
                                </SectionHeader>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {notificationOptions.map((notif) => (
                                        <Chip
                                            key={notif.value}
                                            label={notif.label}
                                            onClick={() => {
                                                const newNotifications = formData.notifications.includes(notif.value)
                                                    ? formData.notifications.filter(n => n !== notif.value)
                                                    : [...formData.notifications, notif.value];
                                                setFormData(prev => ({ ...prev, notifications: newNotifications }));
                                            }}
                                            color={formData.notifications.includes(notif.value) ? 'primary' : 'default'}
                                            variant={formData.notifications.includes(notif.value) ? 'filled' : 'outlined'}
                                            sx={{ borderRadius: '8px' }}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SectionHeader variant="h6">
                            Review & Create
                        </SectionHeader>
                        
                        <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', backgroundColor: alpha('#f8fafc', 0.5) }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {formData.title}
                                    </Typography>
                                    {formData.description && (
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {formData.description}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <CategoryAvatar category={formData.category}>
                                            {categories.find(c => c.value === formData.category)?.icon}
                                        </CategoryAvatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Category
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {categories.find(c => c.value === formData.category)?.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <PriorityChip 
                                            label={priorities.find(p => p.value === formData.priority)?.label}
                                            priority={formData.priority}
                                            size="small"
                                        />
                                        {isImportant && (
                                            <Chip
                                                icon={<StarIcon />}
                                                label="Important"
                                                color="warning"
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Due Date
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {formData.dueDate.toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Reminder
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {formData.reminderTime.toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </Typography>
                                </Grid>

                                {subtasks.filter(s => s.trim() !== '').length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                            Subtasks
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {subtasks.filter(s => s.trim() !== '').map((subtask, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ 
                                                        width: 16, 
                                                        height: 16, 
                                                        border: '2px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: '4px',
                                                    }} />
                                                    <Typography variant="body2">{subtask}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, position: 'relative' }}>
            <AnimatedBackground variant="purple" />
            
            <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <IconButton 
                            onClick={() => navigate('/tasks')}
                            sx={{ 
                                backgroundColor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                    transform: 'translateX(-2px)',
                                },
                                transition: 'all 0.2s',
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                Create New Task
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Organize your work and life with detailed tasks
                            </Typography>
                        </Box>
                    </Box>

                    <Stepper 
                        activeStep={activeStep} 
                        alternativeLabel 
                        sx={{ mb: 4 }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel 
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            fontWeight: 500,
                                        }
                                    }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </motion.div>
            </Box>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <StyledPaper>
                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 3,
                                borderRadius: '12px',
                                '& .MuiAlert-icon': {
                                    alignItems: 'center',
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Fade in={true} timeout={300}>
                            <div>
                                {renderStepContent(activeStep)}
                            </div>
                        </Fade>

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            mt: 4,
                            pt: 3,
                            borderTop: `1px solid ${alpha('#000', 0.1)}`
                        }}>
                            <Button
                                variant="outlined"
                                onClick={activeStep === 0 ? () => navigate('/tasks') : handleBack}
                                disabled={loading}
                                startIcon={<ArrowBackIcon />}
                                sx={{
                                    borderRadius: '12px',
                                    px: 4,
                                }}
                            >
                                {activeStep === 0 ? 'Cancel' : 'Back'}
                            </Button>
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {activeStep < steps.length - 1 ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        disabled={!formData.title || loading}
                                        sx={{
                                            borderRadius: '12px',
                                            px: 4,
                                            background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                                                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                                            }
                                        }}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading || !formData.title}
                                        startIcon={loading ? null : <AddIcon />}
                                        sx={{
                                            borderRadius: '12px',
                                            px: 4,
                                            background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
                                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                                            }
                                        }}
                                    >
                                        {loading ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: '50%',
                                                        border: '2px solid',
                                                        borderColor: 'white transparent transparent transparent',
                                                        animation: 'spin 1s linear infinite',
                                                        '@keyframes spin': {
                                                            '0%': { transform: 'rotate(0deg)' },
                                                            '100%': { transform: 'rotate(360deg)' }
                                                        }
                                                    }}
                                                />
                                                Creating...
                                            </Box>
                                        ) : 'Create Task'}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </form>
                </StyledPaper>
            </motion.div>

            {/* Progress indicator */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Step {activeStep + 1} of {steps.length}
                </Typography>
            </Box>
        </Box>
    );
};

export default CreateTask;