import React, { memo } from 'react';
import { Box, styled, keyframes } from '@mui/material';

const float = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const BackgroundContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
    pointerEvents: 'none',
});

const Orb = styled(Box)(({ size, color, top, left, delay, duration }) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, ${color}80, ${color}20)`,
    filter: 'blur(60px)',
    top,
    left,
    animation: `${float} ${duration}s ease-in-out infinite, ${pulse} ${duration * 0.6}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
}));

const GridOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
        linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    opacity: 0.4,
});

const SparkleContainer = styled(Box)(({ top, left, delay, size }) => ({
    position: 'absolute',
    top,
    left,
    width: size,
    height: size,
    animation: `${pulse} 3s ease-in-out infinite, ${rotate} 8s linear infinite`,
    animationDelay: `${delay}s`,
}));

const Sparkle = styled(Box)(({ color }) => ({
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    borderRadius: '50%',
    boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
}));

const AnimatedBackground = memo(() => {
    const sparkles = [
        { top: '15%', left: '10%', delay: 0, size: '4px', color: '#6366F1' },
        { top: '25%', left: '85%', delay: 1, size: '3px', color: '#8B5CF6' },
        { top: '45%', left: '20%', delay: 2, size: '5px', color: '#3B82F6' },
        { top: '65%', left: '75%', delay: 1.5, size: '4px', color: '#A78BFA' },
        { top: '80%', left: '30%', delay: 0.5, size: '3px', color: '#6366F1' },
        { top: '35%', left: '60%', delay: 2.5, size: '4px', color: '#8B5CF6' },
    ];

    return (
        <BackgroundContainer>
            <GridOverlay />
            
            {/* Large Orbs */}
            <Orb size="700px" color="#6366F1" top="5%" left="5%" delay={0} duration={20} />
            <Orb size="600px" color="#8B5CF6" top="55%" left="65%" delay={2} duration={25} />
            <Orb size="550px" color="#3B82F6" top="25%" left="75%" delay={4} duration={22} />
            <Orb size="500px" color="#A78BFA" top="70%" left="10%" delay={3} duration={18} />
            
            {/* Sparkles */}
            {sparkles.map((sparkle, index) => (
                <SparkleContainer key={index} {...sparkle}>
                    <Sparkle color={sparkle.color} />
                </SparkleContainer>
            ))}
        </BackgroundContainer>
    );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
