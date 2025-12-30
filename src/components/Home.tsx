import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [githubid, setGithubId] = useState<string>("");
  const navigate = useNavigate();
  const storeGithubID = () => {
    localStorage.setItem("githubId", githubid);
    navigate("/userStat");
  };
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur shadow-2xl shadow-slate-900/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-200 font-semibold">
              GH
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Lookup
              </p>
              <h1 className="text-2xl font-semibold">GitHub Username</h1>
            </div>
          </div>

          <label
            className="block text-sm font-medium text-slate-300 mb-2"
            htmlFor="githubid"
          >
            Enter your GitHub username
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              id="githubid"
              type="text"
              placeholder="e.g. torvalds"
              onChange={(e) => setGithubId(e.currentTarget.value)}
              className="flex-1 rounded-lg bg-slate-800/80 border border-slate-700 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 outline-none transition"
            />
            <button
              type="button"
              className="inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              onClick={() => storeGithubID()}
            >
              Search
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Tip: we only need the username, not the full profile URL.
          </p>
        </div>
      </div>
    </main>
  );
}
