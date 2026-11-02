"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { StudioForm } from "@/components/dashboard/StudioForm";

export default function AddStudioPage() {
  return (
    <RequireAuth>
      <div className="shell shell-wide pb-20 pt-28 sm:pt-32">
        <DashboardPageHeader
          kicker="For hosts"
          title="List Your Creative Space"
          description="Showcase your studio to creators looking for the perfect environment to bring their projects to life."
        />
        <div className="mt-8">
          <StudioForm />
        </div>
      </div>
    </RequireAuth>
  );
}
