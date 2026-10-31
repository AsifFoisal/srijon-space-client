"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { useMarketplace } from "@/context/marketplace-context";
import { AMENITIES, STUDIO_CATEGORIES } from "@/lib/constants";
import type {
  Amenity,
  Studio,
  StudioCategory,
  StudioDraft,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";

interface EditStudioFormProps {
  mode: "create" | "edit";
  studio?: Studio;
}

interface FormSectionProps {
  index: number;
  title: string;
  description: string;
  children: ReactNode;
}

function FormSection({
  index,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs text-ivory">
          {index < 10 ? "0" + index : index}
        </span>

        <div>
          <h2 className="font-display text-xl tracking-[-0.03em]">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

export function EditStudioForm({ mode, studio }: EditStudioFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addStudio, editStudio } = useMarketplace();

  const [title, setTitle] = useState(studio ? studio.title : "");
  const [category, setCategory] = useState<StudioCategory>(
    studio ? studio.category : "Photo Studio",
  );
  const [description, setDescription] = useState(
    studio ? studio.description : "",
  );
  const [hourlyRate, setHourlyRate] = useState(
    studio ? String(studio.hourlyRate) : "",
  );
  const [securityDeposit, setSecurityDeposit] = useState(
    studio ? String(studio.securityDeposit) : "",
  );
  const [capacity, setCapacity] = useState(
    studio ? String(studio.capacity) : "",
  );
  const [address, setAddress] = useState(studio ? studio.address : "");
  const [city, setCity] = useState(studio ? studio.city : "");
  const [mainImage, setMainImage] = useState(
    studio ? studio.mainImage : "",
  );
  const [gallery, setGallery] = useState(
    studio ? studio.gallery.join("\n") : "",
  );
  const [amenities, setAmenities] = useState<Amenity[]>(
    studio ? studio.amenities : [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleAmenity(amenity: Amenity) {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity));
    } else {
      setAmenities(amenities.concat(amenity));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      toast.error("You need to be signed in to manage listings.");
      return;
    }

    setIsSubmitting(true);

    const galleryUrls: string[] = [];
    const galleryLines = gallery.split("\n");

    for (const line of galleryLines) {
      const url = line.trim();

      if (url !== "") {
        galleryUrls.push(url);
      }
    }

    const draft: StudioDraft = {
      title: title,
      category: category,
      description: description,
      hourlyRate: Number(hourlyRate),
      securityDeposit: Number(securityDeposit),
      capacity: Number(capacity),
      address: address,
      city: city,
      mainImage: mainImage,
      gallery: galleryUrls,
      amenities: amenities,
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
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("We couldn't save this listing. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        index={1}
        title="Studio information"
        description="Add a title, category, and description for your studio."
      >
        <div className="grid gap-4">
          <Input
            label="Studio title"
            placeholder="e.g. The Daylight Loft"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <Select
            label="Category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as StudioCategory)
            }
            required
          >
            {STUDIO_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </Select>

          <Textarea
            label="Detailed overview"
            placeholder="Describe your studio, equipment, lighting, and what makes it special."
            className="min-h-36"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>
      </FormSection>

      <FormSection
        index={2}
        title="Pricing & capacity"
        description="Set your hourly rate, security deposit, and maximum capacity."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Hourly rate ($)"
            type="number"
            min="1"
            placeholder="85"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(event.target.value)}
            required
          />

          <Input
            label="Security deposit ($)"
            type="number"
            min="0"
            placeholder="150"
            value={securityDeposit}
            onChange={(event) => setSecurityDeposit(event.target.value)}
            required
          />

          <Input
            label="Maximum capacity"
            type="number"
            min="1"
            placeholder="8"
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
            required
          />
        </div>
      </FormSection>

      <FormSection
        index={3}
        title="Location"
        description="Let creators know where your studio is located."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full address"
            placeholder="64 Wythe Ave, Brooklyn, NY"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          />

          <Input
            label="City or area"
            placeholder="Brooklyn, NY"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
          />
        </div>
      </FormSection>

      <FormSection
        index={4}
        title="Studio imagery"
        description="Add your main studio image and optional gallery images."
      >
        <div className="grid gap-4">
          <Input
            label="Main image URL"
            type="url"
            placeholder="https://example.com/studio.jpg"
            value={mainImage}
            onChange={(event) => setMainImage(event.target.value)}
            required
          />

          <Textarea
            label="Gallery image URLs"
            placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
            hint="Add one image URL per line."
            className="min-h-28"
            value={gallery}
            onChange={(event) => setGallery(event.target.value)}
          />
        </div>
      </FormSection>

      <FormSection
        index={5}
        title="Amenities"
        description="Select all facilities and equipment available in your studio."
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {AMENITIES.map((amenity) => {
            const selected = amenities.includes(amenity);

            let amenityClass =
              "flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-[13px] transition-colors ";

            if (selected) {
              amenityClass += "border-ink bg-ink text-ivory";
            } else {
              amenityClass +=
                "border-line bg-paper text-stone hover:border-ink/30 hover:text-ink";
            }

            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                aria-pressed={selected}
                className={amenityClass}
              >
                {amenity}

                {selected ? <Check className="size-3.5 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      </FormSection>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-stone">
          Your studio will be published after successful submission.
        </p>

        <Button
          type="submit"
          loading={isSubmitting}
          loadingText={mode === "edit" ? "Saving changes..." : "Adding studio..."}
          disabled={isSubmitting}
        >
          {mode === "edit" ? "Save Changes" : "Add Studio"}
          <ArrowUpRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
