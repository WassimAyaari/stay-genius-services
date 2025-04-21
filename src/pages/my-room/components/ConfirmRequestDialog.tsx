
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ItemToRequest = {
  id: string;
  name: string;
  category: string;
  description?: string;
};

type Props = {
  open: boolean;
  isSubmitting: boolean;
  item: ItemToRequest | null;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmRequestDialog: React.FC<Props> = ({
  open,
  isSubmitting,
  item,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Service Request</DialogTitle>
          <DialogDescription>
            {item ? (
              <>
                Are you sure you want to send a request for <b>{item.name}</b>?
                {item.description && (
                  <>
                    <br />
                    <span className="text-xs text-gray-500">Description: {item.description}</span>
                  </>
                )}
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmRequestDialog;
