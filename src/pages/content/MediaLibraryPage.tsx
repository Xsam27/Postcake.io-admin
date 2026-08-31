import React, { useState } from 'react';
import { Image, Upload, Search, Copy, Check, Trash2, ExternalLink } from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const mediaFiles = [
    { id: 'm-1', name: 'postcake-hero-banner.png', url: '/hero-2.png', size: '1.2 MB', type: 'PNG Image', dimensions: '1920x1080' },
    { id: 'm-2', name: 'creator-playbook-cover.png', url: '/hero-3.png', size: '840 KB', type: 'PNG Image', dimensions: '1200x630' },
    { id: 'm-3', name: 'postcake-wordmark-dark.png', url: '/postcake-wordmark-dark.png', size: '120 KB', type: 'Logo Asset', dimensions: '800x240' },
    { id: 'm-4', name: 'postcake-icon-3d.png', url: '/postcake-icon.png', size: '94 KB', type: 'App Icon', dimensions: '512x512' },
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <Image className="w-6 h-6 text-[#FF7A00]" />
            Supabase Storage & Media Library
          </h1>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Manage CDN media assets, blog cover images, and open-graph marketing banners.
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#e06c00] border-2 border-black text-xs font-black uppercase text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Upload Asset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mediaFiles.map((file) => (
          <div key={file.id} className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div className="h-40 bg-zinc-900 flex items-center justify-center p-4 border-b-2 border-zinc-300 dark:border-zinc-800 overflow-hidden">
              <img src={file.url} alt={file.name} className="max-h-full object-contain" />
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="font-black text-xs text-white truncate">{file.name}</div>
                <div className="text-[11px] text-zinc-500 font-bold">{file.size} • {file.dimensions}</div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-300 dark:border-zinc-800">
                <button
                  onClick={() => handleCopy(file.url)}
                  className="flex-1 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedUrl === file.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl === file.url ? 'Copied' : 'Copy URL'}
                </button>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
