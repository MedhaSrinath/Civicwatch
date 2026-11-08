import { Navbar } from '../../components/Navbar';

export function ComplaintDetailPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="main-content">
        <h1 className="section-title">Complaint Details</h1>
      </div>
    </div>
  );
}
