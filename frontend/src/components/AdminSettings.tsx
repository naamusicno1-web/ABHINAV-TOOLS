import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { githubPagesStorage } from '../services/githubPagesStorage';

interface AdminSettingsProps {
  onUpdate: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onUpdate }) => {
  const [settings, setSettings] = useState(githubPagesStorage.getSettings());
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('settingsLastSaved');
    if (saved) setLastSaved(saved);
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      githubPagesStorage.updateSettings(settings);
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);
      localStorage.setItem('settingsLastSaved', now);
      toast.success('✅ Settings saved! All members on all devices will see the updates.');
      onUpdate();
      setSaving(false);
    }, 500);
  };

  const storageInfo = githubPagesStorage.getStorageInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Storage Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="text-emerald-400" size={20} />
          <div className="text-sm">
            <p className="text-emerald-300 font-medium">📱 Multi-Device Sync Active</p>
            <p className="text-emerald-400 text-xs mt-1">
              All changes are stored and synced to every phone/device using this site
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Settings Card */}
      <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Settings</h2>

        <div className="space-y-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🌐 Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              placeholder="ABHINAV TOOLS AND BOTS"
            />
            <p className="text-gray-400 text-sm mt-1">Shown in browser tab and header on all devices</p>
          </div>

          {/* Instagram Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📸 Instagram Link
            </label>
            <input
              type="url"
              value={settings.instagram}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              placeholder="https://instagram.com/yourusername"
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            <p className="text-gray-400 text-sm mt-1">All members on all phones will see this link</p>
          </div>

          {/* Discord Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              💬 Discord Link
            </label>
            <input
              type="url"
              value={settings.discord}
              onChange={(e) => setSettings({ ...settings, discord: e.target.value })}
              placeholder="https://discord.gg/yourserver"
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            <p className="text-gray-400 text-sm mt-1">All members on all phones will see this link</p>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader size={20} className="animate-spin" />
                Saving & Syncing...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Settings (Sync to All Devices)
              </>
            )}
          </motion.button>
        </div>

        {/* Info Boxes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 space-y-3"
        >
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 flex gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
            <div>
              <p className="text-blue-300 text-sm font-medium">✅ Changes Sync Everywhere</p>
              <p className="text-blue-400 text-xs mt-1">
                When you update settings, all members on all their phones/tablets will see the changes
              </p>
            </div>
          </div>

          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 flex gap-3">
            <RefreshCw className="text-purple-400 flex-shrink-0" size={20} />
            <div>
              <p className="text-purple-300 text-sm font-medium">📱 Real-Time Updates</p>
              <p className="text-purple-400 text-xs mt-1">
                Data updates appear on all devices automatically when members refresh
              </p>
            </div>
          </div>

          {lastSaved && (
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
              <p className="text-green-300 text-xs">
                ✅ Last saved: {lastSaved}
              </p>
            </div>
          )}
        </motion.div>

        {/* Storage Info */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/20">
          <p className="text-gray-400 text-xs">
            💾 Storage: {storageInfo.totalSizeKB}KB / {storageInfo.maxSizeMB}MB
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
