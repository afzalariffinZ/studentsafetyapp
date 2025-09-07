"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  AlertTriangle, 
  Phone, 
  Upload, 
  CheckCircle, 
  Clock, 
  Filter,
  Search,
  Trash2,
  Mail,
  MailOpen,
  Volume2,
  VolumeX,
  Calendar,
  User,
  Shield,
  Camera,
  MessageSquare,
  FileText,
  Activity
} from "lucide-react";

// Mock alert data - using fixed seed for consistent data
const generateAlerts = () => {
  const alertTypes = [
    {
      type: "emergency",
      icon: AlertTriangle,
      title: "Emergency Report Filed",
      description: "New emergency incident reported at Block C",
      priority: "Critical",
      category: "Emergency Alert"
    },
    {
      type: "missed_call",
      icon: Phone,
      title: "Missed Emergency Call",
      description: "Missed call from emergency hotline",
      priority: "High",
      category: "Missed Call"
    },
    {
      type: "evidence",
      icon: Upload,
      title: "New Evidence Uploaded",
      description: "Photo evidence added to case #123",
      priority: "Medium",
      category: "Evidence Update"
    },
    {
      type: "status_update",
      icon: CheckCircle,
      title: "Case Status Updated",
      description: "Case #145 marked as resolved",
      priority: "Low",
      category: "Status Update"
    },
    {
      type: "system",
      icon: Activity,
      title: "System Maintenance",
      description: "Scheduled maintenance completed",
      priority: "Low",
      category: "System Alert"
    },
    {
      type: "officer_assigned",
      icon: Shield,
      title: "Officer Assignment",
      description: "Officer Sarah Chen assigned to case #156",
      priority: "Medium",
      category: "Assignment"
    },
    {
      type: "cctv",
      icon: Camera,
      title: "CCTV Motion Detected",
      description: "Unusual activity detected in Area B",
      priority: "High",
      category: "Security Alert"
    },
    {
      type: "message",
      icon: MessageSquare,
      title: "New Internal Message",
      description: "Message from Supervisor regarding patrol schedule",
      priority: "Medium",
      category: "Communication"
    }
  ];

  const alerts = [];
  const baseTime = new Date('2024-01-15T12:00:00Z').getTime();

  for (let i = 0; i < 25; i++) {
    const alertTemplate = alertTypes[i % alertTypes.length];
    // Use deterministic "random" values based on index
    const randomOffset = ((i * 1234567) % 7 * 24 * 60 * 60 * 1000);
    const timestamp = new Date(baseTime - randomOffset);
    const isRead = (i * 7) % 5 !== 0; // Deterministic read status
    const isAcknowledged = isRead && (i * 11) % 3 === 0;

    alerts.push({
      id: i + 1,
      ...alertTemplate,
      timestamp: timestamp.toISOString(),
      isRead,
      isAcknowledged,
      details: `Detailed information about ${alertTemplate.title.toLowerCase()} incident. Location and context provided.`,
      relatedCaseId: alertTemplate.type === "evidence" || alertTemplate.type === "status_update" ? ((i * 13) % 200) + 1 : null
    });
  }

  return alerts.sort((a, b) => {
    // Emergency alerts first, then by timestamp
    if (a.type === "emergency" && b.type !== "emergency") return -1;
    if (b.type === "emergency" && a.type !== "emergency") return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export default function AlertsPage() {
  const [alerts] = useState(() => generateAlerts());
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);

  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    // Filter by type
    if (filter !== "all") {
      if (filter === "unread") {
        filtered = filtered.filter(alert => !alert.isRead);
      } else if (filter === "emergency") {
        filtered = filtered.filter(alert => alert.type === "emergency" || alert.priority === "Critical");
      } else if (filter === "high_priority") {
        filtered = filtered.filter(alert => alert.priority === "High" || alert.priority === "Critical");
      } else {
        filtered = filtered.filter(alert => alert.category === filter);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [alerts, filter, searchTerm]);

  const priorityStats = useMemo(() => {
    const stats = {
      critical: alerts.filter(a => a.priority === "Critical").length,
      high: alerts.filter(a => a.priority === "High").length,
      medium: alerts.filter(a => a.priority === "Medium").length,
      low: alerts.filter(a => a.priority === "Low").length,
      unread: alerts.filter(a => !a.isRead).length
    };
    return stats;
  }, [alerts]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const markAsRead = (alertIds: number[]) => {
    // In a real app, this would update the database
    console.log("Marking as read:", alertIds);
  };

  const markAsUnread = (alertIds: number[]) => {
    // In a real app, this would update the database
    console.log("Marking as unread:", alertIds);
  };

  const deleteAlerts = (alertIds: number[]) => {
    // In a real app, this would delete from database
    console.log("Deleting alerts:", alertIds);
  };

  const toggleSelection = (alertId: number) => {
    setSelectedAlerts(prev =>
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const selectAll = () => {
    setSelectedAlerts(filteredAlerts.map(alert => alert.id));
  };

  const clearSelection = () => {
    setSelectedAlerts([]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#327da8] to-[#bad1de] text-white rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Bell className="h-6 w-6 sm:h-8 sm:w-8" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Notifications & Alerts</h1>
              <p className="text-white/90 text-sm sm:text-base">Central log of all system alerts and notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold">{priorityStats.unread}</div>
              <div className="text-sm text-white/80">Unread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-red-700">{priorityStats.critical}</div>
                <div className="text-xs sm:text-sm text-red-600">Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-orange-700">{priorityStats.high}</div>
                <div className="text-xs sm:text-sm text-orange-600">High</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-700">{priorityStats.medium}</div>
                <div className="text-sm text-yellow-600">Medium</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">{priorityStats.low}</div>
                <div className="text-sm text-green-600">Low</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">{priorityStats.unread}</div>
                <div className="text-sm text-blue-600">Unread</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#327da8]" />
            Filters & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="high_priority">High Priority</SelectItem>
                  <SelectItem value="Missed Call">Missed Calls</SelectItem>
                  <SelectItem value="Evidence Update">Evidence Updates</SelectItem>
                  <SelectItem value="Status Update">Status Updates</SelectItem>
                  <SelectItem value="Security Alert">Security Alerts</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </div>
            </div>

            {selectedAlerts.length > 0 && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markAsRead(selectedAlerts)}
                  className="border-[#327da8] text-[#327da8] hover:bg-[#327da8] hover:text-white"
                >
                  <MailOpen className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markAsUnread(selectedAlerts)}
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Mark Unread
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteAlerts(selectedAlerts)}
                  className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSelection}
                >
                  Clear ({selectedAlerts.length})
                </Button>
              </div>
            )}
          </div>

          {filteredAlerts.length > 0 && (
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={selectAll}
                className="text-xs"
              >
                Select All Visible
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {filteredAlerts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredAlerts.map((alert) => {
                const IconComponent = alert.icon;
                const isSelected = selectedAlerts.includes(alert.id);
                
                return (
                  <div
                    key={alert.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !alert.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                    } ${isSelected ? 'bg-blue-100' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(alert.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${
                          alert.type === "emergency" ? 'bg-red-100' :
                          alert.priority === "Critical" ? 'bg-red-100' :
                          alert.priority === "High" ? 'bg-orange-100' :
                          alert.priority === "Medium" ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            alert.type === "emergency" ? 'text-red-600' :
                            alert.priority === "Critical" ? 'text-red-600' :
                            alert.priority === "High" ? 'text-orange-600' :
                            alert.priority === "Medium" ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`font-semibold text-gray-900 ${!alert.isRead ? 'font-bold' : ''}`}>
                            {alert.title}
                          </h3>
                          <Badge className={getPriorityColor(alert.priority)} variant="outline">
                            {alert.priority}
                          </Badge>
                          {alert.type === "emergency" && (
                            <Badge className="bg-red-500 text-white animate-pulse">
                              EMERGENCY
                            </Badge>
                          )}
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-2">{alert.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(alert.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{alert.category}</span>
                          </div>
                          {alert.relatedCaseId && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              <span>Case #{alert.relatedCaseId}</span>
                            </div>
                          )}
                        </div>

                        {alert.isAcknowledged && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Acknowledged
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </span>
                        {alert.type === "emergency" && (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Respond
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-500">
                {searchTerm || filter !== "all" 
                  ? "Try adjusting your filters or search terms" 
                  : "All caught up! No new alerts at this time."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
