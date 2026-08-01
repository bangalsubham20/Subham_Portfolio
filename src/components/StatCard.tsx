import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface StatCardProps {
    value: string;
    label: string;
    isActiveStatus?: boolean;
    hoverTextColor?: string;
    isTouchDevice?: boolean;
}

/** StatCard: Layer 40 - Shared interactive statistics item card with GSAP count-up animation */
export const StatCard: React.FC<StatCardProps> = ({
    value,
    label,
    isActiveStatus = false,
    hoverTextColor = 'group-hover:text-red-600 dark:group-hover:text-red-500',
    isTouchDevice = false,
}) => {
    const numberRef = useRef<HTMLHeadingElement | null>(null);

    // Extract numeric portion and suffix (e.g. "12+" -> 12, "+")
    const numericValue = parseInt(value, 10);
    const isNumeric = !isNaN(numericValue);
    const suffix = isNumeric ? value.replace(/[0-9.]/g, '') : '';

    useEffect(() => {
        if (!isNumeric || !numberRef.current) return;

        const element = numberRef.current;
        const counterObj = { val: 0 };

        const animation = gsap.to(counterObj, {
            val: numericValue,
            duration: 2,
            ease: 'power1.out',
            snap: { val: 1 },
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                once: true,
            },
            onUpdate: () => {
                if (element) {
                    element.innerText = `${counterObj.val}${suffix}`;
                }
            },
        });

        return () => {
            animation.kill();
        };
    }, [value, isNumeric, numericValue, suffix]);

    return (
        <div
            className={`relative z-40 group cursor-default flex flex-col justify-start items-center sm:items-start text-center sm:text-left transition-all duration-300 ease-out ${
                !isTouchDevice ? 'sm:hover:-translate-y-1.5 sm:hover:scale-[1.02]' : ''
            }`}
        >
            {isActiveStatus ? (
                <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
                    <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
                    </span>
                    <h3
                        ref={numberRef}
                        className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white transition-colors duration-300 ${hoverTextColor}`}
                    >
                        {isNumeric ? `0${suffix}` : value}
                    </h3>
                </div>
            ) : (
                <h3
                    ref={numberRef}
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white transition-colors duration-300 ${hoverTextColor}`}
                >
                    {isNumeric ? `0${suffix}` : value}
                </h3>
            )}
            <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-white/80 font-medium leading-relaxed">
                {label}
            </p>
        </div>
    );
};

export default StatCard;
