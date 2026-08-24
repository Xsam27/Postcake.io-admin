import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Edit3, Globe, Eye, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { BlogPostItem } from '../../types/admin';

export const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminService.getBlogPosts().then(setPosts);
  }, []);

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#FF7A00]" />
            Blog & SEO Content Studio
          </h1>
          <p className="text-xs font-bold text-zinc-400 mt-1">
            Write, optimize, preview, and publish SEO guides and thought leadership articles for Postcake.
          </p>
        </div>

        <Link
          to="/admin/content/blog/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#e06c00] border-2 border-black text-xs font-black uppercase text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <Plus className="w-4 h-4" />
          Write New Article
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121216] border-3 border-zinc-800 p-4 rounded-3xl flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search articles by title or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((post) => (
          <div key={post.id} className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {post.category}
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {post.status}
                </span>
              </div>

              <h3 className="font-display font-black text-lg text-white leading-snug">{post.title}</h3>
              <p className="text-xs text-zinc-400 font-bold mt-2 line-clamp-2">{post.excerpt}</p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-zinc-800 flex items-center justify-between text-xs">
              <div className="text-zinc-500 font-bold">
                {post.word_count || 1200} words • {post.reading_time_minutes || 6} min read
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                  title="View Public Post"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
                <Link
                  to={`/admin/content/blog/${post.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit & SEO
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
