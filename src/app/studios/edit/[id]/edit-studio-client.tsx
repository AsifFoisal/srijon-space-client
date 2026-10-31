"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useMarketplace } from "@/context/marketplace-context";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EditStudioForm } from "@/components/dashboard/edit-studio-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";

function EditStudioContent({ id }: { id: string }) {
  const { user } = useAuth();
  const { getStudio, isReady } = useMarketplace();
  const studio = getStudio(id);

  if (!isReady) {
    return (
      <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-4 h-12 w-2/3 max-w-md" />
        <Skeleton className="mt-4 h-4 w-full max-w-lg" />
        <div className="mt-8 space-y-6">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="shell shell-wide pb-20 pt-32">
        <EmptyState
          icon={<Building2 className="size-6" aria-hidden="true" />}
          title="Listing not found."
          description="This listing may have been deleted, or the link is incorrect. Head back to your listings to pick another space to edit."
        >
          <Link href="/my-listings" className={buttonStyles()}>
            Back to My Listings
          </Link>
          <Link href="/dashboard" className={buttonStyles({ variant: "outline" })}>
            Go to Dashboard
          </Link>
        </EmptyState>
      </div>
    );
  }

  if (
    !user ||
    studio.ownerEmail.toLowerCase() !== user.email.toLowerCase()
  ) {
    return (
      <div className="shell shell-wide pb-20 pt-32">
        <EmptyState
          icon={<Building2 className="size-6" aria-hidden="true" />}
          title="You can only edit your own listings."
          description="This studio belongs to another host. If you think this is a mistake, get in touch with our support team."
        >
          <Link href="/my-listings" className={buttonStyles()}>
            View My Listings
          </Link>
          <Link href="/studios" className={buttonStyles({ variant: "outline" })}>
            Explore Studios
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
      <DashboardPageHeader
        kicker="For hosts"
        title="Edit Your Studio"
        description={`Update the details for ${studio.title}. Changes go live as soon as you save.`}
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
        <EditStudioForm mode="edit" studio={studio} />
      </div>
    </div>
  );
}

export function EditStudioClient({ id }: { id: string }) {
  return (
    <RequireAuth>
      <EditStudioContent id={id} />
    </RequireAuth>
  );
}
