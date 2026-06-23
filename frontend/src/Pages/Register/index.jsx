import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageBackground from '../../Components/AuthPageBackground';

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  // Role kept for future backend usage; currently unused.
  // const [role, setRole] = useState('patient');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const trimmedFullName = useMemo(() => fullName.trim(), [fullName]);
  const trimmedEmail = useMemo(() => email.trim(), [email]);

  const validate = () => {
    if (!trimmedFullName) return 'Please enter your full name.';
    if (!trimmedEmail) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    if (!acceptedTerms) return 'Please accept the terms to continue.';
    return '';
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextError = validate();
    setError(nextError);
    setSuccess('');

    if (nextError) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedFullName,
          email: trimmedEmail,
          password,
          role: 'patient',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed. Please try again.');
      }

      setSuccess('Account created successfully. Redirecting to login...');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageBackground>
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 px-8 py-10 text-center">
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="mt-3 text-blue-100">Register to manage your scans with LiverAI.</p>
        </div>

        <div className="px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="e.g., John Doe"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email address</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {/* <label className="block">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="researcher">Researcher</option>
              </select>
            </label> */}

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Create a password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Confirm password</span>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Re-enter your password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I agree to the{' '}
                <span className="font-semibold text-slate-700">Terms & Privacy</span>.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-white text-lg font-semibold shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </AuthPageBackground>
  );
}

export default RegisterPage;


