import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Complaint } from '../types';

interface CivicMapProps {
  complaints: Complaint[];
  height?: string;
  showLegend?: boolean;
  title?: string;
  subtitle?: string;
}

// Marker Color Configuration per specification:
// - Green: Resolved complaints (and Closed)
// - Red: Pending complaints
// - Yellow/Orange: In-progress complaints
// - Blue: Assigned complaints
// - Grey: Reopened complaints
const STATUS_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  'Resolved': { bg: '#3F6B52', border: '#234431', label: 'Resolved' },
  'Closed': { bg: '#3F6B52', border: '#234431', label: 'Closed' },
  'Pending': { bg: '#9B4141', border: '#682222', label: 'Pending' },
  'In Progress': { bg: '#C47A32', border: '#8A4E15', label: 'In Progress' },
  'Assigned': { bg: '#12345B', border: '#0B2742', label: 'Assigned' },
  'Reopened': { bg: '#66727A', border: '#424B51', label: 'Reopened' }
};

// Create a custom SVG Leaflet DivIcon for each status color
function createMarkerIcon(status: string) {
  const config = STATUS_COLORS[status] || STATUS_COLORS['Pending'];
  const svgHtml = `
    <div style="position: relative; width: 32px; height: 38px; display: flex; align-items: center; justify-content: center;">
      <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 13.5 20.8 15.2 21.8a1.5 1.5 0 0 0 1.6 0C18.5 36.8 32 26.5 32 16c0-8.837-7.163-16-16-16z" fill="${config.bg}" stroke="${config.border}" stroke-width="1.5"/>
        <circle cx="16" cy="15" r="6" fill="#FFFFFF"/>
        <circle cx="16" cy="15" r="3" fill="${config.bg}"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-civic-marker',
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -38]
  });
}

// Bengaluru Center Coordinates
const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946];

export function CivicMap({
  complaints,
  height = '500px',
  showLegend = true,
  title,
  subtitle
}: CivicMapProps) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter complaints that have valid coordinates
  const validComplaints = useMemo(() => {
    return complaints.filter(
      c =>
        c.coordinates &&
        c.coordinates.lat !== null &&
        c.coordinates.lng !== null &&
        !isNaN(Number(c.coordinates.lat)) &&
        !isNaN(Number(c.coordinates.lng))
    );
  }, [complaints]);

  // Apply active status filter if selected
  const displayedComplaints = useMemo(() => {
    if (activeFilter === 'all') return validComplaints;
    return validComplaints.filter(c => c.status.toLowerCase() === activeFilter.toLowerCase());
  }, [validComplaints, activeFilter]);

  const handleMarkerClick = (complaint: Complaint) => {
    if (complaint.isOwner !== false) {
      navigate(`/complaint/${complaint._id}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D5D7D4] shadow-xs overflow-hidden">
      {/* Optional Card Header */}
      {(title || subtitle) && (
        <div className="p-5 border-b border-[#E7E6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            {title && (
              <h3 className="text-lg font-black text-[#12345B] tracking-tight font-display flex items-center gap-2">
                <span>🗺️</span> {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-[#66727A] mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#8E9BAA] text-[11px] font-mono">
              Mapped Issues: {displayedComplaints.length} of {complaints.length}
            </span>
          </div>
        </div>
      )}

      {/* Filter Chips Toolbar */}
      <div className="px-5 py-2.5 bg-[#F6F5F1] border-b border-[#E7E6E1] flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-[#66727A] uppercase tracking-wider mr-1">
            Filter Map:
          </span>
          {['all', 'Pending', 'In Progress', 'Assigned', 'Resolved', 'Reopened'].map((status) => {
            const isSelected = activeFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveFilter(status)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#12345B] text-white shadow-xs'
                    : 'bg-white text-[#66727A] border border-[#D5D7D4] hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] text-[#8E9BAA] font-mono">
          City: Bengaluru (BBMP Wards)
        </span>
      </div>

      {/* Leaflet Map Canvas */}
      <div style={{ height, width: '100%' }} className="relative z-0">
        <MapContainer
          center={BENGALURU_CENTER}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* OpenStreetMap Tile Layer (Free, no API key required) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {displayedComplaints.map((complaint) => {
            const lat = Number(complaint.coordinates!.lat);
            const lng = Number(complaint.coordinates!.lng);
            const statusConfig = STATUS_COLORS[complaint.status] || STATUS_COLORS['Pending'];
            const icon = createMarkerIcon(complaint.status);

            return (
              <Marker
                key={complaint._id}
                position={[lat, lng]}
                icon={icon}
                eventHandlers={{
                  click: () => handleMarkerClick(complaint)
                }}
              >
                {/* Hover Tooltip per specification: title, category, location, status, date */}
                <Tooltip direction="top" offset={[0, -32]} opacity={0.96}>
                  <div className="text-xs p-1" style={{ maxWidth: 220 }}>
                    <div className="font-bold text-[#12345B] mb-0.5">{complaint.title}</div>
                    <div className="text-[10px] text-[#66727A] mb-1">
                      📂 {typeof complaint.category === 'object' ? complaint.category.name : 'General'}
                    </div>
                    <div className="text-[10px] text-[#17212B] mb-1">
                      📍 {complaint.location}
                    </div>
                    <div className="flex items-center justify-between text-[9px] pt-1 border-t border-slate-200">
                      <span className="font-bold" style={{ color: statusConfig.bg }}>
                        ● {complaint.status}
                      </span>
                      <span className="text-slate-400">
                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </Tooltip>

                {/* Clickable Popup with Action Button */}
                <Popup>
                  <div className="p-1 text-xs" style={{ minWidth: 200 }}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-[#12345B] bg-[#12345B]/10 px-1.5 py-0.5 rounded">
                        {complaint.complaintId}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: statusConfig.bg }}
                      >
                        {complaint.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#12345B] mb-1">{complaint.title}</h4>
                    <p className="text-[11px] text-[#66727A] mb-2 leading-tight">
                      📍 {complaint.location}
                    </p>

                    <div className="text-[11px] text-[#17212B] bg-[#F6F5F1] p-2 rounded mb-2 border-l-2" style={{ borderColor: statusConfig.bg }}>
                      {complaint.statusExplanation}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-[#8E9BAA]">
                      <span>Reported: {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {complaint.isOwner !== false ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/complaint/${complaint._id}`)}
                        className="mt-2.5 w-full py-1.5 px-3 rounded bg-[#12345B] hover:bg-[#0B2742] text-white text-[11px] font-bold text-center transition-colors cursor-pointer"
                      >
                        Open Complaint Details →
                      </button>
                    ) : (
                      <div className="mt-2 text-[10px] text-center text-[#8E9BAA] italic">
                        Viewing public civic report marker
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ── Specification Colour Legend ──────────────────────────────── */}
      {showLegend && (
        <div className="p-4 bg-white border-t border-[#E7E6E1]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#66727A] mb-2">
            Complaint Status Marker Legend:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS['Pending'].bg }}></span>
              <span className="font-medium text-[#17212B]">Red: Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS['In Progress'].bg }}></span>
              <span className="font-medium text-[#17212B]">Orange: In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS['Assigned'].bg }}></span>
              <span className="font-medium text-[#17212B]">Blue: Assigned</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS['Resolved'].bg }}></span>
              <span className="font-medium text-[#17212B]">Green: Resolved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS['Reopened'].bg }}></span>
              <span className="font-medium text-[#17212B]">Grey: Reopened</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
