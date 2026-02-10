import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && footerRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
          },
        }
      );
    }
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="px-8 pb-12 pt-0"
    >
      <div className="max-w-full mx-auto border-t-2 border-gray-200 dark:border-gray-800 pt-12">
        <div ref={contentRef} className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">

          {/* Brand */}
          <div className="text-xl font-light tracking-wider">
            <Link
              to="/"
              className="text-xl font-light tracking-wider group"
            >
              <span className='text-red-600 font-bold group-hover:text-red-500 transition-colors'>SUBHAM </span>
              <span className="text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">BANGAL</span>
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="mailto:bangalsubham@gmail.com"
              className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-300"
              aria-label="Email"
            >
              <FiMail size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/bangalsubham20/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
            <a
              href="https://github.com/bangalsubham20"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-300"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm font-light text-gray-500 dark:text-gray-500">
            &copy; {currentYear} Subham Bangal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;