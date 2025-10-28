import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';

function getStrategy(input) {
  const raw = input?.url || '';
  try {
    const u = new URL(raw);
    const pathname = u.pathname.toLowerCase();
    const isFile = /(\.mp4|\.mkv|\.mov|\.webm|\.m4v|\.avi)$/.test(pathname);
    if (isFile) return { kind: 'video', src: raw };
    // Attempt to embed Terabox share page in an iframe as a best-effort fallback
    if (/terabox|1024tera|nephobox/.test(u.hostname)) {
      return { kind: 'iframe', src: raw };
    }
    // Generic fallback to iframe for other hosts
    return { kind: 'iframe', src: raw };
  } catch {
    return { kind: 'error', message: 'Invalid URL' };
  }
}

export default function VideoPlayer({ input, onMetadata }) {
  const strategy = useMemo(() => getStrategy(input), [input]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    setError('');
    setLoading(false);
  }, [strategy?.src]);

  // Extract some basic metadata for direct video files
  useEffect(() => {
    if (strategy.kind !== 'video') return;
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      try {
        const meta = {
          duration: isFinite(v.duration) ? Math.round(v.duration) : undefined,
          width: v.videoWidth || undefined,
          height: v.videoHeight || undefined,
        };
        onMetadata?.(meta);
      } catch {}
    };

    v.addEventListener('loadedmetadata', onLoaded);
    return () => v.removeEventListener('loadedmetadata', onLoaded);
  }, [strategy.kind, onMetadata]);

  useEffect(() => {
    if (strategy.kind === 'video') setLoading(true);
  }, [strategy.kind, strategy.src]);

  if (strategy.kind === 'error') {
    return (
      <div className="w-full aspect-video rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-red-300">
        <div className="flex items-center gap-2"><AlertCircle className="h-5 w-5" /> {strategy.message}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
        {strategy.kind === 'video' ? (
          <>
            {loading && (
              <div className="absolute inset-0 grid place-items-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            <video
              ref={videoRef}
              className="h-full w-full"
              src={strategy.src}
              controls
              playsInline
              preload="metadata"
              onCanPlay={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError('Unable to play this video. It may be blocked by CORS or the URL might be invalid.');
              }}
            />
          </>
        ) : (
          <iframe
            src={strategy.src}
            title="Video"
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
      {(error || strategy.kind === 'iframe') && (
        <div className="mt-3 text-xs text-slate-300/90">
          {error ? (
            <div className="flex items-center gap-2 text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-300" />
              <span>
                If the player doesn’t load, the site may block embedding. You can try opening the link directly.
              </span>
            </div>
          )}
          <a
            href={strategy.src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 mt-2"
          >
            <ExternalLink className="h-4 w-4" /> Open original link in new tab
          </a>
        </div>
      )}
    </div>
  );
}
