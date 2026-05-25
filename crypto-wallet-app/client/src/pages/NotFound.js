import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound(){
  return (
    <div className="flex items-center justify-center flex-col gap-6">
      <div className="text-6xl font-extrabold">404</div>
      <div className="text-lg">Page not found</div>
      <Link to="/" className="px-4 py-2 bg-violet-600 rounded-md">Go Home</Link>
    </div>
  );
}
