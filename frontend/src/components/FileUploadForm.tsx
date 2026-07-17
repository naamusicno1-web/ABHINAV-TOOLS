import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Github, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadFormProps {
  onUpload: (formData: FormData) => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('tools');
  const [loading, setLoading] = useState(false);
  const [useGithub, setUseGithub] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setName(e.target.files[0].name.split('.')[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file && !useGithub) {
      toast.error('Please select a file or GitHub URL');
      return;
    }

    setLoading(true);
    try {
      if (useGithub) {
        // Handle GitHub upload
        const response = await fetch('/api/files/upload-from-repo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify({
            githubUrl,
            name: name || 'GitHub File',
            description,
            category
          })
        });

        if (!response.ok) throw new Error('Upload failed');
        toast.success('File from GitHub uploaded! All members will see it.');
      } else {
        // Handle file upload
        const formData = new FormData();
        formData.append('file', file!);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        
        onUpload(formData);
      }

      setFile(null);
      setName('');
      setDescription('');
      setCategory('tools');
      setGithubUrl('');
      setUseGithub(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Upload size={28} className="text-purple-400" />
          Upload New File
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Toggle Upload Method */}
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!useGithub}
                onChange={() => setUseGithub(false)}
                className="w-4 h-4"
              />
              <span className="text-white">Direct Upload</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={useGithub}
                onChange={() => setUseGithub(true)}
                className="w-4 h-4"
              />
              <span className="text-white">From GitHub</span>
            </label>
          </div>

          {/* File Selection */}
          {!useGithub ? (
            <div className="bg-slate-700/30 border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/60 transition cursor-pointer group">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <div className="mb-2">
                  <Upload size={40} className="mx-auto text-purple-400 group-hover:text-purple-300 transition" />
                </div>
                <p className="text-white font-medium">
                  {file ? file.name : 'Click to select file or drag and drop'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Support: PDF, ZIP, Images, Documents
                </p>
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          )}

          {/* File Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter file name"
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter file description (README content)"
              rows={4}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="tools">Tools</option>
              <option value="bots">Bots</option>
              <option value="scripts">Scripts</option>
              <option value="templates">Templates</option>
              <option value="documentation">Documentation</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || (!file && !githubUrl)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload (Visible to All Members)
              </>
            )}
          </motion.button>
        </form>

        <p className="text-gray-400 text-sm mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          ✨ All members using the site will immediately see this file after upload
        </p>
      </div>
    </motion.div>
  );
};

export default FileUploadForm;
