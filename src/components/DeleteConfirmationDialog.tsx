import { Dialog } from "@headlessui/react";
import { SNAP_RED } from "../constants";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-base font-medium text-zinc-800">
            {title}
          </Dialog.Title>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-md px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md px-3 py-1 text-sm font-medium text-white hover:brightness-95"
              style={{ backgroundColor: SNAP_RED }}
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 