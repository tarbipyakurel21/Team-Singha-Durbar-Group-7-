import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  formData: {
    name: string;
    email: string;
    role: string;
    status: string;
  };
  onFormChange: (data: { name: string; email: string; role: string; status: string }) => void;
  onSubmit: () => void;
}

export function UserDialog({
  open,
  onOpenChange,
  mode,
  formData,
  onFormChange,
  onSubmit,
}: UserDialogProps) {
  const isValid = formData.name.trim() && formData.email.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add User" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Enter the user information to add."
              : "Update the selected user information."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-name`}>Name *</Label>
            <Input
              id={`${mode}-name`}
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              placeholder="Enter name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-email`}>Email *</Label>
            <Input
              id={`${mode}-email`}
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-role`}>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => onFormChange({ ...formData, role: value })}
            >
              <SelectTrigger id={`${mode}-role`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-status`}>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onFormChange({ ...formData, status: value })}
            >
              <SelectTrigger id={`${mode}-status`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!isValid}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

