import type { Metadata } from "next";
import { BASE_STUDIOS } from "@/data/studios";
import { EditStudioClient } from "./edit-studio-client";

export const metadata: Metadata = {
  title: "Edit Studio",
  description: "Update your Srijon Space listing.",
};

export async function generateStaticParams() {
  return BASE_STUDIOS.map((studio) => ({ id: studio.id }));
}

export default async function EditStudioPage({
  params,
}: PageProps<"/studios/edit/[id]">) {
  const { id } = await params;
  return <EditStudioClient id={id} />;
}
