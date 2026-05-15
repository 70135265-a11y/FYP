import React from 'react';

function AuthPageBackground({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex items-center justify-center px-4 py-10">
      {/* LiverAI glow */}
      <div className="pointer-events-none absolute -top-36 -left-36 h-96 w-96 rounded-full bg-indigo-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-36 h-96 w-96 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute top-24 left-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/35 blur-3xl" />

      {/* Subtle grid + vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100 bg-[linear-gradient(to_right,rgba(37,99,235,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.10)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_60%)]" />

      {/* Content */}
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

export default AuthPageBackground;

