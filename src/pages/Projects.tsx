import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiGithub, FiExternalLink } from 'react-icons/fi';



const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const techRefs = useRef<(HTMLDivElement | null)[]>([]);
  const impactRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const projects = [
    {
      number: '01',
      title: 'BuzzBoard',
      description: 'An all-in-one platform for discovering, managing, and experiencing campus events like never before.',
      longDescription: 'BuzzBoard is a vibrant campus event management system. Built with TypeScript and React, it features event discovery, ticketing, real-time updates, and an interactive dashboard for organizers and students.',
      tech: ['TypeScript', 'React.js', 'GSAP', 'Node.js', 'MongoDB'],
      year: '2025',
      status: 'Live',
      category: 'Full-Stack',
      image: '/buzzboard.png', // Placeholder image path, user can update
      github: 'https://github.com/bangalsubham20/BuzzBoard',
      live: 'https://github.com/bangalsubham20/BuzzBoard',
      impact: ['Campus Collaboration', 'Event Discovery', 'High Engagement'],
    },
    {
      number: '02',
      title: 'Cultural Circuit',
      description: 'A platform dedicated to preserving and sharing India\'s cultural heritage with interactive features.',
      longDescription: 'The Cultural Circuit connects communities through cultural preservation. Features include cultural event management, heritage documentation, community forums, and multimedia galleries. Built with React and Node.js.',
      tech: ['React.js', 'JavaScript', 'Node.js', 'Styled Components', 'Lucide React'],
      year: '2025',
      status: 'Live',
      category: 'Web Platform',
      image: '/cultural.png',
      github: 'https://github.com/bangalsubham20/Cultural-circuit',
      live: 'https://cultural-circuit.vercel.app',
      impact: ['Heritage Preservation', 'Community Building', 'Cultural Education'],
    },
    {
      number: '03',
      title: 'CrediTrack',
      description: 'A robust financial tracking and credit management platform for loan applications and EMI management.',
      longDescription: 'CrediTrack streamlines the loan application process and EMI tracking. Built with Java Spring Boot and React, it features user authentication, credit score simulation, and automated payment reminders.',
      tech: ['Java', 'Spring Boot', 'React.js', 'MySQL', 'Spring Security'],
      year: '2026',
      status: 'Live',
      category: 'FinTech',
      image: '/creditrack.png',
      github: 'https://github.com/bangalsubham20/CrediTrack',
      live: 'https://github.com/bangalsubham20/CrediTrack',
      impact: ['Financial Inclusion', 'Automated EMI Tracking', 'Secure Banking'],
    },
    {
      number: '04',
      title: 'SundaySoul',
      description: 'A lifestyle and e-commerce platform designed for a seamless shopping experience.',
      longDescription: 'SundaySoul is a modern e-commerce platform that emphasizes user experience and clean design. Built with React and optimized for performance, it features a smooth checkout flow and responsive product catalogs.',
      tech: ['JavaScript', 'React.js', 'Tailwind CSS', 'Vite'],
      year: '2025',
      status: 'Live',
      category: 'E-Commerce',
      image: 'https://images.pexels.com/photos/5650040/pexels-photo-5650040.jpeg',
      github: 'https://github.com/bangalsubham20/SundaySoul',
      live: 'https://www.sundaysoul.in',
      impact: ['Seamless UX', 'Performance Optimized', 'Professional Branding'],
    },
    {
      number: '05',
      title: 'Subham Portfolio',
      description: 'A visually stunning and interactive personal portfolio to showcase skills, projects, and achievements.',
      longDescription: 'A fully responsive and interactive personal portfolio website designed to highlight professional skills, projects, certifications, and contact information. Built with focus on clean design, smooth animations, and premium UI.',
      tech: ['TypeScript', 'React.js', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
      year: '2026',
      status: 'Live',
      category: 'Front-End',
      image: '/portfolio.png',
      github: 'https://github.com/bangalsubham20/Subham_Portfolio',
      live: 'https://github.com/bangalsubham20/Subham_Portfolio',
      impact: ['Personal Branding', 'Interactive UI/UX', '99% Lighthouse Score'],
    },
    {
      number: '06',
      title: 'AyurSphere',
      description: 'An Ayurvedic health and wellness platform promoting holistic living through traditional wisdom.',
      longDescription: 'AyurSphere is a web application that provides resources and guidance on Ayurvedic practices. It features personalized wellness tips, herbal documentation, and a community focus on holistic health.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
      year: '2025',
      status: 'Live',
      category: 'HealthTech',
      image: '/ayursphere.png',
      github: 'https://github.com/bangalsubham20/AyurSphere',
      live: 'https://ayursphere.vercel.app',
      impact: ['Holistic Wellness', 'Educational Content', 'Tradition Integration'],
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Initial animations
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
        });
      }

      // Project item animations
      const projectItems = projectsRef.current?.children;

      if (projectItems) {
        gsap.utils.toArray(projectItems).forEach((item: any, i) => {
          // Create a timeline for each project
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none none',
            }
          });

          // Number animation
          const numberEl = item.querySelector('.project-number');
          if (numberEl) {
            tl.fromTo(
              numberEl,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' },
              0
            );
          }

          // Image animation (parallax + scale)
          if (imageRefs.current[i]) {
            tl.fromTo(
              imageRefs.current[i],
              { y: 80, opacity: 0, scale: 0.9 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: imageRefs.current[i],
                  start: 'top 75%',
                  scrub: 1
                }
              },
              0.1
            );
          }

          // Title animation
          if (titleRefs.current[i]) {
            tl.fromTo(
              titleRefs.current[i],
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
              0.2
            );
          }

          // Description animation
          const descEls = item.querySelectorAll('.project-description p');
          if (descEls.length) {
            tl.fromTo(
              descEls,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
              },
              0.3
            );
          }

          // Tech tags animation
          const techChildren = techRefs.current[i]?.children;
          if (techChildren && techChildren.length) {
            tl.fromTo(
              techChildren,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out'
              },
              0.4
            );
          }

          // Impact animation
          const impactChildren = impactRefs.current[i]?.children;
          if (impactChildren && impactChildren.length) {
            tl.fromTo(
              impactChildren,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out'
              },
              0.5
            );
          }

          // Meta info animation
          const metaChildren = metaRefs.current[i]?.children;
          if (metaChildren && metaChildren.length) {
            tl.fromTo(
              metaChildren,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
              },
              0.6
            );
          }

          // Button animations
          if (buttonRefs.current[i * 2]) {
            tl.fromTo(
              buttonRefs.current[i * 2],
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              0.7
            );
          }

          if (projects[i].live && buttonRefs.current[i * 2 + 1]) {
            tl.fromTo(
              buttonRefs.current[i * 2 + 1],
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              0.8
            );
          }

          // Hover effects for the entire project item
          gsap.to(item, {
            borderTopColor: '#d1d5db',
            scrollTrigger: {
              trigger: item,
              start: 'top 70%',
              end: 'top 30%',
              scrub: true
            }
          });

          // Image hover effect
          if (imageRefs.current[i]) {
            imageRefs.current[i]?.addEventListener('mouseenter', () => {
              gsap.to(imageRefs.current[i], {
                scale: 1.03,
                duration: 0.5,
                ease: 'power2.out'
              });
            });

            imageRefs.current[i]?.addEventListener('mouseleave', () => {
              gsap.to(imageRefs.current[i], {
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
              });
            });
          }
        });
      }

      // GitHub link animation
      const githubLink = document.querySelector('.github-link');
      if (githubLink) {
        gsap.from(githubLink, {
          opacity: 0,
          y: 20,
          scrollTrigger: {
            trigger: githubLink,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    }); // End of gsap.context

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-16 overflow-hidden">
      <section
        ref={sectionRef}
        className="px-8 max-w-7xl mx-auto"
      >
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8">
            All Projects
          </h1>
          <p className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
            A comprehensive collection of my work, showcasing various technologies and problem-solving approaches
          </p>
        </div>

        <div ref={projectsRef} className="space-y-24">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group border-t border-gray-200 dark:border-gray-800 pt-12 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-500"
              data-cursor="-opaque"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-2">
                  <span
                    className="project-number text-6xl font-light text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-500 transition-colors duration-500"
                  >
                    {project.number}
                  </span>
                </div>

                <div className="lg:col-span-4">
                  <img
                    ref={el => imageRefs.current[index] = el}
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-[4/3] object-cover border border-gray-200 dark:border-gray-800 group-hover:border-gray-400 dark:group-hover:border-gray-600 transition-all duration-300"
                    data-cursor="-opaque"
                  />
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h3
                        ref={el => titleRefs.current[index] = el}
                        className="text-2xl font-light tracking-tight"
                      >
                        {project.title}
                      </h3>
                      <span className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase">
                        {project.category}
                      </span>
                    </div>
                    <div className="project-description">
                      <p className="text-lg font-light leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                        {project.description}
                      </p>
                      <p className="text-sm font-light leading-relaxed text-gray-600 dark:text-gray-400">
                        {project.longDescription}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div ref={el => techRefs.current[index] = el}>
                      <p className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-2">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="tech-tag text-sm font-light tracking-wide text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                            data-cursor="-opaque"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div ref={el => impactRefs.current[index] = el}>
                      <p className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-2">
                        Impact
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.impact.map((item, impactIndex) => (
                          <span
                            key={impactIndex}
                            className="impact-item text-sm font-light tracking-wide text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                            data-cursor="-opaque"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div ref={el => metaRefs.current[index] = el} className="space-y-4">
                    <div>
                      <p className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-1">
                        Year
                      </p>
                      <p className="font-light">{project.year}</p>
                    </div>
                    <div>
                      <p className="text-xs font-light tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-1">
                        Status
                      </p>
                      <p className="font-light">{project.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <a
                      ref={el => buttonRefs.current[index * 2] = el}
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-button inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
                      data-cursor="-opaque"
                    >
                      <FiGithub size={16} />
                      <span className="text-sm font-light">Code</span>
                    </a>
                    {project.live && (
                      <a
                        ref={el => buttonRefs.current[index * 2 + 1] = el}
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="live-button inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
                        data-cursor="-opaque"
                      >
                        <FiExternalLink size={16} />
                        <span className="text-sm font-light">Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <a
            href="https://github.com/bangalsubham20"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link inline-flex items-center text-lg font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            data-cursor="-opaque"
          >
            View GitHub profile
            <FiArrowUpRight className="ml-2" size={20} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Projects;