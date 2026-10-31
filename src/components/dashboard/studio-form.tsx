"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowUpRight,
  Check,
  ImageIcon,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { Amenity, Studio, StudioCategory, StudioDraft } from "@/lib/types";
import { AMENITIES, STUDIO_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";
import { useMarketplace } from "@/context/marketplace-context";
import { Avatar } from "@/components/ui/avatar";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SmartImage } from "@/components/ui/smart-image";
import { cn, isValidUrl } from "@/lib/utils";

interface StudioFormValues {
  title: string;
  category: StudioCategory;
  description: string;
  hourlyRate: number | undefined;
  securityDeposit: number | undefined;
  capacity: number | undefined;
  address: string;
  city: string;
  mainImage: string;
  galleryText: string;
  amenities: Amenity[];
}

function parseGallery(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function FormSection({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs text-ivory">
          {String(index).padStart(2, "0")}
        </span>
        <div>
          <h2 className="font-display text-xl tracking-[-0.03em]">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-stone">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function StudioForm({
  mode,
  studio,
}: {
  mode: "create" | "edit";
  studio?: Studio;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { addStudio, editStudio } = useMarketplace();
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const defaults: StudioFormValues = studio
    ? {
        title: studio.title,
        category: studio.category,
        description: studio.description,
        hourlyRate: studio.hourlyRate,
        securityDeposit: studio.securityDeposit,
        capacity: studio.capacity,
        address: studio.address,
        city: studio.city,
        mainImage: studio.mainImage,
        galleryText: studio.gallery.join("\n"),
        amenities: studio.amenities,
      }
    : {
        title: "",
        category: "Photo Studio",
        description: "",
        hourlyRate: undefined,
        securityDeposit: undefined,
        capacity: undefined,
        address: "",
        city: "",
        mainImage: "",
        galleryText: "",
        amenities: [],
      };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudioFormValues>({ defaultValues: defaults });

  const mainImage = watch("mainImage");
  const galleryText = watch("galleryText") ?? "";
  const amenities = watch("amenities") ?? [];

  useEffect(() => {
    setGalleryPreviews(
      parseGallery(galleryText)
        .filter((image) => image.startsWith("/") || isValidUrl(image))
        .slice(0, 4),
    );
  }, [galleryText]);

  function toggleAmenity(amenity: Amenity) {
    setValue(
      "amenities",
      amenities.includes(amenity)
        ? amenities.filter((item) => item !== amenity)
        : [...amenities, amenity],
      { shouldDirty: true },
    );
  }

  async function onSubmit(values: StudioFormValues) {
    if (!user) {
      toast.error("You need to be signed in to manage listings.");
      return;
    }

    const draft: StudioDraft = {
      title: values.title,
      category: values.category,
      description: values.description,
      hourlyRate: Number(values.hourlyRate),
      securityDeposit: Number(values.securityDeposit),
      capacity: Number(values.capacity),
      address: values.address,
      city: values.city,
      mainImage: values.mainImage,
      gallery: parseGallery(values.galleryText),
      amenities: values.amenities,
    };

    try {
      if (mode === "edit" && studio) {
        await editStudio(studio.id, draft, user);
        toast.success("Listing updated. Your changes are live.");
      } else {
        await addStudio(draft, user);
        toast.success("Studio added. It's now live in your listings.");
      }
      router.push("/my-listings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We couldn't save this listing. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <FormSection
        index={1}
        title="Studio information"
        description="The essentials creators see first — a clear title, the right category, and a detailed overview."
      >
        <div className="grid gap-4">
          <Input
            label="Studio title"
            placeholder="e.g. The Daylight Loft"
            error={errors.title?.message}
            {...register("title", {
              required: "Give your studio a title.",
              minLength: {
                value: 3,
                message: "The title should be at least 3 characters.",
              },
            })}
          />

          <Select
            label="Category"
            error={errors.category?.message}
            {...register("category", { required: "Choose a category." })}
          >
            {STUDIO_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.value}
              </option>
            ))}
          </Select>

          <Textarea
            label="Detailed overview"
            placeholder="Describe the space, the light, the equipment, the neighbourhood, and what makes it special."
            hint="At least 40 characters. This is where creators decide whether the space fits."
            className="min-h-36"
            error={errors.description?.message}
            {...register("description", {
              required: "Write a short overview of the space.",
              minLength: {
                value: 40,
                message: "Add a little more detail — at least 40 characters.",
              },
            })}
          />
        </div>
      </FormSection>

      <FormSection
        index={2}
        title="Pricing & capacity"
        description="Transparent pricing builds trust. The deposit is held separately from the hourly rate."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Hourly rate ($)"
            type="number"
            min={1}
            step={1}
            placeholder="85"
            error={errors.hourlyRate?.message}
            {...register("hourlyRate", {
              required: "Set an hourly rate.",
              valueAsNumber: true,
              min: { value: 1, message: "The rate must be at least $1." },
            })}
          />
          <Input
            label="Security deposit ($)"
            type="number"
            min={0}
            step={1}
            placeholder="150"
            error={errors.securityDeposit?.message}
            {...register("securityDeposit", {
              required: "Set a security deposit (0 is allowed).",
              valueAsNumber: true,
              min: { value: 0, message: "The deposit can't be negative." },
            })}
          />
          <Input
            label="Maximum capacity"
            type="number"
            min={1}
            step={1}
            placeholder="8"
            error={errors.capacity?.message}
            {...register("capacity", {
              required: "Set the maximum capacity.",
              valueAsNumber: true,
              min: { value: 1, message: "Capacity must be at least 1." },
            })}
          />
        </div>
      </FormSection>

      <FormSection
        index={3}
        title="Location"
        description="Creators filter by neighbourhood, so keep this precise and easy to scan."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full address"
            placeholder="64 Wythe Ave, Brooklyn, NY 11249"
            error={errors.address?.message}
            {...register("address", {
              required: "Add the studio address.",
            })}
          />
          <Input
            label="City or area"
            placeholder="Brooklyn, NY"
            error={errors.city?.message}
            {...register("city", {
              required: "Add the city or neighbourhood.",
            })}
          />
        </div>
      </FormSection>

      <FormSection
        index={4}
        title="Studio imagery"
        description="Paste direct image URLs. The main image appears on cards; gallery images fill the listing page."
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <Input
              label="Main image URL"
              placeholder="https://images.example.com/studio.jpg"
              error={errors.mainImage?.message}
              {...register("mainImage", {
                required: "Add a main image URL.",
                validate: (value) =>
                  value.startsWith("/") ||
                  isValidUrl(value) ||
                  "Enter a valid image URL starting with http or https.",
              })}
            />

            <Textarea
              label="Gallery image URLs (optional)"
              placeholder={"https://images.example.com/one.jpg\nhttps://images.example.com/two.jpg"}
              hint="One URL per line, up to 5 images."
              className="min-h-28"
              error={errors.galleryText?.message}
              {...register("galleryText", {
                validate: (value) => {
                  const images = parseGallery(value);
                  if (images.length > 5) {
                    return "Add no more than 5 gallery images.";
                  }
                  const invalid = images.find(
                    (image) =>
                      !image.startsWith("/") && !isValidUrl(image),
                  );
                  return invalid
                    ? "Every gallery line needs a valid http(s) image URL."
                    : true;
                },
              })}
            />

            <p className="rounded-lg bg-ivory px-3 py-2 text-[11px] leading-5 text-stone">
              This form is built for a future image-upload integration. For
              now, direct URLs and live previews keep the demo simple.
            </p>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-ink">
              Image preview
            </p>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-sand">
              {mainImage &&
              (mainImage.startsWith("/") || isValidUrl(mainImage)) ? (
                <SmartImage
                  src={mainImage}
                  alt="Main studio image preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-stone">
                  <ImageIcon className="size-7" aria-hidden="true" />
                  <p className="text-xs">
                    Paste a main image URL to preview it
                  </p>
                </div>
              )}
            </div>

            {galleryPreviews.length > 0 ? (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {galleryPreviews.map((image) => (
                  <div
                    key={image}
                    className="relative aspect-square overflow-hidden rounded-lg border border-line bg-sand"
                  >
                    <SmartImage
                      src={image}
                      alt="Gallery preview"
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </FormSection>

      <FormSection
        index={5}
        title="Amenities"
        description="Select everything included in the booking. These power the marketplace filters."
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {AMENITIES.map((amenity) => {
            const selected = amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                aria-pressed={selected}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-[13px] transition-colors",
                  selected
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-paper text-stone hover:border-ink/30 hover:text-ink",
                )}
              >
                {amenity}
                {selected ? (
                  <Check className="size-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <span className="size-3.5 shrink-0 rounded-full border border-current opacity-30" />
                )}
              </button>
            );
          })}
        </div>
      </FormSection>

      <FormSection
        index={6}
        title="Host information"
        description="These details come from your profile and stay read-only in this demo."
      >
        <div className="flex flex-col gap-5 rounded-xl border border-line bg-ivory p-5 sm:flex-row sm:items-center">
          <Avatar
            src={user?.avatar}
            name={user?.name ?? "StudioSpace host"}
            size={56}
          />
          <div className="flex-1">
            <p className="font-medium text-ink">
              {user?.name ?? "StudioSpace host"}
            </p>
            <p className="mt-0.5 text-sm text-stone">
              {user?.email ?? "host@studiospace.com"}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[11px] text-stone">
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            Profile managed in settings
          </span>
        </div>
      </FormSection>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-stone">
          {mode === "edit"
            ? "Saving updates keeps your rating, reviews, and booking history intact."
            : "Your listing goes live immediately after you add it."}
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset(defaults);
              setGalleryPreviews([]);
              toast.info("Form reset to your last saved values.");
            }}
            disabled={isSubmitting}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
          <Link
            href="/my-listings"
            className={buttonStyles({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            loading={isSubmitting}
            loadingText={mode === "edit" ? "Saving…" : "Adding studio…"}
          >
            {mode === "edit" ? "Save Changes" : "Add Studio"}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isSubmitting ? (
        <p className="flex items-center gap-2 text-xs text-stone">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          Publishing your space…
        </p>
      ) : null}
    </form>
  );
}
