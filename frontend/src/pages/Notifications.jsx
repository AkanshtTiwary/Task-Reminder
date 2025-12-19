import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Chip,
    Badge,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Email as EmailIcon,
    Sms as SmsIcon,
    PushPin as PushIcon,
    Delete as DeleteIcon,
    MarkEmailRead as MarkReadIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Schedule as ScheduleIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';

const Notifications = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loadNotifications
    } = useNotifications();

    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

    useEffect(() => {
        loadNotifications().finally(() => setLoading(false));
    }, []);

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'read') return notif.isRead;
        return true;
    });

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'reminder':
                return <ScheduleIcon sx={{ color: '#4F46E5' }} />;
            case 'overdue':
                return <WarningIcon sx={{ color: '#EF4444' }} />;
            case 'completed':
                return <CheckCircleIcon sx={{ color: '#10B981' }} />;
            default:
                return <InfoIcon sx={{ color: '#6B7280' }} />;
        }
    };

    const getDeliveryIcons = (sendVia) => {
        return sendVia?.map((method, index) => {
            switch (method) {
                case 'email':
                    return <EmailIcon key={index} sx={{ fontSize: 16, ml: 0.5 }} />;
                case 'sms':
                    return <SmsIcon key={index} sx={{ fontSize: 16, ml: 0.5 }} />;
                case 'push':
                    return <PushIcon key={index} sx={{ fontSize: 16, ml: 0.5 }} />;
                default:
                    return null;
            }
        });
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <LinearProgress sx={{ width: '100%' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <AnimatedBackground variant="blue" />
            
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <Box>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                    }}>
                        Notifications
                        {unreadCount > 0 && (
                            <Badge
                                badgeContent={unreadCount}
                                sx={{
                                    ml: 2,
                                    '& .MuiBadge-badge': {
                                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                                        animation: 'pulse 2s ease-in-out infinite',
                                    }
                                }}
                            />
                        )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Stay updated with your task reminders and alerts
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant={filter === 'all' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('all')}
                        size="small"
                        sx={{
                            background: filter === 'all' ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' : 'transparent',
                            borderColor: filter === 'all' ? 'transparent' : 'rgba(59, 130, 246, 0.3)',
                            '&:hover': {
                                background: filter === 'all' 
                                    ? 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)'
                                    : 'rgba(59, 130, 246, 0.1)',
                                borderColor: '#3B82F6',
                            }
                        }}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('unread')}
                        size="small"
                        sx={{
                            background: filter === 'unread' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : 'transparent',
                            borderColor: filter === 'unread' ? 'transparent' : 'rgba(239, 68, 68, 0.3)',
                            '&:hover': {
                                background: filter === 'unread'
                                    ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                                    : 'rgba(239, 68, 68, 0.1)',
                                borderColor: '#EF4444',
                            }
                        }}
                    >
                        Unread ({unreadCount})
                    </Button>
                    <Button
                        variant={filter === 'read' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('read')}
                        size="small"
                        sx={{
                            background: filter === 'read' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                            borderColor: filter === 'read' ? 'transparent' : 'rgba(16, 185, 129, 0.3)',
                            '&:hover': {
                                background: filter === 'read'
                                    ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                    : 'rgba(16, 185, 129, 0.1)',
                                borderColor: '#10B981',
                            }
                        }}
                    >
                        Read
                    </Button>
                    {unreadCount > 0 && (
                        <Button
                            variant="outlined"
                            startIcon={<MarkReadIcon />}
                            onClick={handleMarkAllAsRead}
                            size="small"
                            sx={{
                                borderColor: 'rgba(139, 92, 246, 0.3)',
                                color: '#A78BFA',
                                '&:hover': {
                                    borderColor: '#8B5CF6',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                }
                            }}
                        >
                            Mark All Read
                        </Button>
                    )}
                </Box>
            </Box>

            <Paper
                sx={{
                    borderRadius: '6px',
                    background: '#161B22',
                    border: '1px solid #30363D',
                    boxShadow: 'none',
                    overflow: 'hidden',
                }}
            >
                <AnimatePresence>
                    {filteredNotifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <Box sx={{ 
                                    width: 80, 
                                    height: 80, 
                                    margin: '0 auto 24px',
                                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                                }}>
                                    <NotificationsIcon sx={{ fontSize: 40, color: 'white' }} />
                                </Box>
                                <Typography variant="h6" sx={{ color: '#E5E7EB', mb: 1 }}>
                                    No notifications
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {filter === 'unread' 
                                        ? 'You have no unread notifications'
                                        : 'Your notifications will appear here'}
                                </Typography>
                            </Box>
                        </motion.div>
                    ) : (
                        <List disablePadding>
                            {filteredNotifications.map((notification, index) => (
                                <motion.div
                                    key={notification._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <ListItem
                                        sx={{
                                            borderBottom: '1px solid #21262D',
                                            background: notification.isRead ? 'transparent' : 'rgba(88, 166, 255, 0.05)',
                                            py: 2,
                                            '&:hover': {
                                                background: notification.isRead ? '#0D1117' : 'rgba(88, 166, 255, 0.08)',
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Box sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                background: notification.isRead
                                                    ? '#21262D'
                                                    : 'rgba(88, 166, 255, 0.15)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                {getNotificationIcon(notification.type)}
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: notification.isRead ? 500 : 700,
                                                            color: notification.isRead ? '#E5E7EB' : '#FFFFFF',
                                                        }}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    {notification.sendVia && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            {getDeliveryIcons(notification.sendVia)}
                                                        </Box>
                                                    )}
                                                    {!notification.isRead && (
                                                        <Chip
                                                            label="Unread"
                                                            size="small"
                                                            sx={{
                                                                background: '#1F6FEB',
                                                                color: 'white',
                                                                height: 20,
                                                                fontSize: '0.7rem',
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ 
                                                            color: notification.isRead ? '#94A3B8' : '#CBD5E1',
                                                            mb: 0.5,
                                                            fontWeight: notification.isRead ? 400 : 500,
                                                        }}
                                                    >
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ 
                                                            color: '#64748B',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                                                        {format(new Date(notification.createdAt), 'MMM dd, yyyy hh:mm a')}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {!notification.isRead && (
                                                    <IconButton
                                                        edge="end"
                                                        size="small"
                                                        onClick={() => markAsRead(notification._id)}
                                                        title="Mark as read"
                                                        sx={{
                                                            color: '#3B82F6',
                                                            '&:hover': {
                                                                background: 'rgba(59, 130, 246, 0.1)',
                                                            }
                                                        }}
                                                    >
                                                        <MarkReadIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    onClick={() => deleteNotification(notification._id)}
                                                    title="Delete"
                                                    sx={{ 
                                                        color: '#EF4444',
                                                        '&:hover': {
                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </motion.div>
                            ))}
                        </List>
                    )}
                </AnimatePresence>
            </Paper>

            {notifications.length > 0 && (
                <Box sx={{ 
                    mt: 3, 
                    textAlign: 'center',
                    p: 2,
                    background: 'rgba(59, 130, 246, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        Showing <strong style={{ color: '#3B82F6' }}>{filteredNotifications.length}</strong> of{' '}
                        <strong style={{ color: '#3B82F6' }}>{notifications.length}</strong> notifications
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default Notifications;