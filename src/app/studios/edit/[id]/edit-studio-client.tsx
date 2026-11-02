"use client";

import Link from "next/link";

import type { Studio } from "@/lib/types";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EditStudioForm } from "@/components/dashboard/edit-studio-form";
import { buttonStyles } from "@/components/ui/button";

function EditStudioContent({ id, studio }: { id: string; studio: Studio }) {
  return (
    <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
      <DashboardPageHeader
        kicker="For hosts"
        title="Edit Your Studio"
        description="Update the details for your studio. Changes go live as soon as you save."
        action={
          <Link
            href="/my-listings"
            className={buttonStyles({ variant: "outline" })}
          >
            Back to Listings
          </Link>
        }
      />
      <div className="mt-8">
        <EditStudioForm studioId={id} studio={studio} />
      </div>
    </div>
  );
}

export function EditStudioClient({ id, studio }: { id: string; studio: Studio }) {
  return <RequireAuth>
    <EditStudioContent id={id} studio={studio} />
  </RequireAuth>;
}
