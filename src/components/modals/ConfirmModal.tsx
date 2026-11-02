"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  loadingLabel = "Working…",
  loading = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  loadingLabel?: string;
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
    >
      {children ? (
        <div className="rounded-xl border border-line bg-ivory p-4">
          {children}
        </div>
      ) : null}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          loading={loading}
          loadingText={loadingLabel}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
