import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

    useEffect(() => {
        const checkTouch = () => {
            setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
        };
        checkTouch();
        window.addEventListener('resize', checkTouch);
        return () => window.removeEventListener('resize', checkTouch);
    }, []);

    useEffect(() => {
        if (isTouchDevice || !cursorRef.current || !followerRef.current) return;

        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const ctx = gsap.context(() => {
            // Use quickTo for better performance on mouse move
            const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
            const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
            const xToFollower = gsap.quickTo(follower, "x", { duration: 0.3, ease: "power3" });
            const yToFollower = gsap.quickTo(follower, "y", { duration: 0.3, ease: "power3" });

            const moveCursor = (e: MouseEvent) => {
                xToCursor(e.clientX);
                yToCursor(e.clientY);
                xToFollower(e.clientX);
                yToFollower(e.clientY);
            };

            const handleMouseOver = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                // Check if target is interactive
                const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer');

                if (isInteractive) {
                    gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
                    gsap.to(follower, {
                        scale: 1.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'transparent',
                        duration: 0.2
                    });
                } else {
                    gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
                    gsap.to(follower, {
                        scale: 1,
                        backgroundColor: 'transparent',
                        borderColor: '#dc2626', // red-600
                        duration: 0.2
                    });
                }
            };

            // Add listeners to window/document for global handling
            window.addEventListener('mousemove', moveCursor);
            document.addEventListener('mouseover', handleMouseOver);
        });

        return () => ctx.revert();
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-red-600 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-red-600 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-colors duration-300"
            />
        </>
    );
};

export default CustomCursor;