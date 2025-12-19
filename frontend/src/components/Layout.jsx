import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Tooltip,
    Chip,
    alpha,
    styled,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Task as TaskIcon,
    AddCircle as AddIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Settings as SettingsIcon,
    Help as HelpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import AnimatedBackground from './AnimatedBackground';

const drawerWidth = 260;
const collapsedDrawerWidth = 80;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(148, 163, 184, 0.1)',
    },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    minHeight: '64px',
    borderBottom: `1px solid #21262D`,
}));

const LogoText = styled(Typography)(({ theme }) => ({
    color: '#E6EDF3',
    fontWeight: 600,
    fontSize: '1.25rem',
    letterSpacing: '-0.3px',
}));

const NavItem = styled(ListItem)(({ theme, selected }) => ({
    borderRadius: '10px',
    margin: theme.spacing(0.5, 1),
    padding: theme.spacing(1, 1.5),
    transition: 'all 0.2s ease',
    backgroundColor: selected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
    '&:hover': {
        backgroundColor: selected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.08)',
        cursor: 'pointer',
    },
    '& .MuiListItemIcon-root': {
        minWidth: '36px',
        color: selected ? '#818CF8' : '#94A3B8',
    },
    '& .MuiListItemText-primary': {
        fontWeight: selected ? 600 : 500,
        color: selected ? '#F8FAFC' : '#94A3B8',
        fontSize: '0.9rem',
    },
}));

const UserMenuButton = styled(IconButton)(({ theme }) => ({
    border: `1px solid #30363D`,
    padding: '4px',
    transition: 'all 0.15s ease',
    '&:hover': {
        border: `1px solid #8B949E`,
        backgroundColor: '#161B22',
    },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
    background: 'linear-gradient(135deg, #58A6FF 0%, #3FB950 100%)',
    fontWeight: 600,
    width: 32,
    height: 32,
    fontSize: '0.875rem',
}));

const MainContent = styled(Box)(({ theme }) => ({
    background: '#0D1117',
    backgroundImage: 'none',
    minHeight: '100vh',
    position: 'relative',
}));

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCollapseToggle = () => {
        setCollapsed(!collapsed);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleProfileMenuClose();
    };

    const menuItems = [
        { 
            text: 'Dashboard', 
            icon: <DashboardIcon />, 
            path: '/dashboard',
            description: 'Overview and analytics'
        },
        { 
            text: 'My Tasks', 
            icon: <TaskIcon />, 
            path: '/tasks',
            description: 'Manage your tasks'
        },
        { 
            text: 'Create Task', 
            icon: <AddIcon />, 
            path: '/tasks/create',
            description: 'Add new task',
            highlight: true
        },
        { 
            text: 'Notifications', 
            icon: (
                <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            boxShadow: '0 0 0 2px white',
                        }
                    }}
                >
                    <NotificationsIcon />
                </Badge>
            ), 
            path: '/notifications',
            description: 'View all notifications'
        },
    ];

    const drawer = (
        <>
            <LogoContainer>
                {!collapsed && !isMobile ? (
                    <>
                        <LogoText>TaskFlow</LogoText>
                        <IconButton 
                            onClick={handleCollapseToggle}
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                }
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </>
                ) : (
                    <IconButton 
                        onClick={handleCollapseToggle}
                        sx={{ mx: 'auto' }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                )}
            </LogoContainer>
            
            <Divider sx={{ mx: 2 }} />
            
            <List sx={{ p: 2 }}>
                {menuItems.map((item) => {
                    const isSelected = location.pathname === item.path || 
                                      location.pathname.startsWith(item.path + '/');
                    return (
                        <Tooltip 
                            key={item.text}
                            title={collapsed && !isMobile ? item.text : ''}
                            placement="right"
                            arrow
                        >
                            <NavItem
                                button
                                selected={isSelected}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                sx={{
                                    opacity: collapsed && !isMobile ? 0.9 : 1,
                                    justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                                }}
                            >
                                <ListItemIcon>
                                    {item.highlight ? (
                                        <Badge 
                                            color="primary" 
                                            variant="dot"
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            {item.icon}
                                        </Badge>
                                    ) : item.icon}
                                </ListItemIcon>
                                {(!collapsed || isMobile) && (
                                    <>
                                        <ListItemText 
                                            primary={item.text}
                                            secondary={!isMobile && item.description}
                                            primaryTypographyProps={{ 
                                                fontWeight: isSelected ? 600 : 500,
                                                fontSize: '0.95rem'
                                            }}
                                            secondaryTypographyProps={{
                                                fontSize: '0.75rem',
                                                color: 'text.disabled',
                                            }}
                                        />
                                        {item.highlight && !isMobile && (
                                            <Chip
                                                label="New"
                                                size="small"
                                                color="primary"
                                                sx={{ 
                                                    ml: 1,
                                                    height: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavItem>
                        </Tooltip>
                    );
                })}
            </List>
            
            <Box sx={{ mt: 'auto', p: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Tooltip 
                    title={collapsed && !isMobile ? "Need help?" : ""}
                    placement="right"
                    arrow
                >
                    <ListItem
                        button
                        onClick={() => navigate('/help')}
                        sx={{
                            borderRadius: '12px',
                            mb: 1,
                            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                        }}
                    >
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        {(!collapsed || isMobile) && (
                            <ListItemText primary="Help & Support" />
                        )}
                    </ListItem>
                </Tooltip>
                
                <Tooltip 
                    title={collapsed && !isMobile ? "Settings" : ""}
                    placement="right"
                    arrow
                >
                    <ListItem
                        button
                        onClick={() => navigate('/settings')}
                        sx={{
                            borderRadius: '12px',
                            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                        }}
                    >
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        {(!collapsed || isMobile) && (
                            <ListItemText primary="Settings" />
                        )}
                    </ListItem>
                </Tooltip>
            </Box>
        </>
    );

    const currentWidth = collapsed && !isMobile ? collapsedDrawerWidth : drawerWidth;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AnimatedBackground variant="purple" />
            <StyledAppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${currentWidth}px)` },
                    ml: { sm: `${currentWidth}px` },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ 
                            mr: 2, 
                            display: { sm: 'none' },
                            color: 'text.primary'
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                            variant="h6" 
                            noWrap 
                            sx={{ 
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {menuItems.find(item => 
                                location.pathname === item.path || 
                                location.pathname.startsWith(item.path + '/')
                            )?.text || 'Dashboard'}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        '& > *': {
                            animation: 'fadeIn 0.3s ease-in-out'
                        }
                    }}>
                        <Tooltip title="Notifications" arrow>
                            <IconButton
                                onClick={() => navigate('/notifications')}
                                sx={{ 
                                    color: 'text.secondary',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <Badge 
                                    badgeContent={unreadCount} 
                                    color="error"
                                    max={99}
                                >
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {!isMobile && (
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {user?.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {user?.role || 'User'}
                                    </Typography>
                                </Box>
                            )}
                            
                            <Tooltip title="Account settings" arrow>
                                <UserMenuButton
                                    onClick={handleProfileMenuOpen}
                                    size="small"
                                >
                                    <UserAvatar>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </UserAvatar>
                                </UserMenuButton>
                            </Tooltip>
                        </Box>
                        
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProfileMenuClose}
                            PaperProps={{
                                elevation: 3,
                                sx: {
                                    mt: 1.5,
                                    minWidth: 200,
                                    borderRadius: 2,
                                    overflow: 'visible',
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    }
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <Box sx={{ p: 2, pb: 1.5 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {user?.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </Box>
                            <Divider />
                            <MenuItem 
                                onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}
                                sx={{ py: 1.5 }}
                            >
                                <ListItemIcon>
                                    <PersonIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Profile</ListItemText>
                            </MenuItem>
                            <MenuItem 
                                onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}
                                sx={{ py: 1.5 }}
                            >
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Settings</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem 
                                onClick={handleLogout}
                                sx={{ py: 1.5, color: 'error.main' }}
                            >
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText>Logout</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </StyledAppBar>
            
            <Box
                component="nav"
                sx={{ 
                    width: { sm: currentWidth }, 
                    flexShrink: { sm: 0 },
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <StyledDrawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                    }}
                >
                    {drawer}
                </StyledDrawer>
                <StyledDrawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                    }}
                    open
                >
                    {drawer}
                </StyledDrawer>
            </Box>
            
            <MainContent
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    width: { sm: `calc(100% - ${currentWidth}px)` },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar />
                <Box
                    sx={{
                        animation: 'fadeIn 0.3s ease-in-out',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(10px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}
                >
                    <Outlet />
                </Box>
            </MainContent>
        </Box>
    );
};

export default Layout;