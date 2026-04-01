import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-slate-500 mb-8">Page not found</p>
      <Link to="/" className="text-emerald-500 hover:underline">Go home</Link>
    </div>
  );
};

export default NotFoundPage;
