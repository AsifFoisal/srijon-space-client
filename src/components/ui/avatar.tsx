"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

const FALLBACK_IMAGE = "/images/avatars/fallback-avatar.png";

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <img
        src={FALLBACK_IMAGE}
        alt={name}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
