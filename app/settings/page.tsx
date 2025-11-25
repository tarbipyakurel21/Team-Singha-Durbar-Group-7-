"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Settings, 
  User, 
  Lock, 
  Moon, 
  Sun, 
  Database,
  Save,
  Loader2,
  Type,
  Bell,
  Trash2,
  Download,
  Upload,
  RotateCcw
} from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    phone: "+1 (555) 123-4567",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fontSettings, setFontSettings] = useState({
    size: "medium",
    family: "default",
  });
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference - default to light mode
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      // Ensure light mode is set (remove dark class if present)
      document.documentElement.classList.remove("dark");
    }

    // Load saved preferences
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    const savedFontFamily = localStorage.getItem("fontFamily") || "default";
    const savedLowStockAlerts = localStorage.getItem("lowStockAlerts") !== "false";
    
    setFontSettings({ size: savedFontSize, family: savedFontFamily });
    setLowStockAlerts(savedLowStockAlerts);
    
    // Apply saved font settings
    if (savedFontSize) {
      document.body.className = document.body.className.replace(/font-size-\w+/g, "");
      document.body.classList.add(`font-size-${savedFontSize}`);
    }
    if (savedFontFamily && savedFontFamily !== "default") {
      document.body.className = document.body.className.replace(/font-family-\w+/g, "");
      document.body.classList.add(`font-family-${savedFontFamily}`);
    }
  }, []);

  const handleThemeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleProfileSave = () => {
    setSubmitting(true);
    // Mock save - in real app, this would call an API
    setTimeout(() => {
      setSubmitting(false);
      setIsProfileDialogOpen(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    setSubmitting(true);
    // Mock save - in real app, this would call an API
    setTimeout(() => {
      setSubmitting(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordDialogOpen(false);
      alert("Password changed successfully!");
    }, 1000);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSettings({ ...fontSettings, size });
    localStorage.setItem("fontSize", size);
    // Apply font size class to body
    document.body.className = document.body.className.replace(/font-size-\w+/g, "");
    document.body.classList.add(`font-size-${size}`);
  };

  const handleFontFamilyChange = (family: string) => {
    setFontSettings({ ...fontSettings, family });
    localStorage.setItem("fontFamily", family);
    // Apply font family class to body
    document.body.className = document.body.className.replace(/font-family-\w+/g, "");
    if (family !== "default") {
      document.body.classList.add(`font-family-${family}`);
    }
  };

  const handleLowStockAlertsToggle = (checked: boolean) => {
    setLowStockAlerts(checked);
    localStorage.setItem("lowStockAlerts", checked.toString());
  };

  const handleDataExport = () => {
    alert("Data export functionality would be implemented here - exports all products and categories as JSON");
  };

  const handleDataImport = () => {
    alert("Data import functionality would be implemented here - imports from a backup JSON file");
  };

  const handleDeleteAllProducts = () => {
    if (confirm("Are you sure you want to delete ALL products? This action cannot be undone.")) {
      alert("Delete all products functionality would be implemented here");
    }
  };

  const handleDeleteAllCategories = () => {
    if (confirm("Are you sure you want to delete ALL categories? This action cannot be undone. Products with these categories may be affected.")) {
      alert("Delete all categories functionality would be implemented here");
    }
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default? This will reset your preferences.")) {
      localStorage.removeItem("theme");
      localStorage.removeItem("fontSize");
      localStorage.removeItem("fontFamily");
      localStorage.removeItem("lowStockAlerts");
      setDarkMode(false);
      setFontSettings({ size: "medium", family: "default" });
      setLowStockAlerts(true);
      document.documentElement.classList.remove("dark");
      document.body.className = document.body.className.replace(/font-size-\w+/g, "");
      document.body.className = document.body.className.replace(/font-family-\w+/g, "");
      alert("Settings reset to default values!");
    }
  };

  const handleClearStoredData = () => {
    if (confirm("Are you sure you want to clear all stored data? This will remove all local storage data. This action cannot be undone.")) {
      localStorage.clear();
      alert("All stored data has been cleared!");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
        </div>

        {/* Account Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your profile information and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={() => setIsProfileDialogOpen(true)}
              className="w-full justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              Profile Information
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(true)}
              className="w-full justify-start"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Profile Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </DialogTitle>
              <DialogDescription>
                Update your personal information and account details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-name">Full Name</Label>
                  <Input
                    id="dialog-name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dialog-email">Email Address</Label>
                  <Input
                    id="dialog-email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dialog-role">Role</Label>
                  <Input
                    id="dialog-role"
                    value={profileData.role}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dialog-phone">Phone Number</Label>
                  <Input
                    id="dialog-phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsProfileDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleProfileSave} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </DialogTitle>
              <DialogDescription>
                Update your password to keep your account secure
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dialog-currentPassword">Current Password</Label>
                <Input
                  id="dialog-currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter your current password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dialog-newPassword">New Password</Label>
                <Input
                  id="dialog-newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter your new password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dialog-confirmPassword">Confirm New Password</Label>
                <Input
                  id="dialog-confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your new password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordChange} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {darkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize the appearance and theme of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-base">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Font Settings Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              <CardTitle>Font Settings</CardTitle>
            </div>
            <CardDescription>
              Customize font size and type for better readability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select
                  value={fontSettings.size}
                  onValueChange={handleFontSizeChange}
                >
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={fontSettings.family}
                  onValueChange={handleFontFamilyChange}
                >
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>
              Manage your notification settings and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="low-stock-alerts" className="text-base">
                  Low Stock Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when product stock falls below minimum threshold
                </p>
              </div>
              <Switch
                id="low-stock-alerts"
                checked={lowStockAlerts}
                onCheckedChange={handleLowStockAlertsToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>
              Export, import, delete, or reset your application data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Backup & Restore */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Backup & Restore</Label>
              <div className="flex flex-col gap-3 md:flex-row">
                <Button
                  variant="outline"
                  onClick={handleDataExport}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Backup
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDataImport}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Backup
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Export your data as JSON backup or import from a backup file
              </p>
            </div>

            {/* Delete Data */}
            <div className="space-y-3 border-t pt-4">
              <Label className="text-base font-semibold">Delete Data</Label>
              <div className="flex flex-col gap-3 md:flex-row">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAllProducts}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Products
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAllCategories}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Categories
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-destructive">
                Permanently delete all products or categories. This action cannot be undone.
              </p>
            </div>

            {/* Reset & Clear */}
            <div className="space-y-3 border-t pt-4">
              <Label className="text-base font-semibold">Reset & Clear</Label>
              <div className="flex flex-col gap-3 md:flex-row">
                <Button
                  variant="outline"
                  onClick={handleResetSettings}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Settings
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearStoredData}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Stored Data
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Reset all settings to default values or clear all local storage data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

