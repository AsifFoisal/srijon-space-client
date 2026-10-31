"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/input";

export function ContactHostModal({
  open,
  onClose,
  studio,
}: {
  open: boolean;
  onClose: () => void;
  studio: Studio;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) {
      setError("Add a short message before sending.");
      return;
    }

    setMessage("");
    setError("");
    onClose();
    toast.success(`Your message was sent to ${studio.host.name}.`);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Contact ${studio.host.name}`}
      description={`Ask a question about ${studio.title} before you book.`}
    >
      <form onSubmit={handleSend} noValidate>
        <Textarea
          label="Your message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (error) setError("");
          }}
          error={error}
          placeholder={`Hi ${studio.host.name.split(" ")[0]}, I'm planning a shoot and wondered…`}
          hint="Hosts usually reply within a few hours."
        />
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Send Message</Button>
        </div>
      </form>
    </Modal>
  );
}
