import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Linkedin, Github, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
    const containerRef = useRef<HTMLElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                y: 100,
                opacity: 0,
                rotate: 5,
                duration: 1,
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 80%",
                }
            });

            gsap.from(".contact-item", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                }
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="contact" ref={containerRef} className="py-24 px-6 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-zinc-900">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
                    LET'S <span className="text-red-600">CONNECT</span>
                </h2>

                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16 contact-item">
                    I'm currently looking for new opportunities as a Backend & DevOps Engineer.
                    Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>

                <div className="flex flex-col md:flex-row gap-8 justify-center items-center contact-item">
                    <a
                        href="mailto:bangalsubham@gmail.com"
                        className="group flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-medium text-lg hover:scale-105 transition-transform"
                    >
                        <Mail size={20} />
                        <span>Say Hello</span>
                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>

                    <div className="flex gap-4">
                        <a
                            href="https://www.linkedin.com/in/bangalsubham20/"
                            target="_blank"
                            rel="noreferrer"
                            className="p-4 rounded-full border border-gray-300 dark:border-zinc-700 hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                            <Linkedin size={24} />
                        </a>
                        <a
                            href="https://github.com/bangalsubham20"
                            target="_blank"
                            rel="noreferrer"
                            className="p-4 rounded-full border border-gray-300 dark:border-zinc-700 hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                            <Github size={24} />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Contact;
