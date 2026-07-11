import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';

interface Shape {
    size: string;
    lightColor: string;
    darkColor: string;
    shape: string;
}

const FloatingShapes: React.FC = () => {
    const shapesRef = useRef<HTMLDivElement | null>(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const shapes = shapesRef.current?.children;
        if (!shapes) return;

        Array.from(shapes).forEach((shape, index) => {
            const element = shape as HTMLElement;

            // Initial random position
            gsap.set(element, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotation: Math.random() * 360,
            });

            // Floating animation
            gsap.to(element, {
                x: `+=${Math.random() * 200 - 100}`,
                y: `+=${Math.random() * 200 - 100}`,
                rotation: `+=${Math.random() * 180 - 90}`,
                duration: 10 + Math.random() * 20,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 2,
            });

            // Opacity animation — lighter in light mode
            gsap.to(element, {
                opacity: isDark
                    ? 0.1 + Math.random() * 0.3
                    : 0.04 + Math.random() * 0.08,
                duration: 3 + Math.random() * 4,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
                delay: index * 0.5,
            });
        });
    }, [isDark]);

    const shapes: Shape[] = [
        { size: 'w-16 h-16', lightColor: 'bg-stone-400',  darkColor: 'bg-red-500',    shape: 'rounded-full' },
        { size: 'w-12 h-12', lightColor: 'bg-stone-500',  darkColor: 'bg-blue-500',   shape: 'rounded-lg' },
        { size: 'w-20 h-20', lightColor: 'bg-amber-300',  darkColor: 'bg-green-500',  shape: 'rounded-full' },
        { size: 'w-8 h-8',   lightColor: 'bg-stone-400',  darkColor: 'bg-purple-500', shape: 'rounded-full' },
        { size: 'w-14 h-14', lightColor: 'bg-orange-200', darkColor: 'bg-yellow-500', shape: 'rounded-lg' },
        { size: 'w-10 h-10', lightColor: 'bg-stone-300',  darkColor: 'bg-pink-500',   shape: 'rounded-full' },
        { size: 'w-18 h-18', lightColor: 'bg-amber-200',  darkColor: 'bg-indigo-500', shape: 'rounded-lg' },
        { size: 'w-6 h-6',   lightColor: 'bg-stone-500',  darkColor: 'bg-teal-500',   shape: 'rounded-full' },
    ];

    return (
        <div
            ref={shapesRef}
            className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${isDark ? 'block' : 'hidden'}`}
        >
            {shapes.map((shape, index) => (
                <div
                    key={index}
                    className={`absolute ${shape.size} ${isDark ? shape.darkColor : shape.lightColor} ${shape.shape} opacity-5`}
                    style={{
                        filter: isDark ? 'blur(1px)' : 'blur(8px)',
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingShapes;
