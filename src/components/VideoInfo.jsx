import React, { useEffect, useMemo, useState } from 'react';
import { Info } from 'lucide-react';

function parseUrlParts(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const filename = parts.length ? decodeURIComponent(parts[parts.length - 1]) : undefined;
    return {
      host: u.hostname,
      filename,
      protocol: u.protocol.replace(':', ''),
    };
  } catch {
    return {};
  }
}

export default function VideoInfo({ input, meta }) {
  const parsed = useMemo(() => parseUrlParts(input?.url || ''), [input]);
  const [format, setFormat] = useState('Unknown');

  useEffect(() => {
    const name = parsed.filename || '';
    const m = name.toLowerCase().match(/\.(mp4|mkv|mov|webm|m4v|avi)(?:$|\?)/);
    setFormat(m ? m[1].toUpperCase() : 'Unknown');
  }, [parsed.filename]);

  if (!input?.url) return null;

  return (
    <div className="w-full mt-4 bg-slate-900/50 border border-slate-800 rounded-lg p-4">
      <div className="flex items-center gap-2 text-slate-200 font-semibold">
        <Info className="h-4 w-4" />
        Video Info
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
        <div>
          <div className="text-slate-400">Source</div>
          <div className="font-medium break-all">{parsed.host || '—'}</div>
        </div>
        <div>
          <div className="text-slate-400">Format</div>
          <div className="font-medium">{format}</div>
        </div>
        <div className="sm:col-span-2">
          <div className="text-slate-400">File</div>
          <div className="font-medium break-all">{parsed.filename || '—'}</div>
        </div>
        {meta?.duration ? (
          <div className="sm:col-span-2">
            <div className="text-slate-400">Duration</div>
            <div className="font-medium">{Math.floor(meta.duration / 60)}m {meta.duration % 60}s</div>
          </div>
        ) : null}
        {(meta?.width && meta?.height) ? (
          <div className="sm:col-span-2">
            <div className="text-slate-400">Resolution</div>
            <div className="font-medium">{meta.width} x {meta.height}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
