import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';
import { useCursorTrail } from '../hooks/useCursorTrail';
import StatCard from './StatCard';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
const TRAIL_IMAGES = Array.from({ length: 10 }, (_, i) => `/images/${i + 1}.png`);
const VERTICAL_GRID_LINES_COUNT = 10;
const HORIZONTAL_GRID_LINES_COUNT = 5;

/** Shared statistics data array */
const STATS_DATA = [
    { id: 'experience', value: '2+', label: 'Years Experience' },
    { id: 'projects', value: '12+', label: 'Open Projects' },
    { id: 'certification', value: 'AWS', label: 'Certified' },
    {
        id: 'status',
        value: 'Active',
        label: 'Status',
        isActiveStatus: true,
        hoverTextColor: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    },
];

// ============================================================================
// REUSABLE SUB-COMPONENTS
// ============================================================================

/** Subtle opacity falloff for depth effect across horizontal lines */
const HORIZONTAL_OPACITIES = ['opacity-90', 'opacity-70', 'opacity-50', 'opacity-35', 'opacity-20'];

/** GridBackground: Layer 10 - Renders background vertical and horizontal grid lines with gradient masks */
interface GridBackgroundProps {
    verticalCount?: number;
    horizontalCount?: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
    verticalCount = VERTICAL_GRID_LINES_COUNT,
    horizontalCount = HORIZONTAL_GRID_LINES_COUNT,
}) => (
    <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
        {/* Vertical Lines: Fade top -> bottom */}
        {[...Array(verticalCount)].map((_, index) => (
            <div
                key={`v-${index}`}
                className="grid-line absolute top-0 bottom-0 w-px bg-gradient-to-b from-neutral-400/40 via-neutral-400/15 to-transparent dark:from-white/30 dark:via-white/10 dark:to-transparent"
                style={{ left: `${(index + 1) * 9}%` }}
            />
        ))}

        {/* Horizontal Lines: Fade transparent -> center -> transparent with subtle depth falloff */}
        {[...Array(horizontalCount)].map((_, index) => {
            const opacityClass = HORIZONTAL_OPACITIES[index] || 'opacity-20';
            return (
                <div
                    key={`h-${index}`}
                    className={`grid-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-400/30 to-transparent dark:via-white/25 ${opacityClass}`}
                    style={{ top: `${(index + 1) * 15}%` }}
                />
            );
        })}
    </div>
);

/** CursorTrail: Layer 30 - Container div for floating mouse trail elements above Layer 20 content */
interface CursorTrailProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
}

const CursorTrail: React.FC<CursorTrailProps> = ({ containerRef }) => (
    <div ref={containerRef} className="absolute inset-0 z-30 pointer-events-none" />
);

// ============================================================================
// MAIN ABOUT COMPONENT
// ============================================================================
const About: React.FC = () => {
    // Detect touch-first devices to conditionally disable desktop cursor trail & hover animations
    const isTouchDevice = useIsTouchDevice();

    // Custom hook encapsulating position-based cursor trail logic & GSAP timeline
    const { sectionRef, trailContainerRef, handleMouseMove, handleMouseLeave } = useCursorTrail<
        HTMLElement,
        HTMLDivElement
    >({
        images: TRAIL_IMAGES,
        isTouchDevice,
    });

    const contentRef = useRef<HTMLDivElement | null>(null);

    /** GSAP ScrollTrigger Animations for section elements */
    useEffect(() => {
        const animationContext = gsap.context(() => {
            // Animate Grid Lines on Scroll
            gsap.from('.grid-line', {
                scale: 0,
                opacity: 0,
                stagger: { from: 'center', amount: 0.5 },
                duration: 1.5,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
            });

            // Animate Main Text Content on Scroll
            if (contentRef.current) {
                gsap.from(contentRef.current.children, {
                    yPercent: 50,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 1.2,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }, sectionRef);

        return () => {
            animationContext.revert();
        };
    }, [sectionRef]);

    return (
        <section
            ref={sectionRef}
            id="about"
            onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
            onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
            className="relative z-0 font-sans py-24 px-6 md:px-12 md:py-32 overflow-hidden cursor-none bg-[#EDEAE4] dark:bg-black"
        >
            {/* Layer 10: Decorative Grid Background */}
            <GridBackground />

            {/* Layer 20: Main Content Container (Headings, Narrative, Paragraphs) */}
            <div ref={contentRef} className="relative z-20 max-w-7xl mx-auto">
                {/* Section Header */}
                <span className="block text-sm font-bold tracking-[0.2em] text-red-500 mb-12 uppercase">
                    (002) — About Me
                </span>

                {/* Narrative Paragraphs */}
                <div className="space-y-8 text-2xl md:text-5xl font-extralight leading-snug md:leading-tight text-gray-900 dark:text-white">
                    <p>
                        I'm a <span className="font-normal text-red-600">Backend & DevOps Engineer</span> who thrives
                        on building scalable and robust digital infrastructure.
                    </p>
                    <p>
                        From <span className="font-normal">Java Spring Boot APIs</span> to{' '}
                        <span className="font-normal">Cloud Infrastructures</span>, I craft performant systems that
                        solve complex real-world problems.
                    </p>
                </div>

                {/* Layer 40: Statistics Grid (Interactive Targets) */}
                <div className="relative z-40 mt-20 sm:mt-28 md:mt-32 pt-10 sm:pt-14 md:pt-16">
                    {/* Gradient Divider Line */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/40 to-transparent pointer-events-none" />

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-10 lg:gap-x-16 gap-y-10 sm:gap-y-12">
                        {STATS_DATA.map((stat) => (
                            <StatCard
                                key={stat.id}
                                value={stat.value}
                                label={stat.label}
                                isActiveStatus={stat.isActiveStatus}
                                hoverTextColor={stat.hoverTextColor}
                                isTouchDevice={isTouchDevice}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Layer 30: Floating Cursor Trail (Renders ON TOP of Layer 20 Content) */}
            {!isTouchDevice && <CursorTrail containerRef={trailContainerRef} />}
        </section>
    );
};

export default About;