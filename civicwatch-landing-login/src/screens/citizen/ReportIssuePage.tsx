import { Navbar } from '../../components/Navbar';

export function ReportIssuePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="main-content">
        <h1 className="section-title">Report New Civic Issue</h1>
      </div>
    </div>
  );
}
