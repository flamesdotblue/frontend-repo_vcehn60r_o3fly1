import React, { useState } from 'react';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import VideoPlayer from './components/VideoPlayer';
import VideoInfo from './components/VideoInfo';

export default function App() {
  const [input, setInput] = useState(null);
  const [meta, setMeta] = useState({});

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-4">
        <Header />

        <div className="mt-4 sm:mt-8">
          <UrlInput onPlay={setInput} />
        </div>

        <div className="mt-6 sm:mt-8">
          <VideoPlayer input={input} onMetadata={setMeta} />
          <VideoInfo input={input} meta={meta} />
        </div>

        <div className="py-10 text-center text-xs text-slate-500">
          Note: Some sites (including Terabox) may restrict embedding or streaming via browser due to CORS or security policies. Direct media links work best.
        </div>
      </div>
    </div>
  );
}
