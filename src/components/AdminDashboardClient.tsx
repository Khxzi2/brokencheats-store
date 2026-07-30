'use client';

import { useState } from 'react';
import { Asset } from '@/lib/types/asset';
import {
  ShieldCheck, Plus, Trash2, Eye, EyeOff, Sparkles,
  BarChart2, FileUp, CheckCircle2, Pencil, X, Save,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardClientProps {
  initialAssets: Asset[];
}

export default function AdminDashboardClient({ initialAssets }: AdminDashboardClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
  const [galleryUrls, setGalleryUrls] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string>('');

  // Edit modal state
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDirectUrl, setEditDirectUrl] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'active' | 'hidden'>('active');
  const [editSaving, setEditSaving] = useState<boolean>(false);

  // Delete confirm state
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string>('');

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

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setSlug(autoSlug);
  };

  // Create asset — uses server-side upload + admin API
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
        // Use server-side upload route (service role) instead of client-side
        const formData = new FormData();
        formData.append('file', file);
        formData.append('slug', slug);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          throw new Error('File upload failed: ' + uploadData.error);
        }
        uploadedFilePath = uploadData.filePath;
      }

      const parsedGallery = galleryUrls
        ? galleryUrls.split(',').map(s => s.trim()).filter(Boolean)
        : null;

      const res = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category: category || 'Game Optimizer',
          slug,
          direct_download_url: directUrl || null,
          file_path: uploadedFilePath,
          image_url: imageUrl || null,
          gallery_images: parsedGallery,
          video_url: videoUrl || null,
          audio_url: audioUrl || null,
          youtube_video_id: youtubeVideoId || null,
          instructions: instructions || null,
          status: 'active',
        }),
      });

      const data = await res.json();
      if (data.success && data.asset) {
        setAssets([data.asset, ...assets]);
        setFormSuccess(`Successfully published: ${data.asset.title}`);
        setTitle('');
        setSlug('');
        setDirectUrl('');
        setImageUrl('');
        setGalleryUrls('');
        setVideoUrl('');
        setAudioUrl('');
        setYoutubeVideoId('');
        setInstructions('');
        setFile(null);
      } else {
        alert('Failed to publish: ' + data.error);
      }
    } catch (err: any) {
      alert('Error creating asset: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active/hidden — now uses admin PATCH API
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
        setAssets(assets.map(a => a.slug === assetSlug ? { ...a, status: nextStatus as any } : a));
      } else {
        alert('Failed to toggle: ' + data.error);
      }
    } catch (err) {
      console.error('Failed toggling status:', err);
      alert('Network error toggling status');
    }
  };

  // Open edit modal
  const handleOpenEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setEditTitle(asset.title);
    setEditDirectUrl(asset.direct_download_url || '');
    setEditStatus(asset.status);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingAsset) return;
    setEditSaving(true);
    try {
      const res = await fetch(`/api/admin/assets/${editingAsset.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          direct_download_url: editDirectUrl || null,
          status: editStatus,
        }),
      });
      const data = await res.json();
      if (data.success && data.asset) {
        setAssets(assets.map(a => a.slug === editingAsset.slug ? data.asset : a));
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

  // Delete asset — uses admin DELETE API
  const handleDelete = async () => {
    if (!deletingSlug) return;
    try {
      const res = await fetch(`/api/admin/assets/${deletingSlug}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setAssets(assets.filter(a => a.slug !== deletingSlug));
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
          </form>
        </div>
      </div>
    );
  }

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
          </div>
        </div>

        {/* Dashboard Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Create New Asset Form */}
          <div className="glass-card-cyber p-6 md:p-8 rounded-3xl space-y-6 lg:col-span-1">
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
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FF Ultimate FPS Boost Config v2"
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Auto-Generated URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="ff-config-v2"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Path: /download/{slug || '...'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Upload File (Optional if Link provided)</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 transition-colors"
                  />
                  {file && <FileUp className="absolute right-3 top-2.5 w-4 h-4 text-blue-400" />}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Asset Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Game Optimizer">Game Optimizer</option>
                  <option value="Network Utility">Network Utility</option>
                  <option value="Latency Patch">Latency Patch</option>
                  <option value="Windows Tweak">Windows Tweak</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Direct Download Link (Optional if File uploaded)</label>
                <input
                  type="url"
                  placeholder="https://mediafire.com/download/file.zip"
                  value={directUrl}
                  onChange={e => setDirectUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Thumbnail Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or /uploads/thumb.png"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Additional Gallery Image URLs (Comma-Separated)</label>
                <input
                  type="text"
                  placeholder="https://img1.png, https://img2.jpg"
                  value={galleryUrls}
                  onChange={e => setGalleryUrls(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Video Demo Link (YouTube or MP4 URL)</label>
                <input
                  type="text"
                  placeholder="https://youtu.be/... or https://domain.com/demo.mp4"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Audio Sound Test Preview URL (MP3/WAV)</label>
                <input
                  type="url"
                  placeholder="https://domain.com/sound-test.mp3"
                  value={audioUrl}
                  onChange={e => setAudioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">YouTube Video Link / ID (Optional Tutorial)</label>
                <input
                  type="text"
                  placeholder="e.g. dQw4w9WgXcQ or https://youtu.be/..."
                  value={youtubeVideoId}
                  onChange={e => setYoutubeVideoId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">How To Use / Installation Instructions (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Step 1: Download & extract ZIP...&#10;Step 2: Run as Administrator..."
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
                {submitting ? 'Publishing...' : 'Publish Asset To Live Store'}
              </button>
            </form>
          </div>

          {/* Asset List & Metrics Table */}
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
                      <th className="p-3">Title &amp; Slug</th>
                      <th className="p-3">Downloads</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {assets.map(asset => (
                      <tr key={asset.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-100">{asset.title}</div>
                          <div className="font-mono text-[10px] text-blue-400">/{asset.slug}</div>
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
                            {/* Toggle status */}
                            <button
                              onClick={() => handleToggleStatus(asset.slug, asset.status)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                              title={asset.status === 'active' ? 'Hide Asset' : 'Activate Asset'}
                            >
                              {asset.status === 'active'
                                ? <Eye className="w-4 h-4 text-emerald-400" />
                                : <EyeOff className="w-4 h-4 text-red-400" />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(asset)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
                              title="Edit Asset"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Analytics */}
                            <button
                              onClick={() => handleViewAnalytics(asset.slug)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
                              title="View Analytics"
                            >
                              <BarChart2 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
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
                        <td colSpan={4} className="p-8 text-center text-slate-500 text-xs">
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

      {/* Edit Asset Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card-cyber max-w-md w-full p-6 rounded-3xl space-y-5 relative">
            <button
              onClick={() => setEditingAsset(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-blue-400">
              <Pencil className="w-4 h-4" />
              <h3 className="text-lg font-bold text-slate-100">Edit Asset</h3>
            </div>
            <div className="font-mono text-[10px] text-blue-400 -mt-2">/{editingAsset.slug}</div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Direct Download URL</label>
                <input
                  type="url"
                  value={editDirectUrl}
                  onChange={e => setEditDirectUrl(e.target.value)}
                  placeholder="https://example.com/file.zip"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as 'active' | 'hidden')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="active">Active (visible on store)</option>
                  <option value="hidden">Hidden (invisible to users)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingAsset(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                {editSaving ? 'Saving...' : 'Save Changes'}
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
