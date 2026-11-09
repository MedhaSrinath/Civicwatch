export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'officer' | 'admin';
  phone?: string;
  department?: {
    _id: string;
    name: string;
  } | string;
  isActive?: boolean;
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface StatusHistory {
  _id: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Reopened';
  explanation: string;
  changedBy?: {
    _id: string;
    name: string;
    role: string;
  };
  remarks?: string;
  timestamp: string;
}

export interface Complaint {
  _id: string;
  complaintId: string;
  title: string;
  description: string;
  category: Category | string;
  location: string;
  coordinates?: {
    lat: number | null;
    lng: number | null;
  } | null;
  isOwner?: boolean;
  photo?: string;
  citizen: User;
  department?: Department;
  assignedOfficer?: User;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Reopened';
  statusExplanation: string;
  statusHistory: StatusHistory[];
  resolutionRemarks?: string;
  resolutionPhoto?: string;
  citizenFeedback?: 'confirmed' | 'disputed' | null;
  citizenFeedbackRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  pending: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  closed: number;
  reopened: number;
  departmentStats: {
    _id: string;
    name: string;
    total: number;
    resolved: number;
    pending: number;
  }[];
  priorityStats: {
    _id: string;
    count: number;
  }[];
}
