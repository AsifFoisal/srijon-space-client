"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

const FALLBACK_IMAGE = "/images/studios/daylight-loft.jpg";

export function SmartImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const safeSrc = !src || failed ? FALLBACK_IMAGE : src;
  const isLocal = safeSrc.startsWith("/");

  if (isLocal) {
    return (
      <Image
        src={safeSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : (width ?? 1200)}
        height={fill ? undefined : (height ?? 800)}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  if (fill) {
    return (
      <img
        src={safeSrc}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <img
      src={safeSrc}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      className={className}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
