// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const PrivateRoute = ({ children }) => {
//     const { user, loading } = useAuth();

//     if (loading) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '100vh'
//             }}>
//                 <div className="spinner"></div>
//             </div>
//         );
//     }

//     return user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: '#0D1117'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;