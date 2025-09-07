"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Users, 
  Shield, 
  Bell, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Camera,
  Wifi,
  Database,
  Key,
  UserPlus,
  UserMinus,
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Globe,
  Server,
  Phone,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Minus
} from "lucide-react";

// Mock officers data
const generateOfficers = () => [
  {
    id: 1,
    name: "Sarah Chen",
    badge: "PO-001",
    rank: "Senior Officer",
    role: "admin",
    email: "sarah.chen@police.gov",
    phone: "+1-555-0101",
    status: "active",
    lastLogin: "2024-01-15T10:30:00Z",
    permissions: ["view_all", "edit_all", "manage_users", "admin_settings"]
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    badge: "PO-002",
    rank: "Supervisor",
    role: "supervisor",
    email: "marcus.rodriguez@police.gov",
    phone: "+1-555-0102",
    status: "active",
    lastLogin: "2024-01-15T09:15:00Z",
    permissions: ["view_all", "edit_cases", "assign_officers"]
  },
  {
    id: 3,
    name: "Emily Watson",
    badge: "PO-003",
    rank: "Patrol Officer",
    role: "patrol",
    email: "emily.watson@police.gov",
    phone: "+1-555-0103",
    status: "active",
    lastLogin: "2024-01-15T08:45:00Z",
    permissions: ["view_assigned", "edit_assigned", "submit_reports"]
  },
  {
    id: 4,
    name: "David Kim",
    badge: "PO-004",
    rank: "Patrol Officer",
    role: "patrol",
    email: "david.kim@police.gov",
    phone: "+1-555-0104",
    status: "inactive",
    lastLogin: "2024-01-10T16:20:00Z",
    permissions: ["view_assigned", "submit_reports"]
  }
];

export default function SettingsPage() {
  const [officers, setOfficers] = useState(() => generateOfficers());
  const [activeTab, setActiveTab] = useState("users");
  const [editingOfficer, setEditingOfficer] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    smsBackup: true,
    emailAlerts: true,
    pushNotifications: true,
    emergencyOverride: true,
    quietHours: { enabled: true, start: "22:00", end: "06:00" },
    escalationTime: 15, // minutes
    autoAcknowledge: false
  });

  // Integration settings state
  const [integrationSettings, setIntegrationSettings] = useState({
    whatsapp: { enabled: true, webhook: "https://api.whatsapp.com/webhook", apiKey: "sk-..." },
    smsGateway: { enabled: true, provider: "twilio", apiKey: "ACa...", phoneNumber: "+1-555-POLICE" },
    cctv: { enabled: true, server: "192.168.1.100", port: "8080", username: "admin" },
    iotSensors: { enabled: true, mqttBroker: "mqtt.campus.edu", topic: "security/alerts" },
    database: { backupEnabled: true, retentionDays: 365, encryptionEnabled: true }
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 border-red-200";
      case "supervisor": return "bg-orange-100 text-orange-800 border-orange-200";
      case "patrol": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "inactive": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const addOfficer = (officerData: any) => {
    const newOfficer = {
      id: Math.max(...officers.map(o => o.id)) + 1,
      ...officerData,
      lastLogin: new Date().toISOString(),
      status: "active"
    };
    setOfficers([...officers, newOfficer]);
    setShowAddForm(false);
  };

  const removeOfficer = (officerId: number) => {
    setOfficers(officers.filter(o => o.id !== officerId));
  };

  const updateOfficer = (officerId: number, updates: any) => {
    setOfficers(officers.map(o => o.id === officerId ? { ...o, ...updates } : o));
    setEditingOfficer(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#327da8] to-[#bad1de] text-white rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Settings & Administration</h1>
              <p className="text-white/90 text-sm sm:text-base">Manage users, permissions, and system integrations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={activeTab === "users" ? "default" : "outline"}
              onClick={() => setActiveTab("users")}
              className={`text-xs sm:text-sm flex-shrink-0 ${activeTab === "users" ? "bg-[#327da8] hover:bg-[#2a6b91]" : ""}`}
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">User Management</span>
              <span className="sm:hidden">Users</span>
            </Button>
            <Button
              variant={activeTab === "permissions" ? "default" : "outline"}
              onClick={() => setActiveTab("permissions")}
              className={`text-xs sm:text-sm flex-shrink-0 ${activeTab === "permissions" ? "bg-[#327da8] hover:bg-[#2a6b91]" : ""}`}
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Permissions</span>
              <span className="sm:hidden">Perms</span>
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "outline"}
              onClick={() => setActiveTab("notifications")}
              className={`text-xs sm:text-sm flex-shrink-0 ${activeTab === "notifications" ? "bg-[#327da8] hover:bg-[#2a6b91]" : ""}`}
            >
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
            </Button>
            <Button
              variant={activeTab === "integrations" ? "default" : "outline"}
              onClick={() => setActiveTab("integrations")}
              className={activeTab === "integrations" ? "bg-[#327da8] hover:bg-[#2a6b91]" : ""}
            >
              <Globe className="h-4 w-4 mr-2" />
              Integrations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Management Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#327da8]" />
                  Officer Management
                </CardTitle>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#327da8] hover:bg-[#2a6b91]"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Officer
                </Button>
              </div>
              <CardDescription>
                Add, remove, and manage police officers in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showAddForm && (
                <Card className="mb-6 border-dashed border-2 border-[#327da8]">
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Officer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Full Name" />
                      <Input placeholder="Badge Number" />
                      <Input placeholder="Email Address" />
                      <Input placeholder="Phone Number" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Rank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patrol">Patrol Officer</SelectItem>
                          <SelectItem value="senior">Senior Officer</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="lieutenant">Lieutenant</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patrol">Patrol</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button className="bg-[#327da8] hover:bg-[#2a6b91]">
                        <Save className="h-4 w-4 mr-2" />
                        Add Officer
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {officers.map((officer) => (
                  <Card key={officer.id} className="border-l-4 border-l-[#327da8]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#327da8] text-white rounded-full flex items-center justify-center font-semibold">
                            {officer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{officer.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-gray-600">{officer.badge}</span>
                              <span className="text-sm text-gray-600">•</span>
                              <span className="text-sm text-gray-600">{officer.rank}</span>
                              <Badge className={getRoleColor(officer.role)} variant="outline">
                                {officer.role}
                              </Badge>
                              <Badge className={getStatusColor(officer.status)} variant="outline">
                                {officer.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{officer.email}</span>
                              <span>•</span>
                              <span>{officer.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingOfficer(officer.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeOfficer(officer.id)}
                            className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {officer.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#327da8]" />
                Role-Based Permissions
              </CardTitle>
              <CardDescription>
                Configure what each role can access and modify
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patrol Officer Permissions */}
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-700">Patrol Officer</CardTitle>
                    <CardDescription>Basic field operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">View assigned cases</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Submit reports</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Update case status</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">View all cases</span>
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Assign cases</span>
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Admin settings</span>
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Supervisor Permissions */}
                <Card className="border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">Supervisor</CardTitle>
                    <CardDescription>Case management & oversight</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">View all cases</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Assign officers</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Edit any case</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">View analytics</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manage users</span>
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System settings</span>
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Permissions */}
                <Card className="border-2 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700">Administrator</CardTitle>
                    <CardDescription>Full system access</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Full case access</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User management</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System settings</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data export</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit logs</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emergency override</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#327da8]" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure SMS backup, email alerts, and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Notification Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      SMS Backup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable SMS backup</span>
                      <button className={`w-12 h-6 rounded-full ${notificationSettings.smsBackup ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notificationSettings.smsBackup ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <Input placeholder="SMS Gateway URL" defaultValue="https://sms.gateway.com/api" />
                    <Input placeholder="API Key" type="password" defaultValue="key_123456789" />
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue placeholder="SMS Priority Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Alerts</SelectItem>
                        <SelectItem value="high">High Priority Only</SelectItem>
                        <SelectItem value="emergency">Emergency Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable email alerts</span>
                      <button className={`w-12 h-6 rounded-full ${notificationSettings.emailAlerts ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notificationSettings.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <Input placeholder="SMTP Server" defaultValue="smtp.police.gov" />
                    <Input placeholder="Email Template ID" defaultValue="alert_template_v2" />
                    <Textarea placeholder="Email signature" rows={3} defaultValue="Metropolitan Police Department\nEmergency Response Division" />
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Settings */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Escalation Time (minutes)</label>
                      <Input 
                        type="number" 
                        value={notificationSettings.escalationTime}
                        onChange={(e) => setNotificationSettings(prev => ({...prev, escalationTime: parseInt(e.target.value)}))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Quiet Hours</label>
                      <div className="flex gap-2">
                        <Input type="time" value={notificationSettings.quietHours.start} />
                        <span className="flex items-center">to</span>
                        <Input type="time" value={notificationSettings.quietHours.end} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Emergency Override</span>
                        <p className="text-sm text-gray-600">Emergency alerts bypass quiet hours</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full ${notificationSettings.emergencyOverride ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notificationSettings.emergencyOverride ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Auto-acknowledge</span>
                        <p className="text-sm text-gray-600">Automatically acknowledge low-priority alerts</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full ${notificationSettings.autoAcknowledge ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notificationSettings.autoAcknowledge ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#327da8]" />
                System Integrations
              </CardTitle>
              <CardDescription>
                Configure WhatsApp, SMS gateway, CCTV, and IoT campus sensors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Communication Integrations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      WhatsApp Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable WhatsApp</span>
                      <button className={`w-12 h-6 rounded-full ${integrationSettings.whatsapp.enabled ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${integrationSettings.whatsapp.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <Input placeholder="Webhook URL" value={integrationSettings.whatsapp.webhook} />
                    <Input placeholder="API Key" type="password" value={integrationSettings.whatsapp.apiKey} />
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      SMS Gateway
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable SMS Gateway</span>
                      <button className={`w-12 h-6 rounded-full ${integrationSettings.smsGateway.enabled ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${integrationSettings.smsGateway.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <Select value={integrationSettings.smsGateway.provider}>
                      <SelectTrigger>
                        <SelectValue placeholder="SMS Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="aws_sns">AWS SNS</SelectItem>
                        <SelectItem value="vonage">Vonage</SelectItem>
                        <SelectItem value="messagebird">MessageBird</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Phone Number" value={integrationSettings.smsGateway.phoneNumber} />
                    <Input placeholder="API Key" type="password" value={integrationSettings.smsGateway.apiKey} />
                  </CardContent>
                </Card>
              </div>

              {/* Security & IoT Integrations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      CCTV Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable CCTV</span>
                      <button className={`w-12 h-6 rounded-full ${integrationSettings.cctv.enabled ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${integrationSettings.cctv.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <Input placeholder="CCTV Server IP" value={integrationSettings.cctv.server} />
                    <Input placeholder="Port" value={integrationSettings.cctv.port} />
                    <Input placeholder="Username" value={integrationSettings.cctv.username} />
                    <Input placeholder="Password" type="password" />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Cameras
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wifi className="h-5 w-5" />
                      IoT Campus Sensors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable IoT Sensors</span>
                      <button className={`w-12 h-6 rounded-full ${integrationSettings.iotSensors.enabled ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${integrationSettings.iotSensors.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <Input placeholder="MQTT Broker" value={integrationSettings.iotSensors.mqttBroker} />
                    <Input placeholder="Topic Pattern" value={integrationSettings.iotSensors.topic} />
                    <Select defaultValue="json">
                      <SelectTrigger>
                        <SelectValue placeholder="Data Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                      <strong>Connected Sensors:</strong> Motion detectors (12), Door sensors (8), Fire alarms (15), Emergency buttons (25)
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Database & Security */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database & Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Auto Backup</span>
                        <p className="text-xs text-gray-600">Daily backups at 2 AM</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full ${integrationSettings.database.backupEnabled ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${integrationSettings.database.backupEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Encryption</span>
                        <p className="text-xs text-gray-600">AES-256 encryption</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full ${integrationSettings.database.encryptionEnabled ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${integrationSettings.database.encryptionEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Retention (days)</label>
                      <Input 
                        type="number" 
                        value={integrationSettings.database.retentionDays}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="bg-[#327da8] hover:bg-[#2a6b91]">
                      <Save className="h-4 w-4 mr-2" />
                      Save All Settings
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Config
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
