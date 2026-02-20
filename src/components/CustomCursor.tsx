import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
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
        const label = labelRef.current;

        const ctx = gsap.context(() => {
            // Initial state: Off-screen and hidden
            gsap.set([cursor, follower], {
                opacity: 0,
                x: -100,
                y: -100,
                display: 'none'
            });

            gsap.set(cursor, { scale: 0.1 });
            gsap.set(follower, { scale: 0.5 });

            // Use quickTo for smooth movement
            const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
            const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });
            const xToFollower = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3" });
            const yToFollower = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3" });

            let isVisible = false;
            let isMagnetic = false;

            const moveCursor = (e: MouseEvent) => {
                if (!isVisible) {
                    gsap.set([cursor, follower], {
                        display: 'block',
                        opacity: 1
                    });
                    isVisible = true;
                }

                if (!isMagnetic) {
                    xToCursor(e.clientX);
                    yToCursor(e.clientY);
                    xToFollower(e.clientX);
                    yToFollower(e.clientY);
                }
            };

            const handleMouseDown = () => {
                gsap.to(cursor, { scale: 2.5, duration: 0.1 });
                gsap.to(follower, { scale: 0.8, duration: 0.1 });
            };

            const handleMouseUp = () => {
                gsap.to(cursor, { scale: 1, duration: 0.2 });
                gsap.to(follower, { scale: 1, duration: 0.2 });
            };

            const handleMouseOver = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                const interactive = target.closest('a, button, [role="button"], .interactive') as HTMLElement;
                const magnetic = target.closest('[data-magnetic]') as HTMLElement;
                const cursorText = (target.closest('[data-cursor-text]') as HTMLElement)?.dataset.cursorText;

                if (interactive) {
                    gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 });
                    gsap.to(follower, {
                        scale: 2.5,
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        borderColor: 'transparent',
                        duration: 0.3
                    });

                    if (cursorText && label) {
                        label.innerText = cursorText;
                        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3 });
                    }
                } else {
                    gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
                    gsap.to(follower, {
                        scale: 1,
                        backgroundColor: 'transparent',
                        borderColor: '#dc2626',
                        duration: 0.3
                    });
                    if (label) gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.3 });
                }

                if (magnetic) {
                    isMagnetic = true;
                    const rect = magnetic.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    xToCursor(centerX);
                    yToCursor(centerY);
                    xToFollower(centerX);
                    yToFollower(centerY);

                    gsap.to(magnetic, {
                        x: (e.clientX - centerX) * 0.3,
                        y: (e.clientY - centerY) * 0.3,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    isMagnetic = false;
                    gsap.to('[data-magnetic]', { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
                }
            };

            window.addEventListener('mousemove', moveCursor);
            window.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mouseover', handleMouseOver);
        });

        return () => ctx.revert();
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <>
            <div
                ref={cursorRef}
                style={{ display: 'none' }}
                className="cursor-dot fixed top-0 left-0 w-2 h-2 bg-red-600 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />
            <div
                ref={followerRef}
                style={{ display: 'none' }}
                className="cursor-outline fixed top-0 left-0 w-8 h-8 border border-red-600 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference flex items-center justify-center transition-colors duration-300"
            >
                <span ref={labelRef} className="text-[10px] text-white font-bold opacity-0 scale-50 uppercase tracking-tighter" />
            </div>
        </>
    );
};

export default CustomCursor;