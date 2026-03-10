import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import type { GalleryItem, ResourceAlert, ResourceVideo, ResourceLink } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AdminStats {
  total_users: number;
  gallery_items: number;
  resource_alerts: number;
  resource_videos: number;
  resource_links: number;
}

interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  provider: string;
  created_at: string;
}

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
    <div className={`h-1 w-full ${color} mb-4`}></div>
    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <p className={`text-3xl font-black ${color.replace('bg-', 'text-')}`}>{value}</p>
  </div>
);

type Tab = 'overview' | 'gallery' | 'alerts' | 'videos' | 'links' | 'users';

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [alerts, setAlerts] = useState<ResourceAlert[]>([]);
  const [videos, setVideos] = useState<ResourceVideo[]>([]);
  const [links, setLinks] = useState<ResourceLink[]>([]);

  // Form states
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'general', frame_type: 'A' });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [alertForm, setAlertForm] = useState({ title: '', tag: 'ALERT', date_text: '' });
  const [videoForm, setVideoForm] = useState({ title: '', duration: '', label: 'VIDEO' });
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [linkForm, setLinkForm] = useState({ name: '', url: '', category: 'official' });
  const [uploading, setUploading] = useState(false);

  const token = authService.getToken();
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const uploadFile = async (file: File, type: 'image' | 'video'): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_URL}/api/v1/upload/${type}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return `${API_URL}${data.url}`;
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (tab === 'gallery') loadGallery();
    if (tab === 'alerts') loadAlerts();
    if (tab === 'videos') loadVideos();
    if (tab === 'links') loadLinks();
    if (tab === 'users') loadUsers();
  }, [tab]);

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/stats`, { headers });
      if (res.ok) setStats(await res.json());
    } catch (e) { console.error(e); }
  };

  const loadGallery = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/gallery/`);
      if (res.ok) setGalleryItems(await res.json());
    } catch (e) { console.error(e); }
  };

  const loadAlerts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/resources/alerts`);
      if (res.ok) setAlerts(await res.json());
    } catch (e) { console.error(e); }
  };

  const loadVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/resources/videos`);
      if (res.ok) setVideos(await res.json());
    } catch (e) { console.error(e); }
  };

  const loadLinks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/resources/links`);
      if (res.ok) setLinks(await res.json());
    } catch (e) { console.error(e); }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/users`, { headers });
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error(e); }
  };

  // CRUD helpers
  const addGallery = async () => {
    if (!galleryForm.title || !galleryFile) return;
    setUploading(true);
    try {
      const image_url = await uploadFile(galleryFile, 'image');
      const res = await fetch(`${API_URL}/api/v1/gallery/`, {
        method: 'POST', headers, body: JSON.stringify({ ...galleryForm, image_url }),
      });
      if (res.ok) {
        setGalleryForm({ title: '', category: 'general', frame_type: 'A' });
        setGalleryFile(null);
        loadGallery(); loadStats();
      }
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const deleteGallery = async (id: number) => {
    await fetch(`${API_URL}/api/v1/gallery/${id}`, { method: 'DELETE', headers });
    loadGallery(); loadStats();
  };

  const addAlert = async () => {
    if (!alertForm.title) return;
    const res = await fetch(`${API_URL}/api/v1/resources/alerts`, { method: 'POST', headers, body: JSON.stringify(alertForm) });
    if (res.ok) { setAlertForm({ title: '', tag: 'ALERT', date_text: '' }); loadAlerts(); loadStats(); }
  };

  const deleteAlert = async (id: number) => {
    await fetch(`${API_URL}/api/v1/resources/alerts/${id}`, { method: 'DELETE', headers });
    loadAlerts(); loadStats();
  };

  const addVideo = async () => {
    if (!videoForm.title) return;
    setUploading(true);
    try {
      let thumbnail_url = '';
      let video_url = '';
      if (videoThumbnailFile) thumbnail_url = await uploadFile(videoThumbnailFile, 'image');
      if (videoFile) video_url = await uploadFile(videoFile, 'video');
      const res = await fetch(`${API_URL}/api/v1/resources/videos`, {
        method: 'POST', headers, body: JSON.stringify({ ...videoForm, thumbnail_url, video_url }),
      });
      if (res.ok) {
        setVideoForm({ title: '', duration: '', label: 'VIDEO' });
        setVideoThumbnailFile(null);
        setVideoFile(null);
        loadVideos(); loadStats();
      }
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const deleteVideo = async (id: number) => {
    await fetch(`${API_URL}/api/v1/resources/videos/${id}`, { method: 'DELETE', headers });
    loadVideos(); loadStats();
  };

  const addLink = async () => {
    if (!linkForm.name || !linkForm.url) return;
    const res = await fetch(`${API_URL}/api/v1/resources/links`, { method: 'POST', headers, body: JSON.stringify(linkForm) });
    if (res.ok) { setLinkForm({ name: '', url: '', category: 'official' }); loadLinks(); loadStats(); }
  };

  const deleteLink = async (id: number) => {
    await fetch(`${API_URL}/api/v1/resources/links/${id}`, { method: 'DELETE', headers });
    loadLinks(); loadStats();
  };

  const inputCls = "w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none";
  const btnCls = "px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold uppercase tracking-wider transition-colors";
  const delBtn = "px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-mono transition-colors";

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'alerts', label: 'Alerts' },
    { key: 'videos', label: 'Videos' },
    { key: 'links', label: 'Links' },
    { key: 'users', label: 'Users' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050A14] pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-3 h-10 bg-cyan-500"></div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Admin Control Panel</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">CyberGuardian AI &mdash; Content Management</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap
                ${tab === t.key
                  ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard label="Total Users" value={stats.total_users} color="bg-cyan-500" />
            <StatCard label="Gallery Images" value={stats.gallery_items} color="bg-purple-500" />
            <StatCard label="Scam Alerts" value={stats.resource_alerts} color="bg-red-500" />
            <StatCard label="Videos" value={stats.resource_videos} color="bg-amber-500" />
            <StatCard label="Links" value={stats.resource_links} color="bg-emerald-500" />
          </div>
        )}

        {/* Gallery Tab */}
        {tab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Add Gallery Image</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Title" value={galleryForm.title} onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })} />
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Choose Image</label>
                  <input type="file" accept="image/*" title="Select gallery image" className={inputCls}
                    onChange={e => setGalleryFile(e.target.files?.[0] || null)} />
                  {galleryFile && <span className="text-xs text-cyan-400 mt-1 block">{galleryFile.name}</span>}
                </div>
                <select className={inputCls} value={galleryForm.frame_type} onChange={e => setGalleryForm({ ...galleryForm, frame_type: e.target.value })}>
                  <option value="A">Frame A (Cyan Brackets)</option>
                  <option value="B">Frame B (Gradient)</option>
                  <option value="C">Frame C (Purple Mecha)</option>
                  <option value="D">Frame D (Blue Diagonal)</option>
                </select>
                <input className={inputCls} placeholder="Category" value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })} />
              </div>
              <button className={btnCls} onClick={addGallery} disabled={uploading}>
                {uploading ? 'Uploading...' : '+ Add Image'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map(item => (
                <div key={item.id} className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">{item.title}</span>
                    <button className={delBtn} onClick={() => deleteGallery(item.id)}>DEL</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {tab === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Add Scam Alert</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className={inputCls} placeholder="Alert title" value={alertForm.title} onChange={e => setAlertForm({ ...alertForm, title: e.target.value })} />
                <input className={inputCls} placeholder="Tag (e.g. PHISHING)" value={alertForm.tag} onChange={e => setAlertForm({ ...alertForm, tag: e.target.value })} />
                <input className={inputCls} placeholder="Date text (e.g. Dec 2024)" value={alertForm.date_text} onChange={e => setAlertForm({ ...alertForm, date_text: e.target.value })} />
              </div>
              <button className={btnCls} onClick={addAlert}>+ Add Alert</button>
            </div>
            <div className="space-y-2">
              {alerts.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5">{a.tag}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{a.title}</span>
                    <span className="text-xs text-slate-400">{a.date_text}</span>
                  </div>
                  <button className={delBtn} onClick={() => deleteAlert(a.id)}>DEL</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {tab === 'videos' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Add Video</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Video title" value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} />
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Thumbnail Image</label>
                  <input type="file" accept="image/*" title="Select thumbnail image" className={inputCls}
                    onChange={e => setVideoThumbnailFile(e.target.files?.[0] || null)} />
                  {videoThumbnailFile && <span className="text-xs text-cyan-400 mt-1 block">{videoThumbnailFile.name}</span>}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Video File</label>
                  <input type="file" accept="video/*" title="Select video file" className={inputCls}
                    onChange={e => setVideoFile(e.target.files?.[0] || null)} />
                  {videoFile && <span className="text-xs text-cyan-400 mt-1 block">{videoFile.name}</span>}
                </div>
                <input className={inputCls} placeholder="Duration (e.g. 12:05)" value={videoForm.duration} onChange={e => setVideoForm({ ...videoForm, duration: e.target.value })} />
                <input className={inputCls} placeholder="Label (e.g. TUTORIAL)" value={videoForm.label} onChange={e => setVideoForm({ ...videoForm, label: e.target.value })} />
              </div>
              <button className={btnCls} onClick={addVideo} disabled={uploading}>
                {uploading ? 'Uploading...' : '+ Add Video'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map(v => (
                <div key={v.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {v.thumbnail_url && <img src={v.thumbnail_url} alt={v.title} className="w-full h-36 object-cover" />}
                  <div className="p-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">{v.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">{v.duration} &middot; {v.label}</span>
                      <button className={delBtn} onClick={() => deleteVideo(v.id)}>DEL</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links Tab */}
        {tab === 'links' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Add Resource Link</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className={inputCls} placeholder="Name" value={linkForm.name} onChange={e => setLinkForm({ ...linkForm, name: e.target.value })} />
                <input className={inputCls} placeholder="URL" value={linkForm.url} onChange={e => setLinkForm({ ...linkForm, url: e.target.value })} />
                <input className={inputCls} placeholder="Category (e.g. official)" value={linkForm.category} onChange={e => setLinkForm({ ...linkForm, category: e.target.value })} />
              </div>
              <button className={btnCls} onClick={addLink}>+ Add Link</button>
            </div>
            <div className="space-y-2">
              {links.map(l => (
                <div key={l.id} className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-cyan-500 font-mono">{l.category}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{l.name}</span>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline truncate max-w-xs">{l.url}</a>
                  </div>
                  <button className={delBtn} onClick={() => deleteLink(l.id)}>DEL</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400">ID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400">Email</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400">Name</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400">Role</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400">Provider</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400">Verified</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-slate-500">{u.id}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.first_name} {u.last_name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 ${u.role === 'admin' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        {u.role?.toUpperCase() || 'USER'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{u.provider}</td>
                    <td className="px-4 py-3">{u.email_verified ? '✓' : '✗'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
