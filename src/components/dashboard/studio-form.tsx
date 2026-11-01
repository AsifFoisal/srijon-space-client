"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { AMENITIES, STUDIO_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";

const initialForm = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  capacity: "",
  address: "",
  description: "",
};

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

export function StudioForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  function toggleAmenity(amenity: string) {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity));
    } else {
      setAmenities(amenities.concat(amenity));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const images = imageUrls.map((url) => url.trim()).filter(Boolean);

    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/add-studio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            imageUrl: images[0] ?? "",
            images,
            amenities: amenities,
            ownerEmail: user ? user.email : "",
            ownerName: user ? user.name : "",
          }),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(result?.message || "Failed to add studio.");
        return;
      }

      toast.success("Studio added successfully!");
      router.push("/my-listings");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        index={1}
        title="Host details"
        description="These details come from your logged-in account."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Your name"
            value={user ? user.name : ""}
            readOnly
          />

          <Input
            label="Your email"
            type="email"
            value={user ? user.email : ""}
            readOnly
          />
        </div>
      </FormSection>

      <FormSection
        index={2}
        title="Studio information"
        description="Add a title, category, and description for your studio."
      >
        <div className="grid gap-4">
          <Input
            label="Studio title"
            placeholder="e.g. The Daylight Loft"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            required
          />

          <Select
            label="Category"
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>

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
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            required
          />
        </div>
      </FormSection>

      <FormSection
        index={3}
        title="Pricing & capacity"
        description="Set your hourly rate, security deposit, and maximum capacity."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Hourly rate ($)"
            type="number"
            min="1"
            placeholder="85"
            value={form.hourlyRate}
            onChange={(event) => update("hourlyRate", event.target.value)}
            required
          />

          <Input
            label="Security deposit ($)"
            type="number"
            min="0"
            placeholder="150"
            value={form.securityDeposit}
            onChange={(event) =>
              update("securityDeposit", event.target.value)
            }
            required
          />

          <Input
            label="Maximum capacity"
            type="number"
            min="1"
            placeholder="8"
            value={form.capacity}
            onChange={(event) => update("capacity", event.target.value)}
            required
          />
        </div>
      </FormSection>

      <FormSection
        index={4}
        title="Location & images"
        description="Add your studio address and image URLs. The first image is the cover."
      >
        <div className="grid gap-4">
          <Input
            label="Location / Address"
            placeholder="64 Wythe Ave, Brooklyn, NY"
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
            required
          />

          <div className="grid gap-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-end gap-2">
                <Input
                  label={
                    index === 0 ? "Cover image URL" : `Image ${index + 1} URL`
                  }
                  type="url"
                  placeholder="https://example.com/studio.jpg"
                  value={url}
                  onChange={(event) =>
                    setImageUrls((current) =>
                      current.map((item, i) =>
                        i === index ? event.target.value : item,
                      ),
                    )
                  }
                  required={index === 0}
                  containerClassName="flex-1"
                />

                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrls((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                    aria-label={`Remove image ${index + 1}`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-stone transition-colors hover:border-accent hover:text-accent"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setImageUrls((current) => current.concat(""))}
              className="justify-self-start text-[13px] font-medium text-ink transition-colors hover:text-accent"
            >
              + Add another image
            </button>
          </div>
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
          loadingText="Adding studio..."
          disabled={isSubmitting}
        >
          Add Studio
          <ArrowUpRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
