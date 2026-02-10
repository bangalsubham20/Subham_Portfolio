// src/context/TransitionContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface TransitionContextType {
    timeline: gsap.core.Timeline | null;
    setTimeline: (tl: gsap.core.Timeline) => void;
    playTransition: (path: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);
    const navigate = useNavigate();

    const playTransition = (path: string) => {
        if (timeline) {
            timeline.play(0); // Play the timeline from the beginning
            setTimeout(() => {
                navigate(path);
            }, 1000); // Duration must be long enough for the IN-animation
        } else {
            navigate(path);
        }
    };

    return (
        <TransitionContext.Provider value={{ timeline, setTimeline, playTransition }}>
            {children}
        </TransitionContext.Provider>
    );
};

// Custom hook for easy access to the context
export const useTransition = () => {
    const context = useContext(TransitionContext);
    if (!context) {
        throw new Error('useTransition must be used within a TransitionProvider');
    }
    return context;
};
