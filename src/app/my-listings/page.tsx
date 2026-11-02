"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, PencilLine, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { EmptyState } from "@/components/ui/empty-state";
import { SmartImage } from "@/components/ui/smart-image";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonStyles } from "@/components/ui/button";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { formatCurrency } from "@/lib/utils";

interface StudioListing {
  _id: string;
  title: string;
  category: string;
  hourlyRate: string | number;
  capacity: string | number;
  address: string;
  imageUrl: string;
  description: string;
  amenities?: string[];
}

function MyListingsContent() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<StudioListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<StudioListing | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const token = await getTokenFromClient();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-studios/${user.email}`,
        {
          cache: "no-store",
          headers: { authorization: `Bearer ${token}` },
        },
      ).catch(() => null);
      if (!response || !response.ok) {
        setStudios([]);
        setLoading(false);
        return;
      }

      const data = await response.json().catch(() => null);
      setStudios(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    load();
  }, [user]);

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const token = await getTokenFromClient();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-studios/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete studio.");
      }

      setStudios((current) =>
        current.filter((studio) => studio._id !== deleteTarget._id),
      );
      toast.success("Studio deleted successfully!");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete studio.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
      <DashboardPageHeader
        kicker="For hosts"
        title="My Studio Listings"
        description="The studios you have added to Srijon Space."
        action={
          <Link href="/add-studio" className={buttonStyles()}>
            <PlusCircle className="size-4" aria-hidden="true" />
            Add New Studio
          </Link>
        }
      />

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-line bg-paper"
              >
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : studios.length === 0 ? (
          <EmptyState
            icon={<Building2 className="size-6" aria-hidden="true" />}
            title="You Haven't Listed a Studio Yet."
            description="Add your first studio and it will appear here."
          >
            <Link href="/add-studio" className={buttonStyles()}>
              <PlusCircle className="size-4" aria-hidden="true" />
              Add Your First Studio
            </Link>
          </EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper"
              >
                <div className="relative aspect-[4/3] bg-sand">
                  <SmartImage
                    src={studio.imageUrl || ""}
                    alt={studio.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone">
                    {studio.category}
                  </p>

                  <h2 className="mt-2 font-display text-2xl leading-tight tracking-[-0.03em]">
                    {studio.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-stone">
                    {studio.address}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone">
                    {studio.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-line/70 pt-4 text-sm">
                    <span className="font-medium text-ink">
                      {formatCurrency(Number(studio.hourlyRate))}/hr
                    </span>
                    <span className="text-stone">
                      Up to {studio.capacity} guests
                    </span>
                  </div>

                  {studio.amenities && studio.amenities.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {studio.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-sand px-2.5 py-1 text-[11px] text-stone"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-auto flex gap-2 border-t border-line/70 pt-4">
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className={buttonStyles({
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                      })}
                    >
                      <PencilLine className="size-3.5" aria-hidden="true" />
                      Update
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(studio)}
                      className={buttonStyles({
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                      })}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete This Studio?"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        confirmLabel="Delete Studio"
        loadingLabel="Deleting..."
        loading={deleting}
      >
        {deleteTarget ? (
          <div className="flex items-center gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-sand">
              <SmartImage
                src={deleteTarget.imageUrl || ""}
                alt={deleteTarget.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {deleteTarget.title}
              </p>
              <p className="mt-0.5 text-xs text-stone">
                {deleteTarget.category} · {deleteTarget.address}
              </p>
            </div>
          </div>
        ) : null}
      </ConfirmModal>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <MyListingsContent />
    </RequireAuth>
  );
}
