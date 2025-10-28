import React, { useState } from 'react';
import { Play, Link2, AlertTriangle } from 'lucide-react';

function isLikelyVideoFile(url) {
  try {
    const u = new URL(url);
    const pathname = u.pathname.toLowerCase();
    return /(\.mp4|\.mkv|\.mov|\.webm|\.m4v|\.avi)$/.test(pathname);
  } catch {
    return false;
  }
}

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function UrlInput({ onPlay }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isValidHttpUrl(value)) {
      setError('Please enter a valid URL starting with https:// or http://');
      return;
    }

    // Basic guidance for Terabox links
    if (value.includes('terabox') || value.includes('1024tera') || value.includes('nephobox')) {
      // We'll try to play using iframe fallback when direct file URL is not present
      onPlay({ url: value, type: 'auto', hint: 'terabox' });
      return;
    }

    // Direct video links
    if (isLikelyVideoFile(value)) {
      onPlay({ url: value, type: 'video' });
      return;
    }

    // Fallback: still attempt to play via iframe
    onPlay({ url: value, type: 'auto' });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste Terabox link or direct video URL (mp4, mkv, mov, webm)"
              className="w-full bg-slate-800/60 text-white placeholder-slate-400 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none rounded-lg py-3 pl-10 pr-3"
              required
            />
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
          {error && (
            <div className="mt-2 flex items-center gap-2 text-amber-300 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          <p className="mt-2 text-xs text-slate-400">
            Tip: For best compatibility, use a direct media URL ending with .mp4, .mkv, .mov, or .webm. Terabox share pages may restrict embedding in some cases.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors"
        >
          <Play className="h-5 w-5" />
          <span>Play Video</span>
        </button>
      </div>
    </form>
  );
}
