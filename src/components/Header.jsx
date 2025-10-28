import React from 'react';

export default function Header() {
  return (
    <header className="w-full pt-10 pb-6 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
        Terabox Video Player
      </h1>
      <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
        Paste a direct video link or a Terabox share URL and play it instantly in your browser.
      </p>
    </header>
  );
}
