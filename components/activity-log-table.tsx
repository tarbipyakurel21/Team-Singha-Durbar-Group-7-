import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ActivityLog {
  id: number;
  action: string;
  user: string;
  details: string;
  timestamp: string;
}

interface ActivityLogTableProps {
  activities: ActivityLog[];
}

export function ActivityLogTable({ activities }: ActivityLogTableProps) {
  const getActionBadgeStyle = (action: string) => {
    if (action.toLowerCase().includes("add") || action.toLowerCase().includes("create")) {
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    }
    if (action.toLowerCase().includes("update") || action.toLowerCase().includes("edit")) {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    }
    if (action.toLowerCase().includes("delete") || action.toLowerCase().includes("remove")) {
      return "bg-destructive/10 text-destructive";
    }
    return "bg-muted text-muted-foreground";
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No activity found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-mono text-sm">{activity.timestamp}</TableCell>
              <TableCell className="font-medium">{activity.user}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getActionBadgeStyle(activity.action)}`}>
                  {activity.action}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{activity.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

