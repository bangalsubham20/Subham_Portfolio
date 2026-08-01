import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = Array.from({ length: 10 }, (_, i) => `/images/${i + 1}.png`);

const About: React.FC = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const stackContainerRef = useRef<HTMLDivElement | null>(null);
    const lastTimeRef = useRef<number>(0);
    const [isTouch, setIsTouch] = useState<boolean>(false);

    useEffect(() => {
        const checkTouch = () => {
            setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouch();
        window.addEventListener('resize', checkTouch);

        const ctx = gsap.context(() => {
            // Animate Grid Lines
            gsap.from(".grid-line", {
                scale: 0,
                stagger: { from: "center", amount: 0.5 },
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            });

            // Animate Content
            if (contentRef.current) {
                gsap.from(contentRef.current.children, {
                    yPercent: 50,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 1.2,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 80%",
                    }
                });
            }
        }, sectionRef);

        return () => {
            ctx.revert();
            window.removeEventListener('resize', checkTouch);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const now = Date.now();
        if (now - lastTimeRef.current < 50) return;
        lastTimeRef.current = now;

        if (!sectionRef.current || !stackContainerRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Simple cycling 1-10
        const index = Math.floor(now / 100) % images.length;

        const img = document.createElement('img');
        img.src = images[index];

        img.alt = `Trail`;
        img.className = 'absolute w-24 h-32 object-cover rounded-lg shadow-xl border border-gray-300 dark:border-zinc-700 pointer-events-none';
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.transform = `translate(-50%, -50%) scale(0.5)`; // Start small
        img.style.opacity = '0';
        img.style.zIndex = '50';

        stackContainerRef.current.appendChild(img);

        gsap.timeline({ onComplete: () => img.remove() })
            .to(img, {
                opacity: 1,
                scale: 1,
                rotation: gsap.utils.random(-20, 20),
                x: gsap.utils.random(-15, 15),
                y: gsap.utils.random(-15, 15),
                duration: 0.35,
                ease: "back.out(1.7)",
            })
            .to(img, {
                opacity: 0,
                scale: 0.75,
                y: "+=40",
                rotation: "+=10",
                duration: 0.6,
                ease: "power2.in",
            }, ">0.35");
    };

    const handleMouseLeave = () => {
        if (!stackContainerRef.current) return;
        gsap.to(stackContainerRef.current.children, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                if (stackContainerRef.current) {
                    stackContainerRef.current.innerHTML = '';
                }
            }
        });
    };

    return (
        <section
            ref={sectionRef}
            id="about"
            onMouseMove={!isTouch ? handleMouseMove : undefined}
            onMouseLeave={!isTouch ? handleMouseLeave : undefined}
            className="relative font-sans py-24 px-6 md:px-12 md:py-32 overflow-hidden cursor-none bg-[#EDEAE4] dark:bg-black"
        >
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={`v-${i}`}
                        className="grid-line absolute top-0 bottom-0 w-px bg-gradient-to-b from-neutral-400/40 to-transparent dark:from-neutral-600/30 dark:to-transparent"
                        style={{ left: `${(i + 1) * 9}%` }}
                    />
                ))}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={`h-${i}`}
                        className="grid-line absolute left-0 right-0 h-px bg-gradient-to-r from-neutral-400/40 via-neutral-400/20 to-transparent dark:from-neutral-600/30 dark:via-neutral-600/15 dark:to-transparent"
                        style={{ top: `${(i + 1) * 15}%` }}
                    />
                ))}
            </div>

            {/* Trail Container */}
            {!isTouch && <div ref={stackContainerRef} className="absolute inset-0 z-[40] pointer-events-none" />}

            {/* Content */}
            <div ref={contentRef} className="relative z-50 max-w-6xl mx-auto">
                <span className="block text-sm font-bold tracking-[0.2em] text-red-500 mb-8 uppercase">
                    (002) — About Me
                </span>

                <div className="space-y-8 text-2xl md:text-5xl font-extralight leading-snug md:leading-tight text-gray-900 dark:text-white">
                    <p>I'm a <span className="font-normal text-red-600">Backend & DevOps Engineer</span> who thrives on building scalable and robust digital infrastructure.</p>
                    <p>From <span className="font-normal">Java Spring Boot APIs</span> to <span className="font-normal">Cloud Infrastructures</span>, I craft performant systems that solve complex real-world problems.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mt-24 pt-12 border-t border-zinc-300 dark:border-zinc-800">
                    <div className="group cursor-default transition-all duration-300">
                        <h3 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                            2+
                        </h3>
                        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-medium">
                            Years Experience
                        </p>
                    </div>

                    <div className="group cursor-default transition-all duration-300">
                        <h3 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                            12+
                        </h3>
                        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-medium">
                            Open Projects
                        </p>
                    </div>

                    <div className="group cursor-default transition-all duration-300">
                        <h3 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                            AWS
                        </h3>
                        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-medium">
                            Certified
                        </p>
                    </div>

                    <div className="group cursor-default transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <h3 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                Active
                            </h3>
                        </div>
                        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-medium">
                            Status
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;