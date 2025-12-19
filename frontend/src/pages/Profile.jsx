import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Divider,
    Switch,
    FormControlLabel,
    Alert,
    LinearProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        timezone: user?.timezone || 'UTC',
        notificationPreferences: user?.notificationPreferences || {
            email: true,
            push: true,
            sms: false
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationChange = (key) => (e) => {
        setFormData(prev => ({
            ...prev,
            notificationPreferences: {
                ...prev.notificationPreferences,
                [key]: e.target.checked
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setSuccess('Profile updated successfully!');
                toast.success('Profile updated successfully!');
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <LinearProgress sx={{ width: '100%' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <AnimatedBackground variant="green" />
            
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, position: 'relative', zIndex: 1 }}>
                Profile Settings
            </Typography>

            <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: '6px',
                            background: '#161B22',
                            border: '1px solid #30363D',
                            boxShadow: 'none',
                            height: '100%'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 96,
                                    height: 96,
                                    fontSize: 40,
                                    background: 'linear-gradient(135deg, #58A6FF 0%, #3FB950 100%)',
                                    mb: 2,
                                    border: '3px solid #21262D',
                                }}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Member since {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: '6px',
                                background: '#161B22',
                                border: '1px solid #30363D',
                                boxShadow: 'none',
                            }}
                        >
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    {success}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                    Personal Information
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(99, 102, 241, 0.2)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'rgba(99, 102, 241, 0.4)',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#6366F1',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            helperText="Email cannot be changed"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Timezone"
                                            name="timezone"
                                            value={formData.timezone}
                                            onChange={handleChange}
                                            disabled={loading}
                                            select
                                            SelectProps={{
                                                native: true
                                            }}
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Chicago">Central Time</option>
                                            <option value="America/Denver">Mountain Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                            <option value="Europe/London">London</option>
                                            <option value="Europe/Paris">Paris</option>
                                            <option value="Asia/Tokyo">Tokyo</option>
                                            <option value="Asia/Dubai">Dubai</option>
                                            <option value="Australia/Sydney">Sydney</option>
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 4 }} />

                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                    Notification Preferences
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.notificationPreferences.email}
                                                    onChange={handleNotificationChange('email')}
                                                    disabled={loading}
                                                />
                                            }
                                            label="Email Notifications"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.notificationPreferences.push}
                                                    onChange={handleNotificationChange('push')}
                                                    disabled={loading}
                                                />
                                            }
                                            label="Push Notifications"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.notificationPreferences.sms}
                                                    onChange={handleNotificationChange('sms')}
                                                    disabled={loading}
                                                />
                                            }
                                            label="SMS Notifications"
                                            helperText="SMS notifications may incur additional charges"
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={{
                                            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
                                            '&:hover': { 
                                                background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
                                                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
                                            },
                                            px: 4,
                                            py: 1.2,
                                        }}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Box>
                            </form>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;