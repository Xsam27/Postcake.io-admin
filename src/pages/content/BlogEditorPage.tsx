import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Save, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Share2,
  ArrowLeft
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { BlogPostItem } from '../../types/admin';

export const BlogEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Social Strategy');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [status, setStatus] = useState<BlogPostItem['status']>('draft');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      adminService.getBlogPosts().then((posts) => {
        const found = posts.find(p => p.id === id);
        if (found) {
          setTitle(found.title);
          setSlug(found.slug);
          setContent(found.content);
          setExcerpt(found.excerpt || '');
          setCategory(found.category);
          setSeoTitle(found.seo_title || found.title);
          setSeoDesc(found.seo_description || found.excerpt || '');
          setTargetKeyword(found.target_keyword || '');
          setStatus(found.status);
        }
      });
    }
  }, [id]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!id || id === 'new') {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      setSeoTitle(val);
    }
  };

  const handleSave = async (newStatus?: BlogPostItem['status']) => {
    const postStatus = newStatus || status;
    await adminService.saveBlogPost({
      id: id === 'new' ? undefined : id,
      title,
      slug,
      content,
      excerpt,
      category,
      seo_title: seoTitle,
      seo_description: seoDesc,
      target_keyword: targetKeyword,
      status: postStatus,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Live SEO checklist calculations
  const isTitleGood = seoTitle.length >= 30 && seoTitle.length <= 60;
  const isDescGood = seoDesc.length >= 80 && seoDesc.length <= 160;
  const isKeywordInTitle = targetKeyword ? title.toLowerCase().includes(targetKeyword.toLowerCase()) : false;

  return (
    <div className="space-y-6 font-sans animate-fade-in pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/content/blog')}
            className="p-2 rounded-xl bg-zinc-900 border-2 border-zinc-700 hover:border-white text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-display font-black uppercase text-white">
              {id === 'new' ? 'Create New Blog Post' : `Edit: ${title || 'Article'}`}
            </h1>
            <span className="text-[11px] font-bold text-zinc-400">Postcake SEO Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </span>
          )}
          <button
            onClick={() => handleSave('draft')}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            className="px-5 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#e06c00] border-2 border-black text-xs font-black uppercase text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            Publish Article
          </button>
        </div>
      </div>

      {/* Editor & SEO Preview Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1.5">Article Title</label>
              <input
                type="text"
                placeholder="e.g. 10x Your Reach: The Multi-Platform Scheduling Guide"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-white font-display font-black text-lg rounded-2xl focus:outline-none focus:border-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-mono rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="Social Strategy">Social Strategy</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Growth & Scaling">Growth & Scaling</option>
                  <option value="Product Updates">Product Updates</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1.5">Excerpt / Summary</label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={e => { setExcerpt(e.target.value); setSeoDesc(e.target.value); }}
                placeholder="Brief summary for cards and search snippets..."
                className="w-full px-4 py-2.5 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1.5">Markdown Content Body</label>
              <textarea
                rows={14}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your article in Markdown syntax..."
                className="w-full p-4 bg-zinc-900 border-2 border-zinc-700 text-white font-mono text-xs rounded-2xl focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right SEO & Live Snippet Preview Column */}
        <div className="space-y-6">
          {/* Live Google Search Preview Card */}
          <div className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-display font-black text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8C9EFF]" />
              Google SERP Snippet Preview
            </h2>

            <div className="p-4 rounded-2xl bg-white text-black space-y-1 font-sans">
              <div className="text-[11px] text-zinc-600 truncate">https://www.postcake.io/blog/{slug || 'post-slug'}</div>
              <div className="text-sm font-bold text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                {seoTitle || title || 'Postcake Blog Article'}
              </div>
              <div className="text-xs text-zinc-700 line-clamp-2 leading-relaxed">
                {seoDesc || excerpt || 'Discover social media scheduling strategies and automation tips on Postcake.'}
              </div>
            </div>
          </div>

          {/* SEO Controls & Optimization Box */}
          <div className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-display font-black text-xs uppercase tracking-wider text-zinc-400">
              SEO Parameters & Meta
            </h2>

            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Target Keyword</label>
              <input
                type="text"
                placeholder="e.g. social media scheduling"
                value={targetKeyword}
                onChange={e => setTargetKeyword(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black uppercase text-zinc-400">SEO Meta Title</label>
                <span className={`text-[10px] font-mono font-bold ${isTitleGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {seoTitle.length} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black uppercase text-zinc-400">SEO Meta Description</label>
                <span className={`text-[10px] font-mono font-bold ${isDescGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {seoDesc.length} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={e => setSeoDesc(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none"
              />
            </div>

            {/* SEO Checklist */}
            <div className="pt-3 border-t-2 border-zinc-800 space-y-1.5 text-xs font-bold">
              <div className={`flex items-center gap-2 ${isTitleGood ? 'text-emerald-400' : 'text-zinc-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Optimal title length (30-60 chars)
              </div>
              <div className={`flex items-center gap-2 ${isDescGood ? 'text-emerald-400' : 'text-zinc-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Optimal meta description (80-160 chars)
              </div>
              <div className={`flex items-center gap-2 ${isKeywordInTitle ? 'text-emerald-400' : 'text-zinc-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Keyword in H1 Title
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
