import type { Metadata } from "next";
import { BASE_STUDIOS } from "@/data/studios";
import { StudioDetailClient } from "./studio-detail-client";

export async function generateStaticParams() {
  return BASE_STUDIOS.map((studio) => ({ id: studio.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/studios/[id]">): Promise<Metadata> {
  const { id } = await params;
  const studio = BASE_STUDIOS.find((item) => item.id === id);

  if (!studio) {
    return { title: "Studio" };
  }

  return {
    title: studio.title,
    description: studio.shortDescription,
  };
}

export default async function StudioDetailsPage({
  params,
}: PageProps<"/studios/[id]">) {
  const { id } = await params;
  return <StudioDetailClient id={id} />;
}
