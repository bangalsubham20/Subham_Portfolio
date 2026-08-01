import React from 'react';

export interface StatCardProps {
    value: string;
    label: string;
    isActiveStatus?: boolean;
    hoverTextColor?: string;
    isTouchDevice?: boolean;
}

/** StatCard: Layer 40 - Shared interactive statistics item card component */
export const StatCard: React.FC<StatCardProps> = ({
    value,
    label,
    isActiveStatus = false,
    hoverTextColor = 'group-hover:text-red-600 dark:group-hover:text-red-500',
    isTouchDevice = false,
}) => (
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
                <h3 className={`text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light text-gray-900 dark:text-white transition-colors duration-300 ${hoverTextColor}`}>
                    {value}
                </h3>
            </div>
        ) : (
            <h3 className={`text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light text-gray-900 dark:text-white transition-colors duration-300 ${hoverTextColor}`}>
                {value}
            </h3>
        )}
        <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            {label}
        </p>
    </div>
);

export default StatCard;
