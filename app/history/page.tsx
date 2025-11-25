"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ActivityLogTable } from "@/components/activity-log-table";
import { History, Search } from "lucide-react";

interface ActivityLog {
  id: number;
  action: string;
  user: string;
  details: string;
  timestamp: string;
}

// Sample data - in the future, this would come from an API
const sampleActivities: ActivityLog[] = [
  { 
    id: 1, 
    action: "Add Product", 
    user: "John Doe",
    details: "Added new product: Business Laptop",
    timestamp: "2024-03-20 10:30"
  },
  { 
    id: 2, 
    action: "Update Stock", 
    user: "Jane Smith",
    details: "Updated Wireless Mouse stock from 45 to 95 (+50 units)",
    timestamp: "2024-03-20 09:15"
  },
  { 
    id: 3, 
    action: "Delete Product", 
    user: "John Doe",
    details: "Deleted product: Old Keyboard Model",
    timestamp: "2024-03-19 15:45"
  },
  { 
    id: 4, 
    action: "Create Category", 
    user: "Admin User",
    details: "Created new category: Automotive",
    timestamp: "2024-03-19 14:20"
  },
  { 
    id: 5, 
    action: "Update Product", 
    user: "Jane Smith",
    details: "Updated Standing Desk price from $349.99 to $329.99",
    timestamp: "2024-03-19 11:30"
  },
  { 
    id: 6, 
    action: "Update Stock", 
    user: "John Doe",
    details: "Updated Business Laptop stock from 12 to 8 (-4 units)",
    timestamp: "2024-03-18 16:45"
  },
];

export default function HistoryPage() {
  const [activities] = useState<ActivityLog[]>(sampleActivities);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredActivities = activities.filter((activity) =>
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <History className="h-8 w-8" />
            Activity History
          </h1>
        </div>

        {/* Activity Log Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by action, user, or details..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ActivityLogTable activities={filteredActivities} />
            
            {activities.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Showing {filteredActivities.length} of {activities.length} activities
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Activity history is currently showing sample data. 
              In a production environment, this would track all changes made to products, 
              categories, and inventory with real user information and timestamps.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

