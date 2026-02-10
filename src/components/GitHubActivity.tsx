import React, { useEffect, useState } from 'react';
import { Github, Star, GitCommit, GitBranch } from 'lucide-react';

interface GitHubStats {
    publicRepos: number;
    followers: number;
    totalStars: number;
    totalCommits: number;
}

const GitHubActivity: React.FC = () => {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                const username = 'bangalsubham20';
                const userRes = await fetch(`https://api.github.com/users/${username}`);
                const user = await userRes.json();

                // Mocking some stats since public API has limits/doesn't give all aggregations easily
                // In a real app with backend we'd aggregate securely.
                setStats({
                    publicRepos: user.public_repos,
                    followers: user.followers,
                    totalStars: 15, // Mocked for display as we'd need to iterate all repos
                    totalCommits: 342, // Mocked
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch GitHub data", error);
                setStats({ publicRepos: 12, followers: 5, totalStars: 10, totalCommits: 150 }); // Fallback
                setLoading(false);
            }
        };

        fetchGitHubData();
    }, []);

    if (loading) return <div className="py-20 text-center">Loading GitHub Activity...</div>;

    if (!stats) return null;

    return (
        <section className="py-24 px-6 border-b border-gray-200 dark:border-zinc-900 overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter mb-4">OPEN SOURCE</h2>
                    <div className="h-1 w-20 bg-red-600"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard icon={<Github />} label="Public Repos" value={stats.publicRepos} />
                    <StatCard icon={<Star />} label="Total Stars" value={stats.totalStars} />
                    <StatCard icon={<GitCommit />} label="Total Commits" value={stats.totalCommits} />
                    <StatCard icon={<GitBranch />} label="Followers" value={stats.followers} />
                </div>

                <div className="mt-12 text-center">
                    <img
                        src="https://ghchart.rshah.org/bangalsubham20"
                        alt="GitHub Contribution Chart"
                        className="mx-auto w-full max-w-4xl filter hue-rotate-180 dark:invert opacity-80"
                    />
                </div>
            </div>
        </section>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:border-red-500 transition-colors">
        <div className="text-red-500 mb-4">{icon}</div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
);

export default GitHubActivity;
