"use client";

import { useId, useState } from "react";
import { MapPin, Search, Star, Users } from "lucide-react";
import type { Amenity, Filters, StudioCategory } from "@/lib/types";
import {
  AMENITIES,
  CATEGORY_VALUES,
  MAX_PRICE,
  MIN_PRICE,
  RATING_OPTIONS,
  TIME_OPTIONS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { CheckboxField, Input, Select } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn, formatTimeLabel, todayISO } from "@/lib/utils";

const DEFAULT_AMENITY_COUNT = 6;

function PriceRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  return (
    <div>
      <Slider
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={5}
        value={[min, max]}
        thumbLabels={["Minimum hourly price", "Maximum hourly price"]}
        onValueChange={([nextMin, nextMax]) =>
          onChange(Math.min(nextMin, nextMax - 5), Math.max(nextMax, nextMin + 5))
        }
      />

      <div className="mt-3 flex items-center gap-2.5">
        <div className="flex h-10 flex-1 items-center gap-1 rounded-lg border border-line bg-paper px-3">
          <span className="text-xs text-stone">$</span>
          <input
            type="number"
            min={MIN_PRICE}
            max={max - 5}
            value={min}
            onChange={(event) =>
              onChange(
                Math.min(
                  Math.max(Number(event.target.value) || 0, MIN_PRICE),
                  max - 5,
                ),
                max,
              )
            }
            aria-label="Minimum price"
            className="w-full bg-transparent text-sm text-ink outline-none"
          />
        </div>
        <span className="text-xs text-stone" aria-hidden="true">
          —
        </span>
        <div className="flex h-10 flex-1 items-center gap-1 rounded-lg border border-line bg-paper px-3">
          <span className="text-xs text-stone">$</span>
          <input
            type="number"
            min={min + 5}
            max={MAX_PRICE}
            value={max}
            onChange={(event) =>
              onChange(
                min,
                Math.max(
                  Math.min(Number(event.target.value) || 0, MAX_PRICE),
                  min + 5,
                ),
              )
            }
            aria-label="Maximum price"
            className="w-full bg-transparent text-sm text-ink outline-none"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-stone">
        {max >= MAX_PRICE ? "Any hourly rate" : `$${min} – $${max} per hour`}
      </p>
    </div>
  );
}

export function FilterPanel({
  value,
  onChange,
  onApply,
  onClear,
  resultCount,
  hideHeader = false,
}: {
  value: Filters;
  onChange: (next: Filters) => void;
  onApply: () => void;
  onClear: () => void;
  resultCount: number;
  hideHeader?: boolean;
}) {
  const uid = useId();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const amenities = showAllAmenities
    ? AMENITIES
    : AMENITIES.slice(0, DEFAULT_AMENITY_COUNT);
  const categoryName = `category-${uid}`;
  const ratingName = `rating-${uid}`;

  function patch(next: Partial<Filters>) {
    onChange({ ...value, ...next });
  }

  function toggleAmenity(amenity: Amenity, checked: boolean) {
    patch({
      amenities: checked
        ? [...value.amenities, amenity]
        : value.amenities.filter((item) => item !== amenity),
    });
  }

  return (
    <div className="divide-y divide-line/70">
      {!hideHeader ? (
        <div className="flex items-center justify-between gap-3 pb-4">
          <h2 className="font-display text-lg tracking-[-0.03em]">Filters</h2>
          <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-ink">
            {resultCount} match{resultCount === 1 ? "" : "es"}
          </span>
        </div>
      ) : null}

      <div className="space-y-6 py-5">
        <Input
          label="Search"
          icon={<Search className="size-4" />}
          placeholder="Studio, keyword, or vibe"
          value={value.search}
          onChange={(event) => patch({ search: event.target.value })}
        />

        <fieldset>
          <legend className="mb-2 block text-[13px] font-medium text-ink">
            Category
          </legend>
          <div className="space-y-1">
            {(["All Categories", ...CATEGORY_VALUES] as const).map(
              (category) => (
                <label
                  key={category}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    value.category === category
                      ? "bg-accent-soft/70 text-ink"
                      : "text-stone hover:bg-sand/50 hover:text-ink",
                  )}
                >
                  <span>{category}</span>
                  <input
                    type="radio"
                    name={categoryName}
                    value={category}
                    checked={value.category === category}
                    onChange={() =>
                      patch({
                        category: category as StudioCategory | "All Categories",
                      })
                    }
                    className="size-4 accent-[#e8491d]"
                  />
                </label>
              ),
            )}
          </div>
        </fieldset>

        <div>
          <p className="mb-3 text-[13px] font-medium text-ink">Hourly price</p>
          <PriceRange
            min={value.minPrice}
            max={value.maxPrice}
            onChange={(min, max) => patch({ minPrice: min, maxPrice: max })}
          />
        </div>

        <Input
          label="Location"
          icon={<MapPin className="size-4" />}
          placeholder="City or neighbourhood"
          value={value.location}
          onChange={(event) => patch({ location: event.target.value })}
        />

        <Input
          label="Minimum capacity"
          icon={<Users className="size-4" />}
          type="number"
          min={0}
          placeholder="Any group size"
          value={value.minCapacity || ""}
          onChange={(event) =>
            patch({ minCapacity: Math.max(0, Number(event.target.value) || 0) })
          }
        />

        <fieldset>
          <legend className="mb-2 block text-[13px] font-medium text-ink">
            Rating
          </legend>
          <div className="space-y-1">
            {RATING_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  value.rating === option.value
                    ? "bg-accent-soft/70 text-ink"
                    : "text-stone hover:bg-sand/50 hover:text-ink",
                )}
              >
                <span className="flex items-center gap-2">
                  {option.value > 0 ? (
                    <Star
                      className="size-3.5 fill-accent text-accent"
                      aria-hidden="true"
                    />
                  ) : null}
                  {option.label}
                </span>
                <input
                  type="radio"
                  name={ratingName}
                  value={option.value}
                  checked={value.rating === option.value}
                  onChange={() => patch({ rating: option.value })}
                  className="size-4 accent-[#e8491d]"
                />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 block text-[13px] font-medium text-ink">
            Amenities
          </legend>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {amenities.map((amenity) => (
              <CheckboxField
                key={amenity}
                label={amenity}
                checked={value.amenities.includes(amenity)}
                onChange={(checked) => toggleAmenity(amenity, checked)}
              />
            ))}
          </div>
          {AMENITIES.length > DEFAULT_AMENITY_COUNT ? (
            <button
              type="button"
              onClick={() => setShowAllAmenities((current) => !current)}
              className="mt-3 text-xs font-medium text-accent-deep hover:text-accent"
            >
              {showAllAmenities
                ? "Show fewer amenities"
                : `Show all ${AMENITIES.length} amenities`}
            </button>
          ) : null}
        </fieldset>

        <fieldset>
          <legend className="mb-2 block text-[13px] font-medium text-ink">
            Availability
          </legend>
          <div className="space-y-3">
            <Input
              aria-label="Preferred date"
              type="date"
              min={todayISO()}
              value={value.date}
              onChange={(event) => patch({ date: event.target.value })}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <Select
                aria-label="Start time"
                value={value.startTime}
                onChange={(event) => patch({ startTime: event.target.value })}
              >
                <option value="">Start: any</option>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {formatTimeLabel(time)}
                  </option>
                ))}
              </Select>
              <Select
                aria-label="End time"
                value={value.endTime}
                onChange={(event) => patch({ endTime: event.target.value })}
              >
                <option value="">End: any</option>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {formatTimeLabel(time)}
                  </option>
                ))}
              </Select>
            </div>
            <p className="text-xs leading-5 text-stone">
              We&apos;ll only show spaces open on your selected day and hours.
            </p>
          </div>
        </fieldset>
      </div>

      <div className="space-y-2.5 pt-5">
        <Button className="w-full" onClick={onApply}>
          Apply Filters
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClear}>
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
