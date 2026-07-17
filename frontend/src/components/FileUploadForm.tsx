import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadFormProps {
  onUpload: (fileData: { file: File; name: string; description: string; category: string }) => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('tools');
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setName(selectedFile.name.split('.')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onUpload({
        file,
        name: name.trim(),
        description: description.trim(),
        category
      });

      setFile(null);
      setName('');
      setDescription('');
      setCategory('tools');
    } catch (error) {
      toast.error('Upload failed');
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
          {/* File Selection */}
          <div className="bg-slate-700/30 border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/60 transition cursor-pointer group">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              disabled={loading}
            />
            <label htmlFor="file-input" className="cursor-pointer block">
              <div className="mb-2">
                <Upload size={40} className="mx-auto text-purple-400 group-hover:text-purple-300 transition" />
              </div>
              <p className="text-white font-medium">
                {file ? file.name : 'Click to select file or drag and drop'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Maximum size: 5MB
              </p>
            </label>
          </div>

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
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description & README
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter file description, features, and usage instructions..."
              rows={4}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
              disabled={loading}
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
              disabled={loading}
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
            disabled={loading || !file || !name}
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

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 flex gap-3"
        >
          <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
          <p className="text-blue-300 text-sm">
            ✨ All members using the site will immediately see this file after upload. The file is stored in your browser's storage.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FileUploadForm;
