import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  formData: {
    name: string;
    value: string;
    category: string;
    description: string;
  };
  onFormChange: (data: { name: string; value: string; category: string; description: string }) => void;
  onSubmit: () => void;
}

export function SettingDialog({
  open,
  onOpenChange,
  mode,
  formData,
  onFormChange,
  onSubmit,
}: SettingDialogProps) {
  const isValid = formData.name.trim() && formData.value.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Setting" : "Edit Setting"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Enter the setting information to add."
              : "Update the selected setting information."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-name`}>Setting Name *</Label>
            <Input
              id={`${mode}-name`}
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              placeholder="e.g., Company Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-value`}>Value *</Label>
            <Input
              id={`${mode}-value`}
              value={formData.value}
              onChange={(e) => onFormChange({ ...formData, value: e.target.value })}
              placeholder="e.g., Acme Corporation"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-category`}>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => onFormChange({ ...formData, category: value })}
            >
              <SelectTrigger id={`${mode}-category`}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Notifications">Notifications</SelectItem>
                <SelectItem value="Integration">Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-description`}>Description</Label>
            <Textarea
              id={`${mode}-description`}
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              placeholder="Describe what this setting controls..."
              rows={3}
            />
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

