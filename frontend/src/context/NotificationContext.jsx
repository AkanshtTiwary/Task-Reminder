import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const NotificationContext = createContext({});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);

            newSocket.emit('join', user.id);

            newSocket.on('new_notification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                
                // Show toast notification
                toast(
                    <div>
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                    </div>,
                    {
                        duration: 5000,
                        position: 'top-right'
                    }
                );
            });

            return () => newSocket.close();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const response = await notificationService.getNotifications();
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(notif => notif._id !== id));
            setUnreadCount(prev => {
                const notification = notifications.find(n => n._id === id);
                return notification && !notification.isRead 
                    ? Math.max(0, prev - 1) 
                    : prev;
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const value = {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loadNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};