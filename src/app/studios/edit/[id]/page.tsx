import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

import type { Studio } from "@/lib/types";
import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { EditStudioClient } from "./edit-studio-client";

export const metadata: Metadata = {
  title: "Edit Studio",
  description: "Update your Srijon Space listing.",
};

export const instant = false;

async function getStudio(id: string): Promise<Studio | null> {
  const token = await getTokenFromServer();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/studios/${id}`,
    {
      cache: "no-store",
      headers: { authorization: `Bearer ${token}` },
    },
  ).catch(() => null);
  if (!response || !response.ok) return null;

  const data = await response.json();
  return data?._id ? (data as Studio) : null;
}

async function EditStudioSection({ id }: { id: string }) {
  const [studio, session] = await Promise.all([
    getStudio(id),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!studio || !session || studio.ownerEmail !== session.user.email) {
    redirect("/my-listings");
  }

  return <EditStudioClient id={id} studio={studio} />;
}

function EditStudioFallback() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      {[0, 1, 2, 3].map((section) => (
        <div
          key={section}
          className="rounded-2xl border border-line bg-paper p-6 sm:p-7"
        >
          <Skeleton className="h-6 w-44" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function EditStudioPage({
  params,
}: PageProps<"/studios/edit/[id]">) {
  const { id } = await params;
  return (
    <Suspense fallback={<EditStudioFallback />}>
      <EditStudioSection id={id} />
    </Suspense>
  );
}
