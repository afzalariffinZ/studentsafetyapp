// Simple report storage utility
let reportStorage: any[] = [
  // Default mock data
  {
    id: 1,
    type: 'Emergency SOS',
    location: 'Library - 2nd Floor',
    date: '2024-01-15',
    time: '14:30',
    status: 'Resolved',
    icon: 'warning',
    description: 'Emergency situation at library'
  },
  {
    id: 2,
    type: 'Emergency SOS',
    location: 'Dormitory A - Room 205',
    date: '2024-01-10',
    time: '22:15',
    status: 'In Progress',
    icon: 'warning',
    description: 'Emergency in dormitory'
  },
  {
    id: 3,
    type: 'Safety Concern',
    location: 'Parking Lot B',
    date: '2024-01-14',
    time: '16:45',
    status: 'Under Review',
    icon: 'report-problem',
    description: 'Safety issue in parking lot'
  },
  {
    id: 4,
    type: 'Property Damage',
    location: 'Student Center',
    date: '2024-01-12',
    time: '12:20',
    status: 'Resolved',
    icon: 'report-problem',
    description: 'Property damage reported'
  },
  {
    id: 5,
    type: 'Harassment',
    location: 'Campus Quad',
    date: '2024-01-08',
    time: '19:30',
    status: 'Resolved',
    icon: 'report-problem',
    description: 'Harassment incident'
  }
];

export const ReportStorage = {
  getAllReports: () => {
    return [...reportStorage].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addReport: (report: any) => {
    const newReport = {
      ...report,
      id: Math.max(...reportStorage.map(r => r.id), 0) + 1,
      icon: report.type.includes('Emergency') ? 'warning' : 'report-problem'
    };
    reportStorage.unshift(newReport); // Add to beginning for latest first
    return newReport;
  },

  getReportsByType: (type: 'Emergency' | 'Incidents' | 'All') => {
    const allReports = ReportStorage.getAllReports();
    if (type === 'Emergency') {
      return allReports.filter(report => report.type.includes('Emergency'));
    }
    if (type === 'Incidents') {
      return allReports.filter(report => !report.type.includes('Emergency'));
    }
    return allReports;
  },

  getStats: () => {
    const total = reportStorage.length;
    const resolved = reportStorage.filter(r => r.status === 'Resolved').length;
    const pending = total - resolved;
    return { total, resolved, pending };
  },

  updateReportStatus: (reportId: string, newStatus: string, updatedReport?: any) => {
    const reportIndex = reportStorage.findIndex(r => r.id.toString() === reportId.toString());
    if (reportIndex !== -1) {
      if (updatedReport) {
        // Replace entire report
        reportStorage[reportIndex] = updatedReport;
      } else {
        // Just update status
        reportStorage[reportIndex].status = newStatus;
      }
      return reportStorage[reportIndex];
    }
    throw new Error('Report not found');
  }
};
