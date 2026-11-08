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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="main-content flex-1" style={{ maxWidth: 760, margin: '0 auto', width: '100%', padding: '28px 24px' }}>
        <div className="mb-6">
          <Link to="/dashboard" className="text-xs hover:underline flex items-center gap-1 mb-2" style={{ color: 'var(--navy)', textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
          <h1 className="section-title">Report a Civic Issue</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Provide accurate details and photos to help municipal authorities resolve the issue quickly.
          </p>
        </div>

        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Issue Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Broken streetlight on 4th Main Road"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={200}
                required
              />
              <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>
                Keep it concise and specific ({title.length}/200)
              </span>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location / Landmark *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Near HDFC Bank ATM, 8th Cross, Malleshwaram"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe the issue, how long it has persisted, and any hazards it presents..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={2000}
                required
              />
              <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>
                {description.length}/2000 characters
              </span>
            </div>

            {/* Photo upload */}
            <div className="form-group">
              <label className="form-label">Photo Evidence (Optional)</label>
              <div className="upload-area">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label htmlFor="photo-upload" className="cursor-pointer block">
                  {photoPreview ? (
                    <div>
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="max-h-56 mx-auto rounded mb-3 object-cover"
                      />
                      <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                        Click to change photo
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl mb-2">📷</div>
                      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                        Click to upload an image
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        JPEG, PNG, WebP up to 5MB
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <Link to="/dashboard" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-saffron"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
