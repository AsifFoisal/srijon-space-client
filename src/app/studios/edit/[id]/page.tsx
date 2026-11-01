import type { Metadata } from "next";
import { EditStudioClient } from "./edit-studio-client";

export const metadata: Metadata = {
  title: "Edit Studio",
  description: "Update your Srijon Space listing.",
};

// Studio ids are dynamic Mongo ObjectIds, so this route renders on demand.
export const instant = false;

export default async function EditStudioPage({
  params,
}: PageProps<"/studios/edit/[id]">) {
  const { id } = await params;
  return <EditStudioClient id={id} />;
}
