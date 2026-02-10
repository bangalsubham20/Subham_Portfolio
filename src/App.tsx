import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Contexts
import ThemeProvider from './context/ThemeContext';
import { MusicProvider } from './context/MusicContext';
import { TransitionProvider } from './context/TransitionContext';

// Components
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import MusicPrompt from './components/MusicPrompt';
import DarkVeil from './components/DarkVeil';

// Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import GuestBook from './pages/GuestBook';
import Collaborate from './pages/Collaborate';
import Gallery from './pages/Gallery';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AppContent: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <DarkVeil />
            <Navigation />
            <CustomCursor />
            <MusicPrompt />

            <main>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/guestbook" element={<GuestBook />} />
                    <Route path="/collaborate" element={<Collaborate />} />
                    <Route path="/gallery" element={<Gallery />} />
                </Routes>
            </main>
        </>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <ThemeProvider>
                <MusicProvider>
                    <TransitionProvider>
                        <AppContent />
                    </TransitionProvider>
                </MusicProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;
