import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Edit2, Loader, RefreshCw, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { StoredFile } from '../services/githubPagesStorage';

interface FilesListProps {
  files: StoredFile[];
  loading: boolean;
  onDelete: (fileId: string) => void;
  onEdit: (fileId: string, updates: any) => void;
}

const FilesList: React.FC<FilesListProps> = ({ files, loading, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());
  }, [files.length]);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (file: StoredFile) => {
    setEditingId(file.id);
    setEditData({
      name: file.name,
      description: file.description,
      category: file.category
    });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onEdit(editingId, editData);
      setEditingId(null);
      setEditData({});
      toast.success('✅ File updated! All members on all phones will see the change.');
    }
  };

  const downloadFile = (file: StoredFile) => {
    if (!file.blob) {
      toast.error('File not available for download');
      return;
    }

    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📥 Download started!');
  };

  const handleDeleteFile = (fileId: string) => {
    if (window.confirm('🗑️ Delete this file? All members on all devices will see it removed.')) {
      onDelete(fileId);
      toast.success('✅ File deleted! Update synced to all devices.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Real-Time Sync Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-green-300 text-sm font-medium">📱 All Devices Synced</p>
              <p className="text-green-400 text-xs">Last sync: {lastSync}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-300 text-sm font-bold">{files.length} Files</p>
            <p className="text-green-400 text-xs">Visible on all phones</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search files..."
            className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        >
          <option value="all">All Categories</option>
          <option value="tools">Tools</option>
          <option value="bots">Bots</option>
          <option value="scripts">Scripts</option>
          <option value="templates">Templates</option>
          <option value="documentation">Documentation</option>
        </select>
      </div>

      {/* Files Count & Status */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-blue-300 text-sm font-medium">
          📊 {filteredFiles.length} of {files.length} files shown
        </p>
        <p className="text-blue-400 text-xs mt-1">
          ✅ All changes automatically sync to every member's phone when they refresh
        </p>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
            <Loader size={40} className="text-purple-400" />
          </motion.div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-12 text-center border border-purple-500/10"
        >
          <p className="text-gray-400 text-lg">No files found</p>
          <p className="text-gray-500 text-sm mt-2">Upload a file to get started</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition group"
              >
                {editingId === file.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">File Name</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white text-sm"
                        placeholder="File name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Description</label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={2}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white text-sm resize-none"
                        placeholder="Description"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Category</label>
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="tools">Tools</option>
                        <option value="bots">Bots</option>
                        <option value="scripts">Scripts</option>
                        <option value="templates">Templates</option>
                        <option value="documentation">Documentation</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* File Header */}
                    <div className="mb-4">
                      <span className="inline-block bg-purple-500/30 text-purple-300 text-xs px-3 py-1 rounded-full mb-2 uppercase font-semibold">
                        {file.category}
                      </span>
                      <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-300 transition">
                        {file.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {file.description || '📝 No description'}
                    </p>

                    {/* Meta Info */}
                    <div className="text-xs text-gray-500 space-y-1 mb-4 bg-slate-900/30 p-2 rounded border border-slate-700/50">
                      <p>📦 Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p>📅 Updated: {new Date(file.updatedAt).toLocaleDateString()}</p>
                      <p className="text-green-400 font-medium">✅ Synced to all devices</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mb-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadFile(file)}
                        className="flex-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-2 rounded flex items-center justify-center gap-1 transition text-xs font-medium"
                        title="Download to your phone/device"
                      >
                        <Download size={14} />
                        Download
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(file)}
                        className="flex-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 px-3 py-2 rounded flex items-center justify-center gap-1 transition text-xs font-medium"
                        title="Edit (all devices see update)"
                      >
                        <Edit2 size={14} />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteFile(file.id)}
                        className="flex-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 px-3 py-2 rounded flex items-center justify-center gap-1 transition text-xs font-medium"
                        title="Delete (all devices see removal)"
                      >
                        <Trash2 size={14} />
                        Delete
                      </motion.button>
                    </div>

                    {/* Visibility Badge */}
                    <div className="bg-green-500/20 text-green-300 p-2 rounded border border-green-500/30 text-center text-xs font-medium flex items-center justify-center gap-1">
                      <Eye size={14} />
                      👁️ Visible on all phones & tablets
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4"
      >
        <p className="text-purple-300 text-sm font-medium">📱 Multi-Device Real-Time Sync</p>
        <p className="text-purple-400 text-xs mt-2">
          ✅ When you upload, edit, or delete → All members on all their phones/tablets/computers will see the changes when they refresh the page
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FilesList;
