import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  number: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  category: string;
  year: string;
  status: string;
  liveLink: string;
  githubLink: string;
  preview: string;
  impact: string[];
}

const projectsData: Project[] = [
  {
    number: '01',
    title: 'Collegia',
    description: 'Collegia is an all-in-one platform designed to enhance the overall student experience in colleges by integrating several essential features.',
    longDescription: 'Collegia is a full-featured student management platform that streamlines academic processes. Built with Java Spring MVC and React.js, it features user authentication, course management, assignment tracking, and real-time notifications.',
    tech: ['Java', 'Spring MVC', 'React.js', 'MySQL'],
    category: 'Full-Stack',
    year: '2024',
    status: 'Live',
    liveLink: '#',
    githubLink: '#',
    preview: '/collegiaMockup.png',
    impact: ['500+ Students', '15+ Institutions', '99.9% Uptime']
  },
  {
    number: '02',
    title: '0xKid',
    description: '0xKid is a futuristic edtech platform that merges interactive gameplay, real coding challenges, and AI guidance to help children learn programming in a fun, visual, and structured way.',
    longDescription: '0xKid is a next-generation educational platform designed to make learning programming exciting for children. It combines gamified challenges, AI-powered mentorship, and a visual learning environment to teach coding concepts effectively.',
    tech: ['Spring Boot', 'React.js', 'JWT', 'MongoDB'],
    category: 'EdTech',
    year: '2024',
    status: 'Development',
    liveLink: '#',
    githubLink: '#',
    preview: '/0xkidMockup.png',
    impact: ['Gamified Learning', 'AI Mentorship', 'Child-Friendly UI']
  },
  {
    number: '03',
    title: 'SkillBloom+',
    description: 'SkillBloom+ is a gamified platform that rewards learning with points, badges, and career perks—helping users Learn → Earn → Grow through challenges, mentoring, and collaboration.',
    longDescription: 'SkillBloom+ is a comprehensive learning management system that tracks student progress through GitHub integration. Features include course management, skill assessments, progress tracking, and automated certificate generation.',
    tech: ['Spring Boot', 'React.js', 'Docker', 'GitHub API'],
    category: 'EdTech',
    year: '2023',
    status: 'Live',
    liveLink: '#',
    githubLink: '#',
    preview: '/skillbloom.png',
    impact: ['1000+ Learners', 'GitHub Integration', 'Automated Assessments']
  },
  {
    number: '04',
    title: 'Portfolio v3',
    description: 'My personal craftboard—a portfolio built to be a product in itself, reflecting my passion for clean code, user experience, and modern web technologies.',
    longDescription: 'A fully responsive and interactive personal portfolio website designed to highlight professional skills, projects, certifications, and contact information. Built with a focus on clean design, smooth animations, and user-friendly navigation.',
    tech: ['TypeScript', 'Next.js', 'Tailwind CSS'],
    category: 'Front-End',
    year: '2025',
    status: 'Live',
    liveLink: 'https://your-portfolio-url.com',
    githubLink: '#',
    preview: '/portfolio.png',
    impact: ['Showcased Skills & Projects', 'Professional Branding', 'Interactive UI/UX']
  },
];

const simpleSplitText = (element: HTMLElement): HTMLElement[] => {
  const text = element.textContent || "";
  element.innerHTML = "";
  const spans: HTMLElement[] = [];
  for (const char of text) {
    const span = document.createElement('span');
    span.className = 'char inline-block';
    span.textContent = char === ' ' ? '\u00A0' : char;
    element.appendChild(span);
    spans.push(span);
  }
  return spans;
};

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (!isDesktop) {
      if (previewContainerRef.current) gsap.set(previewContainerRef.current, { autoAlpha: 0 });
      if (cursorRef.current) gsap.set(cursorRef.current, { scale: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const projectItems = gsap.utils.toArray('.project-item') as HTMLElement[];
      const previewContainer = previewContainerRef.current;
      const previewImage = previewImageRef.current;
      const cursor = cursorRef.current;
      const detailsEl = detailsRef.current;

      if (!previewContainer || !cursor || !detailsEl) return;

      gsap.set(cursor, { scale: 0 });
      gsap.set(previewContainer, { autoAlpha: 0 });

      const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      if (sectionRef.current) {
        const header = sectionRef.current.querySelector('h2');
        if (header) {
          const headerChars = simpleSplitText(header);
          gsap.from(headerChars, {
            yPercent: 100, opacity: 0, stagger: 0.03, duration: 1, ease: 'expo.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          });
        }
      }

      projectItems.forEach(item => {
        const textMask = item.querySelector('.text-mask');
        const otherItems = projectItems.filter(p => p !== item);
        const projectData = projectsData.find(p => p.number === item.dataset.projectNumber);

        item.addEventListener('mouseenter', () => {
          setActiveProject(projectData || null);
          document.addEventListener('mousemove', handleMouseMove);
          gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'expo.out' });
          gsap.to(previewContainer, { autoAlpha: 1, duration: 0.4, ease: 'expo.out' });
          if (previewImage && projectData) previewImage.src = projectData.preview || '';
          if (textMask) gsap.to(textMask, { color: 'transparent', duration: 0.4, ease: 'expo.out' });
          gsap.to(otherItems, { opacity: 0.2, duration: 0.4, ease: 'expo.out' });
          gsap.fromTo(detailsEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' });
        });

        item.addEventListener('mouseleave', () => {
          setActiveProject(null);
          document.removeEventListener('mousemove', handleMouseMove);
          gsap.to(cursor, { scale: 0, duration: 0.3, ease: 'expo.out' });
          gsap.to(previewContainer, { autoAlpha: 0, duration: 0.4, ease: 'expo.out' });
          if (textMask) gsap.to(textMask, { color: '#bdbbbb', duration: 0.4, ease: 'expo.out' });
          gsap.to(otherItems, { opacity: 1, duration: 0.4, ease: 'expo.out' });
          gsap.to(detailsEl, { opacity: 0, y: 20, duration: 0.5, ease: 'expo.out' });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

  const handleMobileProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, projectNumber: string) => {
    if (!isDesktop) {
      e.preventDefault();
      setExpandedProject(prev => (prev === projectNumber ? null : projectNumber));
    }
  };

  return (
    <section ref={sectionRef} id="projects" className={`relative md:min-h-screen px-4 sm:px-8 py-20 md:py-32 ${isDesktop ? 'cursor-none' : ''} bg-white dark:bg-black overflow-hidden`}>
      {/* These elements are only used by the desktop animations */}
      {isDesktop && (
        <>
          <div ref={cursorRef} className="fixed top-0 left-0 w-24 h-24 rounded-full bg-[#FF4D00] pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white">
            View
          </div>
          <div ref={previewContainerRef} className="fixed inset-0 z-0 pointer-events-none">
            <img ref={previewImageRef} src="" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-4 sm:mb-20 text-gray-900 dark:text-white">
            My Selected Works
          </h2>
        </div>

        <div className="">
          {projectsData.map((project) => {
            const isExpanded = expandedProject === project.number;
            return (
              <a
                key={project.number}
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="project-item group block border-b border-neutral-600"
                data-project-number={project.number}
                onClick={(e) => handleMobileProjectClick(e, project.number)}
              >
                <div className="relative py-6 md:py-8 transition-colors duration-300">
                  <h3 className="text-4xl md:text-8xl font-bold tracking-tighter text-transparent project-title-stroke" style={{ WebkitTextStroke: '1px gray' }}>
                    {project.title}
                  </h3>
                  <h3 className="text-mask absolute inset-0 py-6 md:py-8 text-4xl md:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white pointer-events-none">
                    {project.title}
                  </h3>
                </div>

                {/* Mobile-only expandable section */}
                {!isDesktop && (
                  <div className={`transition-[max-height,padding] duration-700 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] pb-6' : 'max-h-0'}`}>
                    <div className="px-1">
                      <img
                        src={project.preview}
                        alt={`${project.title} preview`}
                        className="w-full h-auto object-cover rounded-lg mb-4 border border-neutral-700"
                      />
                      <p className="text-neutral-600 dark:text-neutral-300 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map(t => <span key={t} className="px-3 py-1 text-xs text-white bg-neutral-800 border border-neutral-700 rounded-full">{t}</span>)}
                      </div>

                      <div className="flex justify-center gap-x-8 mt-4">
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-40 inline-flex justify-center items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-md text-sm font-semibold transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          >
                            Live Demo <FiArrowUpRight />
                          </a>
                        )}

                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-40 inline-flex justify-center items-center gap-2 px-4 py-2 bg-transparent border border-neutral-600 text-neutral-800 dark:text-neutral-300 rounded-md text-sm font-semibold transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                          >
                            <FaGithub /> GitHub
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Fixed Project Details Panel (Desktop Only) */}
      {isDesktop && activeProject && (
        <div ref={detailsRef} className="fixed bottom-8 right-8 z-30 pointer-events-none max-w-sm">
          <div className="lg:col-span-4 space-y-6 relative backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl shadow-black/10">
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                  {activeProject.title}
                </h3>
                <span className="text-xs font-light tracking-widest text-gray-500 uppercase">
                  {activeProject.category}
                </span>
              </div>
              <div className="project-description">
                <p className="text-lg font-light leading-relaxed text-gray-700 dark:text-gray-200 mb-4">
                  {activeProject.description}
                </p>
                <p className="text-sm font-light leading-relaxed text-gray-500 dark:text-gray-300">
                  {activeProject.longDescription}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-xs font-light tracking-widest text-gray-400 uppercase mb-2">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProject.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="tech-tag text-sm font-light tracking-wide text-gray-600 dark:text-gray-300 backdrop-blur-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center sm:text-right mt-8 sm:mt-16 sm:pr-8 ">
        <Link
          to="/projects"
          className="inline-flex items-center text-base sm:text-lg font-light tracking-wide text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors duration-300 px-4 py-2 rounded-md"
        >
          View more of my work
          <FiArrowUpRight className="ml-2" size={20} />
        </Link>
      </div>

    </section>
  );
};

export default Projects;