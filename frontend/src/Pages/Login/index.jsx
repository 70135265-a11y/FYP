import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageBackground from '../../Components/AuthPageBackground';


function LoginPage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/dashboard');
  };

  return (
    <AuthPageBackground>
      <div className="bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 px-8 py-10 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-3 text-blue-100">Login to continue to LiverAI and manage your scans.</p>
        </div>

        <div className="px-8 py-10">
          <div className="space-y-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email address</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <button type="button" className="font-semibold text-blue-600 hover:text-blue-800">
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleSignIn}
              type="button"
              className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-white text-lg font-semibold shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </AuthPageBackground>
  );
}

export default LoginPage;

