'use client';

import { useState, useEffect, useRef } from 'react';
import { Asset } from '@/lib/types/asset';
import {
  ShieldCheck, Plus, Trash2, Eye, EyeOff, Sparkles,
  BarChart2, FileUp, CheckCircle2, Pencil, X, Save,
  AlertTriangle, Image as ImageIcon, Video, Music, Link, RefreshCw, ExternalLink
} from 'lucide-react';

interface AdminDashboardClientProps {
  initialAssets: Asset[];
}

// Helper: extract YouTube video ID from URL or raw ID
function extractYoutubeId(val: string): string {
  if (!val) return '';
  const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : val.trim();
}

export default function AdminDashboardClient({ initialAssets }: AdminDashboardClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [selectedAssetStats, setSelectedAssetStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);

  // Create form state
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Game Optimizer');
  const [slug, setSlug] = useState<string>('');
  const [directUrl, setDirectUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [galleryItems, setGalleryItems] = useState<string[]>(['']);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string>('');

  // Edit modal state — full fields
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editSlug, setEditSlug] = useState<string>('');
  const [editDirectUrl, setEditDirectUrl] = useState<string>('');
  const [editImageUrl, setEditImageUrl] = useState<string>('');
  const [editGalleryItems, setEditGalleryItems] = useState<string[]>(['']);
  const [editVideoUrl, setEditVideoUrl] = useState<string>('');
  const [editAudioUrl, setEditAudioUrl] = useState<string>('');
  const [editYoutubeId, setEditYoutubeId] = useState<string>('');
  const [editInstructions, setEditInstructions] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'active' | 'hidden'>('active');
  const [editSaving, setEditSaving] = useState<boolean>(false);
  // Edit file uploads
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const [editAudioFile, setEditAudioFile] = useState<File | null>(null);
  const [editGalleryFiles, setEditGalleryFiles] = useState<File[]>([]);

  // Delete confirm state
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string>('');

  // Check session cookie on mount
  useEffect(() => {
    fetch('/api/admin/login')
      .then(r => r.json())
      .then(d => { if (d.authenticated) setIsAuthenticated(true); })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setSlug(autoSlug);
  };

  // Handle staff login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch {
      setAuthError('Server error authenticating');
    }
  };

  // Upload helper — server-side
  const uploadFile = async (f: File, slugPrefix: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', f);
    formData.append('slug', slugPrefix);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.success ? data.filePath : null;
  };

  // Gallery helpers
  const addGalleryItem = (setItems: React.Dispatch<React.SetStateAction<string[]>>) =>
    setItems(prev => [...prev, '']);
  const removeGalleryItem = (idx: number, setItems: React.Dispatch<React.SetStateAction<string[]>>) =>
    setItems(prev => prev.filter((_, i) => i !== idx));
  const updateGalleryItem = (idx: number, val: string, setItems: React.Dispatch<React.SetStateAction<string[]>>) =>
    setItems(prev => prev.map((v, i) => i === idx ? val : v));

  // Create asset
  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormSuccess('');

    if (!directUrl && !file) {
      alert('Please provide either a Direct Download Link or upload a File.');
      setSubmitting(false);
      return;
    }

    try {
      let uploadedFilePath: string | null = null;
      if (file) {
        const path = await uploadFile(file, slug);
        if (!path) throw new Error('File upload failed');
        uploadedFilePath = path;
      }

      let uploadedThumbnail = imageUrl;
      if (thumbnailFile) {
        uploadedThumbnail = await uploadFile(thumbnailFile, `${slug}-thumb`) || imageUrl;
      }

      // Gallery: merge URL items + uploaded files
      const galleryFromUrls = galleryItems.map(s => s.trim()).filter(Boolean);
      const galleryFromFiles: string[] = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        const path = await uploadFile(galleryFiles[i], `${slug}-gallery-${i}`);
        if (path) galleryFromFiles.push(path);
      }
      const finalGallery = [...galleryFromUrls, ...galleryFromFiles];

      let uploadedAudio = audioUrl;
      if (audioFile) {
        uploadedAudio = await uploadFile(audioFile, `${slug}-audio`) || audioUrl;
      }

      const ytId = extractYoutubeId(youtubeVideoId);

      const res = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category: category || 'Game Optimizer',
          slug,
          direct_download_url: directUrl || null,
          file_path: uploadedFilePath,
          image_url: uploadedThumbnail || null,
          gallery_images: finalGallery.length > 0 ? finalGallery : null,
          video_url: videoUrl || null,
          audio_url: uploadedAudio || null,
          youtube_video_id: ytId || null,
          instructions: instructions || null,
          status: 'active',
        }),
      });

      const data = await res.json();
      if (data.success && data.asset) {
        setAssets(prev => [data.asset, ...prev]);
        setFormSuccess(`✓ Published: ${data.asset.title} — live at /assets/${data.asset.slug}`);
        // Reset form
        setTitle(''); setSlug(''); setDirectUrl(''); setImageUrl('');
        setGalleryItems(['']); setVideoUrl(''); setAudioUrl('');
        setYoutubeVideoId(''); setInstructions('');
        setFile(null); setThumbnailFile(null); setGalleryFiles([]); setAudioFile(null);
      } else {
        alert('Failed to publish: ' + data.error);
      }
    } catch (err: any) {
      alert('Error creating asset: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active/hidden
  const handleToggleStatus = async (assetSlug: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'hidden' : 'active';
    try {
      const res = await fetch(`/api/admin/assets/${assetSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAssets(prev => prev.map(a => a.slug === assetSlug ? { ...a, status: nextStatus as any } : a));
      } else {
        alert('Failed to toggle: ' + data.error);
      }
    } catch (err) {
      alert('Network error toggling status');
    }
  };

  // Open edit modal — populate all fields
  const handleOpenEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setEditTitle(asset.title);
    setEditCategory(asset.category || 'Game Optimizer');
    setEditSlug(asset.slug);
    setEditDirectUrl(asset.direct_download_url || '');
    setEditImageUrl(asset.image_url || '');
    setEditGalleryItems(
      asset.gallery_images && asset.gallery_images.length > 0
        ? asset.gallery_images
        : ['']
    );
    setEditVideoUrl(asset.video_url || '');
    setEditAudioUrl(asset.audio_url || '');
    setEditYoutubeId(asset.youtube_video_id || '');
    setEditInstructions(asset.instructions || '');
    setEditStatus(asset.status as 'active' | 'hidden');
    setEditThumbnailFile(null);
    setEditAudioFile(null);
    setEditGalleryFiles([]);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingAsset) return;
    setEditSaving(true);
    try {
      // Handle uploads
      let finalImageUrl = editImageUrl;
      if (editThumbnailFile) {
        finalImageUrl = await uploadFile(editThumbnailFile, `${editSlug}-thumb`) || editImageUrl;
      }

      let finalAudioUrl = editAudioUrl;
      if (editAudioFile) {
        finalAudioUrl = await uploadFile(editAudioFile, `${editSlug}-audio`) || editAudioUrl;
      }

      const galleryFromUrls = editGalleryItems.map(s => s.trim()).filter(Boolean);
      const galleryFromFiles: string[] = [];
      for (let i = 0; i < editGalleryFiles.length; i++) {
        const path = await uploadFile(editGalleryFiles[i], `${editSlug}-gallery-${Date.now()}-${i}`);
        if (path) galleryFromFiles.push(path);
      }
      const finalGallery = [...galleryFromUrls, ...galleryFromFiles];

      const ytId = extractYoutubeId(editYoutubeId);

      const res = await fetch(`/api/admin/assets/${editingAsset.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
          direct_download_url: editDirectUrl || null,
          image_url: finalImageUrl || null,
          gallery_images: finalGallery.length > 0 ? finalGallery : null,
          video_url: editVideoUrl || null,
          audio_url: finalAudioUrl || null,
          youtube_video_id: ytId || null,
          instructions: editInstructions || null,
          status: editStatus,
        }),
      });
      const data = await res.json();
      if (data.success && data.asset) {
        setAssets(prev => prev.map(a => a.slug === editingAsset.slug ? { ...a, ...data.asset } : a));
        setEditingAsset(null);
      } else {
        alert('Failed to save: ' + data.error);
      }
    } catch (err: any) {
      alert('Error saving: ' + err.message);
    } finally {
      setEditSaving(false);
    }
  };

  // Delete asset
  const handleDelete = async () => {
    if (!deletingSlug) return;
    try {
      const res = await fetch(`/api/admin/assets/${deletingSlug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAssets(prev => prev.filter(a => a.slug !== deletingSlug));
        setDeletingSlug(null);
        setDeleteConfirmSlug('');
      } else {
        alert('Failed to delete: ' + data.error);
      }
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleViewAnalytics = async (assetSlug: string) => {
    setLoadingStats(true);
    setSelectedAssetStats(null);
    try {
      const res = await fetch(`/api/admin/analytics/${assetSlug}`);
      const data = await res.json();
      if (data.success) {
        setSelectedAssetStats({ slug: assetSlug, ...data.stats });
      }
    } catch (err) {
      console.error('Failed fetching analytics:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Checking session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center p-4">
        <div className="glass-card-cyber max-w-md w-full p-8 rounded-3xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Staff Portal Authentication</h2>
            <p className="text-xs text-slate-400">
              Enter your staff credentials to access asset &amp; ad network controls.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
                {authError}
              </div>
            )}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
            >
              Authenticate Staff Key
            </button>
            <p className="text-center text-[10px] text-slate-600">Session persists for 7 days</p>
          </form>
        </div>
      </div>
    );
  }

  // ── INPUT FIELD COMPONENTS ──────────────────────────────────────────────────
  const inputCls = "w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500";
  const labelCls = "block text-xs font-medium text-slate-400 mb-1";
  const fileCls = "w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer";

  // Gallery URL row component (inline)
  const GalleryRow = ({
    items, setItems, files, setFiles, slugBase
  }: {
    items: string[], setItems: React.Dispatch<React.SetStateAction<string[]>>,
    files: File[], setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    slugBase: string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Gallery Images (URLs or Uploads)</label>
        <button
          type="button"
          onClick={() => addGalleryItem(setItems)}
          className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add URL
        </button>
      </div>
      {items.map((url, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={`Gallery image ${idx + 1} URL`}
            value={url}
            onChange={e => updateGalleryItem(idx, e.target.value, setItems)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
          {url && <img src={url} alt="" className="w-8 h-8 rounded object-cover border border-slate-700 shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
          {items.length > 1 && (
            <button type="button" onClick={() => removeGalleryItem(idx, setItems)} className="text-red-400 hover:text-red-300 shrink-0">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {/* Upload multiple files */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Or upload image files:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          className={fileCls}
        />
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {files.map((f, i) => (
              <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{f.name}</span>
            ))}
          </div>
        )}
      </div>
      {/* Preview existing gallery URLs */}
      {items.filter(Boolean).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {items.filter(Boolean).map((url, i) => (
            <img key={i} src={url} alt={`gallery-${i}`} className="w-14 h-10 object-cover rounded border border-slate-700" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Protected Staff Control</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">Asset Management Engine</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              Authenticated Admin
            </span>
            <button
              onClick={() => { document.cookie = 'admin_session=; Max-Age=0; path=/'; setIsAuthenticated(false); }}
              className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Create New Asset Form */}
          <div className="glass-card-cyber p-6 md:p-8 rounded-3xl space-y-5 lg:col-span-1">
            <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-3">
              <Plus className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-100">Publish New Asset</h3>
            </div>

            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateAsset} className="space-y-4">
              {/* Title */}
              <div>
                <label className={labelCls}>Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FF Ultimate FPS Boost Config v2"
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Slug */}
              <div>
                <label className={labelCls}>URL Slug (auto-generated)</label>
                <input
                  type="text"
                  required
                  placeholder="ff-config-v2"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  URL: free.brokencheats.store/assets/{slug || '...'}
                </span>
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className={inputCls}
                >
                  <option value="Game Optimizer">Game Optimizer</option>
                  <option value="Network Utility">Network Utility</option>
                  <option value="Latency Patch">Latency Patch</option>
                  <option value="Windows Tweak">Windows Tweak</option>
                </select>
              </div>

              {/* Download File */}
              <div>
                <label className={labelCls}>Upload Download File</label>
                <input
                  type="file"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className={fileCls}
                />
                {file && <span className="text-[10px] text-emerald-400 mt-1 block">✓ {file.name}</span>}
              </div>

              {/* Direct URL */}
              <div>
                <label className={labelCls}>— OR — Direct Download Link</label>
                <input
                  type="url"
                  placeholder="https://mediafire.com/download/file.zip"
                  value={directUrl}
                  onChange={e => setDirectUrl(e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className={labelCls}>Thumbnail Image</label>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                      className={fileCls}
                    />
                    <input
                      type="url"
                      placeholder="Or paste image URL"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  {(imageUrl || thumbnailFile) && (
                    <div className="w-16 h-16 rounded-xl border border-slate-700 overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center">
                      {thumbnailFile ? (
                        <img src={URL.createObjectURL(thumbnailFile)} alt="thumb preview" className="w-full h-full object-cover" />
                      ) : (
                        <img src={imageUrl} alt="thumb preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <GalleryRow
                items={galleryItems}
                setItems={setGalleryItems}
                files={galleryFiles}
                setFiles={setGalleryFiles}
                slugBase={slug}
              />

              {/* YouTube Video */}
              <div>
                <label className={labelCls}>YouTube Video (URL or ID)</label>
                <input
                  type="text"
                  placeholder="https://youtu.be/dQw4w9WgXcQ or video ID"
                  value={youtubeVideoId}
                  onChange={e => setYoutubeVideoId(e.target.value)}
                  className={inputCls}
                />
                {youtubeVideoId && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(youtubeVideoId)}`}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* Video URL (MP4 / external) */}
              <div>
                <label className={labelCls}>Video Demo URL (MP4 / external — optional)</label>
                <input
                  type="url"
                  placeholder="https://cdn.example.com/demo.mp4"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Audio */}
              <div>
                <label className={labelCls}>Audio Sound Test Preview</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={e => setAudioFile(e.target.files?.[0] || null)}
                  className={fileCls}
                />
                <input
                  type="url"
                  placeholder="Or paste MP3/WAV URL"
                  value={audioUrl}
                  onChange={e => setAudioUrl(e.target.value)}
                  className={`${inputCls} mt-1.5`}
                />
                {audioFile && <audio controls src={URL.createObjectURL(audioFile)} className="w-full mt-2 rounded-xl" />}
                {audioUrl && !audioFile && <audio controls src={audioUrl} className="w-full mt-2 rounded-xl" />}
              </div>

              {/* Instructions */}
              <div>
                <label className={labelCls}>How To Use / Install Instructions</label>
                <textarea
                  rows={4}
                  placeholder={"Step 1: Download & extract ZIP...\nStep 2: Run as Administrator..."}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {submitting ? 'Publishing & Uploading...' : 'Publish Asset To Live Store'}
              </button>
            </form>
          </div>

          {/* Asset List & Metrics */}
          <div className="space-y-6 lg:col-span-2">
            <div className="glass-card-cyber p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-100">Live Assets &amp; Metrics</h3>
                <span className="text-xs font-mono text-slate-400">Total: {assets.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-blue-300 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Thumbnail</th>
                      <th className="p-3">Title &amp; Slug</th>
                      <th className="p-3">DLs</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {assets.map(asset => (
                      <tr key={asset.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3">
                          <div className="w-12 h-10 rounded-lg border border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center">
                            {asset.image_url ? (
                              <img src={asset.image_url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-100 max-w-[180px] truncate">{asset.title}</div>
                          <div className="font-mono text-[10px] text-blue-400">/{asset.slug}</div>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {asset.youtube_video_id && <span className="text-[9px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">YT</span>}
                            {asset.gallery_images?.length && <span className="text-[9px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">{asset.gallery_images.length} imgs</span>}
                            {asset.audio_url && <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Audio</span>}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-blue-400">
                          {asset.download_count.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            asset.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/assets/${asset.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                              title="Preview Live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleToggleStatus(asset.slug, asset.status)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                              title={asset.status === 'active' ? 'Hide Asset' : 'Activate Asset'}
                            >
                              {asset.status === 'active'
                                ? <Eye className="w-4 h-4 text-emerald-400" />
                                : <EyeOff className="w-4 h-4 text-red-400" />}
                            </button>
                            <button
                              onClick={() => handleOpenEdit(asset)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
                              title="Edit Asset"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewAnalytics(asset.slug)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
                              title="View Analytics"
                            >
                              <BarChart2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setDeletingSlug(asset.slug); setDeleteConfirmSlug(''); }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/50 text-red-400 transition-colors"
                              title="Delete Asset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {assets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                          No assets yet. Publish one using the form on the left.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analytics Modal */}
            {(loadingStats || selectedAssetStats) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="glass-card-cyber max-w-lg w-full p-6 rounded-3xl space-y-6 relative">
                  <button
                    onClick={() => { setLoadingStats(false); setSelectedAssetStats(null); }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-blue-400" />
                    Analytics: /{selectedAssetStats?.slug || 'Loading...'}
                  </h3>

                  {loadingStats ? (
                    <div className="text-center text-slate-400 py-10">Loading analytics data...</div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center">
                          <div className="text-2xl font-black text-blue-400">{selectedAssetStats.views.toLocaleString()}</div>
                          <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Total Views</div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center">
                          <div className="text-2xl font-black text-emerald-400">{selectedAssetStats.downloads.toLocaleString()}</div>
                          <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Total Downloads</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-300">Views by Country</h4>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl max-h-48 overflow-y-auto">
                          {Object.keys(selectedAssetStats.countries).length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-500">No country data yet.</div>
                          ) : (
                            <ul className="divide-y divide-slate-800">
                              {Object.entries(selectedAssetStats.countries)
                                .sort((a: any, b: any) => b[1] - a[1])
                                .map(([country, count]: any) => (
                                  <li key={country} className="p-3 flex justify-between items-center text-xs">
                                    <span className="text-slate-300 font-medium">{country}</span>
                                    <span className="text-blue-400 font-bold">{count} views</span>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ FULL EDIT MODAL ═══════════════ */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card-cyber w-full max-w-2xl p-6 rounded-3xl space-y-5 relative my-8">
            <button
              onClick={() => setEditingAsset(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-3">
              <Pencil className="w-4 h-4" />
              <h3 className="text-lg font-bold text-slate-100">Edit Asset</h3>
              <span className="font-mono text-[10px] text-blue-400 ml-1">/{editingAsset.slug}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Title</label>
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className={inputCls} />
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className={inputCls}>
                  <option value="Game Optimizer">Game Optimizer</option>
                  <option value="Network Utility">Network Utility</option>
                  <option value="Latency Patch">Latency Patch</option>
                  <option value="Windows Tweak">Windows Tweak</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className={labelCls}>Visibility Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value as 'active' | 'hidden')} className={inputCls}>
                  <option value="active">Active (visible on store)</option>
                  <option value="hidden">Hidden (invisible to users)</option>
                </select>
              </div>

              {/* Direct Download URL */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Direct Download URL</label>
                <input type="url" value={editDirectUrl} onChange={e => setEditDirectUrl(e.target.value)} placeholder="https://example.com/file.zip" className={inputCls} />
              </div>

              {/* Thumbnail */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Thumbnail Image</label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setEditThumbnailFile(e.target.files?.[0] || null)}
                      className={fileCls}
                    />
                    <input
                      type="url"
                      placeholder="Or paste image URL"
                      value={editImageUrl}
                      onChange={e => setEditImageUrl(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div className="w-20 h-16 rounded-xl border border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center shrink-0">
                    {editThumbnailFile ? (
                      <img src={URL.createObjectURL(editThumbnailFile)} alt="" className="w-full h-full object-cover" />
                    ) : editImageUrl ? (
                      <img src={editImageUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="sm:col-span-2">
                <GalleryRow
                  items={editGalleryItems}
                  setItems={setEditGalleryItems}
                  files={editGalleryFiles}
                  setFiles={setEditGalleryFiles}
                  slugBase={editSlug}
                />
              </div>

              {/* YouTube */}
              <div className="sm:col-span-2">
                <label className={labelCls}>YouTube Video (URL or ID)</label>
                <input
                  type="text"
                  placeholder="https://youtu.be/... or video ID"
                  value={editYoutubeId}
                  onChange={e => setEditYoutubeId(e.target.value)}
                  className={inputCls}
                />
                {editYoutubeId && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(editYoutubeId)}`}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className={labelCls}>Video Demo URL (MP4)</label>
                <input type="url" placeholder="https://cdn.example.com/demo.mp4" value={editVideoUrl} onChange={e => setEditVideoUrl(e.target.value)} className={inputCls} />
              </div>

              {/* Audio */}
              <div>
                <label className={labelCls}>Audio Sound Preview</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={e => setEditAudioFile(e.target.files?.[0] || null)}
                  className={fileCls}
                />
                <input
                  type="url"
                  placeholder="Or paste MP3 URL"
                  value={editAudioUrl}
                  onChange={e => setEditAudioUrl(e.target.value)}
                  className={`${inputCls} mt-1.5`}
                />
                {(editAudioFile || editAudioUrl) && (
                  <audio
                    controls
                    src={editAudioFile ? URL.createObjectURL(editAudioFile) : editAudioUrl}
                    className="w-full mt-2 rounded-xl"
                  />
                )}
              </div>

              {/* Instructions */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Installation Instructions</label>
                <textarea
                  rows={4}
                  value={editInstructions}
                  onChange={e => setEditInstructions(e.target.value)}
                  placeholder={"Step 1: Download & extract ZIP...\nStep 2: Run as Administrator..."}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingAsset(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                {editSaving ? 'Saving & Uploading...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card-cyber max-w-sm w-full p-6 rounded-3xl space-y-5 relative">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-slate-100">Delete Asset</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will permanently delete <span className="font-mono text-red-400">/{deletingSlug}</span> and any associated storage file. This action <span className="font-bold text-red-400">cannot be undone</span>.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Type the slug to confirm: <span className="font-mono text-red-400">{deletingSlug}</span>
              </label>
              <input
                type="text"
                value={deleteConfirmSlug}
                onChange={e => setDeleteConfirmSlug(e.target.value)}
                placeholder={deletingSlug}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-red-500/40 text-xs text-red-300 font-mono focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setDeletingSlug(null); setDeleteConfirmSlug(''); }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmSlug !== deletingSlug}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
