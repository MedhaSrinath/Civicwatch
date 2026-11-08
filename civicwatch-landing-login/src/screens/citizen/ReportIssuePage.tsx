import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import type { Category } from '../../types';
import { Navbar } from '../../components/Navbar';
import toast from 'react-hot-toast';

export function ReportIssuePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
      if (res.data.length > 0) {
        setCategory(res.data[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      if (photo) {
        formData.append('photo', photo);
      }

      const res = await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Complaint submitted successfully!');
      navigate(`/complaint/${res.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons: Record<string, string> = {
    'Potholes': '🕳️',
    'Garbage': '🗑️',
    'Streetlights': '💡',
    'Drainage': '🌊',
    'Water Leakage': '💧',
    'Damaged Roads': '🚧'
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#C47A32]/20" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="main-content flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <Link to="/dashboard" className="text-xs font-semibold hover:underline flex items-center gap-1.5 mb-3 text-[#12345B]" style={{ textDecoration: 'none' }}>
            ← Back to My Complaints
          </Link>
          <h1 className="text-3xl font-black text-[#12345B] tracking-tight">
            Report a Civic Issue
          </h1>
          <p className="text-sm text-[#66727A] mt-1">
            Provide accurate photos and location details to ensure prompt assignment to the responsible ward officer.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D5D7D4] p-6 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category Selector Pills */}
            <div>
              <label className="form-label text-xs uppercase tracking-wider text-[#66727A] mb-2 block">
                1. Select Issue Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map(c => {
                  const icon = categoryIcons[c.name] || '📌';
                  const isSelected = category === c._id;
                  return (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => setCategory(c._id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#12345B] bg-[#12345B]/5 shadow-xs ring-1 ring-[#12345B]'
                          : 'border-[#D5D7D4] bg-white hover:border-[#12345B]/50 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#12345B]' : 'text-[#17212B]'}`}>
                          {c.name}
                        </div>
                        <div className="text-[10px] text-[#8E9BAA] line-clamp-1 mt-0.5">
                          {c.description || 'Civic infrastructure'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="form-label text-xs uppercase tracking-wider text-[#66727A] mb-1.5 block">
                2. Complaint Headline / Title *
              </label>
              <input
                type="text"
                className="form-input rounded-lg text-sm"
                placeholder="e.g. Large open pothole outside Gate 2"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={200}
                required
              />
              <span className="text-[11px] text-[#8E9BAA] mt-1 block">
                Be specific and concise ({title.length}/200 characters)
              </span>
            </div>

            {/* Location */}
            <div>
              <label className="form-label text-xs uppercase tracking-wider text-[#66727A] mb-1.5 block">
                3. Exact Location / Nearest Landmark *
              </label>
              <input
                type="text"
                className="form-input rounded-lg text-sm"
                placeholder="e.g. 5th Main Road, Opposite Canara Bank, Ward 12, Bengaluru"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
              <span className="text-[11px] text-[#8E9BAA] mt-1 block">
                Include ward, street number, or prominent landmark for field officers
              </span>
            </div>

            {/* Description */}
            <div>
              <label className="form-label text-xs uppercase tracking-wider text-[#66727A] mb-1.5 block">
                4. Detailed Description of the Problem *
              </label>
              <textarea
                className="form-input rounded-lg text-sm"
                rows={4}
                placeholder="Describe how long the issue has persisted, risks to pedestrians or vehicles, and any other relevant details..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={2000}
                required
              />
              <span className="text-[11px] text-[#8E9BAA] mt-1 block">
                {description.length}/2000 characters
              </span>
            </div>

            {/* Evidence Photo Upload */}
            <div>
              <label className="form-label text-xs uppercase tracking-wider text-[#66727A] mb-2 block">
                5. Photographic Evidence (Recommended)
              </label>

              {photoPreview ? (
                <div className="relative rounded-xl border border-[#D5D7D4] overflow-hidden bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#12345B] flex items-center gap-1.5">
                      <span>📷</span> Evidence Ready for Upload ({photo?.name})
                    </span>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-xs text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                  <img
                    src={photoPreview}
                    alt="Complaint Preview"
                    className="max-h-64 rounded-lg object-contain mx-auto border border-[#D5D7D4]"
                  />
                </div>
              ) : (
                <div className="upload-area rounded-xl p-8 border-2 border-dashed border-[#D5D7D4] hover:border-[#12345B] transition-colors bg-slate-50/50 hover:bg-slate-50">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer block text-center">
                    <div className="w-12 h-12 rounded-full bg-[#12345B]/10 text-[#12345B] flex items-center justify-center text-2xl mx-auto mb-3">
                      📷
                    </div>
                    <div className="text-sm font-bold text-[#12345B] mb-1">
                      Click to upload evidence photo
                    </div>
                    <div className="text-xs text-[#8E9BAA]">
                      Supports PNG, JPG, or WebP up to 5MB
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E7E6E1]">
              <Link to="/dashboard" className="btn btn-secondary px-5 py-2.5 text-xs font-semibold" style={{ textDecoration: 'none' }}>
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-saffron glow-saffron px-6 py-2.5 text-xs font-bold shadow-md cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Submitting to Municipal Queue...' : '🚀 Submit Civic Complaint'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
