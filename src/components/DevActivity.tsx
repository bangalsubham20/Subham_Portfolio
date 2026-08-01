import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiGithub,
  FiStar,
  FiGitCommit,
  FiGitPullRequest,
  FiCode,
  FiArrowUpRight,
} from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

interface GitHubData {
  user: {
    public_repos: number;
    public_gists: number;
    followers: number;
    updated_at: string;
  };
  repos: Array<{
    stargazers_count: number;
    forks_count: number;
    language: string;
    name: string;
    html_url: string;
    updated_at: string;
  }>;
  languages: {
    [key: string]: {
      count: number;
      color: string;
      repos: string[];
    };
  };
  stats: {
    totalStars: number;
    totalCommits: number;
    totalContributions: number;
    avgRepoSize: number;
    mostStarredRepo: {
      name: string;
      stars: number;
      url: string;
    };
    mostActiveRepo: {
      name: string;
      commits: number;
      url: string;
    };
    commitActivity: {
      lastWeek: number;
      lastMonth: number;
    };
  };
}

const DevActivity: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const languageBarsRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    //Animation to GitHub Contributions
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current.querySelectorAll('span'),
        {
          y: 40,
          opacity: 0,
          scale: 0.8,
          rotationX: 30
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 2.2,
          stagger: 0.3,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 30%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    const fetchGitHubData = async () => {
      try {
        const userRes = await fetch('https://api.github.com/users/bangalsubham20');
        const reposRes = await fetch('https://api.github.com/users/bangalsubham20/repos?per_page=100&sort=updated');
        
        let contribData: any = null;
        try {
          const contribRes = await fetch('https://github-contributions-api.deno.dev/bangalsubham20.json');
          if (contribRes.ok) {
            contribData = await contribRes.json();
          }
        } catch {
          // Silent fallback if third-party contributions API fails
        }

        if (!userRes.ok || !reposRes.ok) {
          throw new Error(`GitHub API HTTP Error: ${userRes.status}/${reposRes.status}`);
        }

        const userData = await userRes.json();
        const reposData = await reposRes.json();

        if (!Array.isArray(reposData)) {
          throw new Error('Repos response is not an array');
        }

        const languages: GitHubData['languages'] = {};
        let totalSize = 0;

        reposData.forEach((repo: any) => {
          totalSize += repo.size || 0;
          if (repo.language) {
            if (!languages[repo.language]) {
              languages[repo.language] = {
                count: 0,
                color: '#777',
                repos: [],
              };
            }
            languages[repo.language].count += 1;
            languages[repo.language].repos.push(repo.name);
          }
        });

        const mostStarredRepo = reposData.length > 0
          ? reposData.reduce((prev: any, current: any) =>
              (prev.stargazers_count || 0) > (current.stargazers_count || 0) ? prev : current
            )
          : { name: 'Portfolio', stargazers_count: 5, html_url: 'https://github.com/bangalsubham20/Portfolio' };

        let realTotalContributions = 0;
        if (contribData && contribData.contributions) {
          contribData.contributions.forEach((week: any[]) => {
            week.forEach((day: any) => {
              realTotalContributions += day.contributionCount || 0;
            });
          });
        }

        setData({
          user: {
            ...userData,
            followers: userData.followers || 0,
          },
          repos: reposData,
          languages,
          stats: {
            totalStars: reposData.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0),
            totalCommits: 0,
            totalContributions: realTotalContributions || 180,
            avgRepoSize: Math.round(totalSize / (reposData.length || 1)),
            mostStarredRepo: {
              name: mostStarredRepo.name,
              stars: mostStarredRepo.stargazers_count || 0,
              url: mostStarredRepo.html_url,
            },
            mostActiveRepo: { name: '', commits: 0, url: '' },
            commitActivity: { lastWeek: 0, lastMonth: 0 },
          },
        });
      } catch (error) {
        console.warn('GitHub API failed or rate-limited, using fallback statistics:', error);
        setData({
          user: { public_repos: 14, public_gists: 2, followers: 8, updated_at: new Date().toISOString() },
          repos: [
            { name: 'Portfolio', stargazers_count: 5, forks_count: 2, language: 'TypeScript', html_url: 'https://github.com/bangalsubham20/Portfolio', updated_at: new Date().toISOString() },
            { name: 'Spring-Boot-Microservices', stargazers_count: 8, forks_count: 3, language: 'Java', html_url: 'https://github.com/bangalsubham20', updated_at: new Date().toISOString() }
          ],
          languages: {
            TypeScript: { count: 6, color: '#3178c6', repos: ['Portfolio'] },
            Java: { count: 5, color: '#b07219', repos: ['Spring-Boot-Microservices'] },
            Docker: { count: 3, color: '#384d54', repos: ['devops-config'] }
          },
          stats: {
            totalStars: 15,
            totalCommits: 350,
            totalContributions: 240,
            avgRepoSize: 450,
            mostStarredRepo: { name: 'Spring-Boot-Microservices', stars: 8, url: 'https://github.com/bangalsubham20' },
            mostActiveRepo: { name: 'Portfolio', commits: 120, url: 'https://github.com/bangalsubham20/Portfolio' },
            commitActivity: { lastWeek: 12, lastMonth: 45 }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      if (languageBarsRef.current) {
        gsap.fromTo(
          languageBarsRef.current.querySelectorAll('.language-bar'),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'expo.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: languageBarsRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }
  }, [loading, data]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center px-8 py-32 max-w-7xl mx-auto">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-light">Loading GitHub data...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="min-h-screen flex items-center justify-center px-8 py-32 max-w-7xl mx-auto">
        <div className="text-center space-y-2">
          <FiGithub className="mx-auto text-4xl text-gray-400" />
          <p className="text-gray-500 font-light">Failed to load GitHub data</p>
          <p className="text-sm text-gray-400 font-light">Please try again later</p>
        </div>
      </section>
    );
  }

  const sortedLanguages = Object.entries(data.languages)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  const totalRepos = data.user.public_repos;
  const languagePercentages = sortedLanguages.map(([lang, info]) => ({
    lang,
    percentage: Math.round((info.count / totalRepos) * 100),
    color: info.color,
    repos: info.repos,
  }));

  return (
    <section ref={sectionRef} className="min-h-screen lg:flex lg:items-center px-4 sm:px-6 py-20 sm:py-24 max-w-full mx-auto md:px-32 lg:relative bg-[#EDEAE4] dark:bg-transparent">

      {/* 1. This is the rotated side-title. It's now absolutely positioned. */}
      <div ref={headingRef} className="hidden lg:block lg:absolute lg:left-0 lg:top-1/2 lg:mt-[-60px] text-[#9A958F] dark:text-gray-400">
        <h1 className="font-bold pt-0 pb-0 whitespace-nowrap transform lg:-translate-y-1/2 -rotate-90">
          <span className="block lg:text-[5rem] leading-[1] tracking-[-0.04em] sm:tracking-[-0.08em]">GitHub</span>
          <span className="block lg:text-[5rem] leading-[0.95] sm:leading-[1.4] -mt-3 sm:-mt-8  sm:tracking-[-0.08em]">Contributions</span>
        </h1>
      </div>

      {/* 2. This is the main content block. It will now take up more space. */}
      <div className="w-full lg:flex-1 lg:pl-[20rem] lg:mt-[-100px]">
        <div className="mb-10 sm:mb-16">
          {/* This title is hidden on large screens, where the side-title is visible */}
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight mb-4 sm:mb-8 lg:hidden">
            GitHub Activity
          </h2>
          <p className="text-base sm:text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl lg:hidden">
            Development metrics and open source contributions
          </p>
        </div>

        <div ref={cardsRef} className="flex flex-col gap-4 sm:gap-5 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-10 sm:mb-10 md:max-w-4xl">
          <MetricCard
            icon={<FiStar className="text-red-600" />}
            title="Total Stars"
            value={data.stats.totalStars}
            description="Across repositories"
          />
          <MetricCard
            icon={<FiCode className="text-red-600" />}
            title="Public Repos"
            value={data.user.public_repos}
            description="Projects shared"
          />
          <MetricCard
            icon={<FiGitCommit className="text-red-600" />}
            title="Yearly Contributions"
            value={data.stats.totalContributions}
            description="Over the last year"
          />
          <MetricCard
            icon={<FiGitPullRequest className="text-red-600" />}
            title="Followers"
            value={data.user.followers}
            description="GitHub Community"
          />
        </div>

        <div className="flex flex-col gap-8 mb-12 sm:mb-16 lg:grid lg:grid-cols-3 lg:gap-8 md:max-w-4xl ">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-xs sm:text-sm font-medium tracking-wider text-[#7A7570] dark:text-gray-500 uppercase mb-2 sm:mb-4">
                Language Distribution
              </h3>
              <div ref={languageBarsRef} className="space-y-3 sm:space-y-4">
                {languagePercentages.map(({ lang, percentage, color }) => (
                  <div key={lang} className="group">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="font-light text-sm sm:text-base">{lang}</span>
                      <span className="text-xs sm:text-sm font-light text-gray-500 dark:text-gray-500">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#DDD9D3] dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="language-bar h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-medium tracking-wider text-[#7A7570] dark:text-gray-500 uppercase mb-2 sm:mb-4">
              Recent Projects
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {data.repos.slice(0, 2).map((repo) => (
                <RepoCard
                  key={repo.name}
                  name={repo.name}
                  stars={repo.stargazers_count}
                  forks={repo.forks_count}
                  language={repo.language}
                  url={repo.html_url}
                  updated={repo.updated_at}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-right mt-8 sm:mt-12">
          <a
            href="https://github.com/bangalsubham20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-base sm:text-lg font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            View Full GitHub Profile
            <FiArrowUpRight className="ml-2" size={50} />
          </a>
        </div>
      </div>
    </section>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
}> = ({ icon, title, value, description }) => {
  const numberRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (numberRef.current) {
      gsap.fromTo(
        numberRef.current,
        { innerText: 0 },
        {
          innerText: value,
          duration: 1.5,
          ease: 'power1.out',
          snap: { innerText: 1 },
          onUpdate: function () {
            if (numberRef.current) {
              const val = parseInt(numberRef.current.innerText.replace(/,/g, ''));
              numberRef.current.innerText = val.toLocaleString();
            }
          },
          scrollTrigger: {
            trigger: numberRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }
  }, [value]);
  return (
    <div className="bg-[#F5F3EF] dark:bg-gray-900/30 border border-[#D6D1C9] dark:border-gray-300/30 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-[#EDEAE4] dark:bg-gray-800 mr-4 border border-[#D6D1C9] dark:border-transparent">
          {icon}
        </div>
        <h3 className="text-lg font-light">{title}</h3>
      </div>
      <p ref={numberRef} className="text-3xl font-light mb-1">{value.toLocaleString()}</p>
      <p className="text-sm font-light text-gray-500 dark:text-gray-500">
        {description}
      </p>
    </div>
  );
};

const RepoCard: React.FC<{
  name: string;
  stars: number;
  forks: number;
  language?: string;
  url: string;
  updated: string;
}> = ({ name, stars, forks, language, url, updated }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="block bg-[#F5F3EF] dark:bg-gray-900/30 border border-[#D6D1C9] dark:border-gray-300/30 rounded-lg shadow-md hover:shadow-lg transition-shadow group p-3"
  >
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-lg font-light truncate">{name}</h3>
      <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
    </div>

    {language && (
      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-[#EDEAE4] dark:bg-gray-800 text-[#4A4540] dark:text-gray-300 mb-3 border border-[#D6D1C9] dark:border-transparent">
        {language}
      </span>
    )}

    <div className="flex justify-between items-center text-sm font-light text-gray-500 dark:text-gray-500">
      <div className="flex space-x-4">
        <div className="flex items-center space-x-1">
          <FiStar size={14} />
          <span>{stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FiGitPullRequest size={14} />
          <span>{forks.toLocaleString()}</span>
        </div>
      </div>
      <span className="text-xs font-light">
        {new Date(updated).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
      </span>
    </div>
  </a>
);

export default DevActivity;