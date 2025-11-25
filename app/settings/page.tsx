"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SettingDialog } from "@/components/setting-dialog";
import { Settings, Plus, Search, Trash2, Edit2 } from "lucide-react";

interface Setting {
  id: number;
  name: string;
  value: string;
  category: string;
  description: string;
  lastUpdated: string;
}

// Sample data - in production, this would come from an API or database
const sampleSettings: Setting[] = [
  {
    id: 1,
    name: "Company Name",
    value: "PT Example Company",
    category: "General",
    description: "Company name that will be displayed throughout the system",
    lastUpdated: "2024-03-20 10:30",
  },
  {
    id: 2,
    name: "Email Notifications",
    value: "Enabled",
    category: "Notifications",
    description: "Email notification settings for system activities and alerts",
    lastUpdated: "2024-03-20 09:15",
  },
  {
    id: 3,
    name: "Session Timeout",
    value: "30 minutes",
    category: "Security",
    description: "User session timeout duration before requiring re-authentication",
    lastUpdated: "2024-03-19 15:45",
  },
  {
    id: 4,
    name: "Currency Format",
    value: "USD",
    category: "General",
    description: "Default currency format for displaying prices and values",
    lastUpdated: "2024-03-19 14:20",
  },
  {
    id: 5,
    name: "API Integration",
    value: "Active",
    category: "Integration",
    description: "External API integration status for third-party services",
    lastUpdated: "2024-03-18 11:30",
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>(sampleSettings);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    category: "General",
    description: "",
  });

  const filteredSettings = settings.filter(
    (setting) =>
      setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      value: "",
      category: "General",
      description: "",
    });
  };

  const handleAdd = () => {
    const newSetting: Setting = {
      id: Math.max(...settings.map(s => s.id), 0) + 1,
      ...formData,
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setSettings([newSetting, ...settings]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedSetting) return;

    const updatedSettings = settings.map((setting) =>
      setting.id === selectedSetting.id
        ? {
            ...setting,
            ...formData,
            lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
          }
        : setting
    );
    setSettings(updatedSettings);
    setIsEditDialogOpen(false);
    setSelectedSetting(null);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    setSettings(settings.filter((setting) => setting.id !== id));
  };

  const openEditDialog = (setting: Setting) => {
    setSelectedSetting(setting);
    setFormData({
      name: setting.name,
      value: setting.value,
      category: setting.category,
      description: setting.description,
    });
    setIsEditDialogOpen(true);
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "Security":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "Notifications":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "Integration":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "General":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8" />
            System Settings
          </h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Setting
          </Button>
        </div>

        {/* Settings List Card */}
        <Card>
          <CardHeader>
            <CardTitle>Settings List</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, category, or value..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredSettings.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No settings found</h3>
                <p className="text-muted-foreground mb-4">
                  {settings.length === 0
                    ? "Get started by adding your first setting."
                    : "Try adjusting your search terms."}
                </p>
                {settings.length === 0 && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Setting
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Setting Name</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSettings.map((setting) => (
                      <TableRow key={setting.id}>
                        <TableCell className="font-medium">{setting.name}</TableCell>
                        <TableCell className="text-muted-foreground">{setting.value}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getCategoryBadgeStyle(
                              setting.category
                            )}`}
                          >
                            {setting.category}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-muted-foreground" title={setting.description}>
                            {setting.description}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {setting.lastUpdated}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditDialog(setting)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(setting.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <SettingDialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}
          mode="add"
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleAdd}
        />

        {/* Edit Dialog */}
        <SettingDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setSelectedSetting(null);
              resetForm();
            }
          }}
          mode="edit"
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleEdit}
        />
      </div>
    </div>
  );
}

