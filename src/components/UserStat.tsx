import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserData {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  blog?: string;
  location?: string;
  html_url: string;
}

interface RepoData {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  created_at: string;
}

export default function UserStat() {
  const [userId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("githubId") : null
  );

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRepoData, setUserRepoData] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languageStats, setLanguageStats] = useState<
    { language: string; count: number }[]
  >([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await fetch(`https://api.github.com/users/${userId}`);
        const userJson = await userRes.json();
        setUserData(userJson);

        const reposRes = await fetch(
          `https://api.github.com/users/${userId}/repos?sort=stars&order=desc&per_page=100`
        );
        const reposJson = await reposRes.json();
        setUserRepoData(Array.isArray(reposJson) ? reposJson : []);

        if (Array.isArray(reposJson)) {
          const langCount: { [key: string]: number } = {};
          reposJson.forEach((repo: RepoData) => {
            if (repo.language) {
              langCount[repo.language] = (langCount[repo.language] || 0) + 1;
            }
          });

          const langStats = Object.entries(langCount)
            .map(([language, count]) => ({ language, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); 

          setLanguageStats(langStats);
        }
      } catch (err) {
        setError("Failed to fetch GitHub data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  
  if (!userId) {

    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-lg text-slate-400">No GitHub username provided</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-lg text-slate-400">Loading...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-lg text-red-400">{error || "User not found"}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur shadow-2xl shadow-slate-900/50 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center md:items-start gap-4">
              <img
                src={userData.avatar_url}
                alt={userData.login}
                className="w-24 h-24 rounded-full border-2 border-indigo-400/40 shadow-lg"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <a
                  href={userData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition inline-block"
                >
                  @{userData.login}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full md:w-auto ml-0 md:ml-auto">
              <div className="rounded-lg bg-slate-800/50 p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-indigo-400">
                  {userData.public_repos}
                </div>
                <div className="text-sm text-slate-400">Repositories</div>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-green-400">
                  {userData.followers}
                </div>
                <div className="text-sm text-slate-400">Followers</div>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-blue-400">
                  {userData.following}
                </div>
                <div className="text-sm text-slate-400">Following</div>
              </div>
            </div>
          </div>

          {userData.bio && (
            <p className="mt-6 text-slate-300 border-t border-slate-700 pt-6">
              {userData.bio}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Top Repositories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userRepoData.slice(0, 6).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-800 bg-slate-900/70 backdrop-blur p-6 hover:border-indigo-400/40 transition shadow-lg hover:shadow-indigo-500/10"
              >
                <h3 className="text-lg font-semibold text-indigo-400 hover:text-indigo-300 transition">
                  {repo.name}
                </h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  {repo.description || "No description"}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  {repo.language && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-yellow-400">
                    ⭐ {repo.stargazers_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {languageStats.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Most Used Languages</h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur shadow-2xl shadow-slate-900/50 p-8">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={languageStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="language"
                    stroke="#cbd5e1"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#cbd5e1" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    cursor={{ fill: "#4f46e5" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                    name="Number of Repos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
