import { BASE_BOOKINGS } from "@/data/bookings";
import { BASE_STUDIOS } from "@/data/studios";
import { BASE_REVIEWS } from "@/data/reviews";
import { readJSON, STORAGE_KEYS, writeJSON } from "@/lib/storage";
import type {
  AuthUser,
  Booking,
  BookingDraft,
  BookingStatus,
  Review,
  Studio,
  StudioDraft,
} from "@/lib/types";
import { durationInHours, generateId, slugify } from "@/lib/utils";

function loadStudios(): Studio[] {
  const stored = readJSON<Studio[] | null>(STORAGE_KEYS.studios, null);
  if (stored) return stored;
  writeJSON(STORAGE_KEYS.studios, BASE_STUDIOS);
  return BASE_STUDIOS;
}

function loadBookings(): Booking[] {
  const stored = readJSON<Booking[] | null>(STORAGE_KEYS.bookings, null);
  if (stored) return stored;
  writeJSON(STORAGE_KEYS.bookings, BASE_BOOKINGS);
  return BASE_BOOKINGS;
}

export async function fetchStudios(): Promise<Studio[]> {
    return loadStudios();
}

export async function fetchBookings(): Promise<Booking[]> {
    return loadBookings();
}

export async function fetchFavorites(): Promise<string[]> {
    return readJSON<string[]>(STORAGE_KEYS.favorites, []);
}

export function saveFavorites(favorites: string[]) {
  writeJSON(STORAGE_KEYS.favorites, favorites);
}

export function fetchReviews(studioId: string): Review[] {
  return BASE_REVIEWS.filter((review) => review.studioId === studioId);
}

export async function createStudio(
  draft: StudioDraft,
  user: AuthUser,
): Promise<Studio> {
    const studios = loadStudios();
  const baseId = slugify(draft.title) || "studio";
  let id = baseId;
  let suffix = 2;
  while (studios.some((studio) => studio.id === id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  const description = draft.description.trim();
  const city = draft.city.trim();
  const studio: Studio = {
    id,
    title: draft.title.trim(),
    category: draft.category,
    hourlyRate: Number(draft.hourlyRate),
    securityDeposit: Number(draft.securityDeposit),
    capacity: Number(draft.capacity),
    location: city,
    city,
    address: draft.address.trim(),
    shortDescription:
      description.length > 140 ? `${description.slice(0, 137)}…` : description,
    description,
    mainImage: draft.mainImage.trim(),
    gallery: draft.gallery.map((image) => image.trim()).filter(Boolean),
    amenities: draft.amenities,
    rating: 0,
    reviewCount: 0,
    host: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      memberSince: user.memberSince,
      verified: false,
      bio: `${user.name.split(" ")[0]} is a new Srijon Space host, opening a space built for creative work.`,
    },
    ownerEmail: user.email,
    status: "Active",
    featured: false,
    createdAt: new Date().toISOString(),
    availableDays: [0, 1, 2, 3, 4, 5, 6],
    openTime: "08:00",
    closeTime: "22:00",
    specs: [
      { label: "Capacity", value: `${draft.capacity} guests` },
      { label: "Category", value: draft.category },
      { label: "Location", value: city },
    ],
    squareFeet: 0,
  };

  writeJSON(STORAGE_KEYS.studios, [studio, ...studios]);
  return studio;
}

export async function updateStudio(
  id: string,
  draft: StudioDraft,
  user: AuthUser,
): Promise<Studio> {
    const studios = loadStudios();
  const existing = studios.find((studio) => studio.id === id);

  if (!existing) {
    throw new Error("This listing could not be found.");
  }

  if (existing.ownerEmail.toLowerCase() !== user.email.toLowerCase()) {
    throw new Error("You can only update your own listings.");
  }

  const description = draft.description.trim();
  const city = draft.city.trim();
  const updated: Studio = {
    ...existing,
    title: draft.title.trim(),
    category: draft.category,
    hourlyRate: Number(draft.hourlyRate),
    securityDeposit: Number(draft.securityDeposit),
    capacity: Number(draft.capacity),
    location: city,
    city,
    address: draft.address.trim(),
    shortDescription:
      description.length > 140 ? `${description.slice(0, 137)}…` : description,
    description,
    mainImage: draft.mainImage.trim(),
    gallery: draft.gallery.map((image) => image.trim()).filter(Boolean),
    amenities: draft.amenities,
  };

  const next = studios.map((studio) => (studio.id === id ? updated : studio));
  writeJSON(STORAGE_KEYS.studios, next);
  return updated;
}

export async function deleteStudio(id: string, user: AuthUser) {
    const studios = loadStudios();
  const existing = studios.find((studio) => studio.id === id);

  if (!existing) {
    throw new Error("This listing could not be found.");
  }

  if (existing.ownerEmail.toLowerCase() !== user.email.toLowerCase()) {
    throw new Error("You can only delete your own listings.");
  }

  writeJSON(
    STORAGE_KEYS.studios,
    studios.filter((studio) => studio.id !== id),
  );
}

export async function createBooking(
  studio: Studio,
  draft: BookingDraft,
  user: AuthUser,
): Promise<Booking> {
    const duration = durationInHours(draft.startTime, draft.endTime);

  if (duration <= 0) {
    throw new Error("Please choose an end time after your start time.");
  }

  if (draft.attendees > studio.capacity) {
    throw new Error(
      `This studio hosts up to ${studio.capacity} guests per booking.`,
    );
  }

  const subtotal = Math.round(studio.hourlyRate * duration * 100) / 100;
  const booking: Booking = {
    id: generateId("BK"),
    studioId: studio.id,
    studioTitle: studio.title,
    studioImage: studio.mainImage,
    category: studio.category,
    location: studio.location,
    userEmail: user.email,
    userName: user.name,
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    durationHours: duration,
    attendees: draft.attendees,
    projectDescription: draft.projectDescription?.trim() || undefined,
    hourlyRate: studio.hourlyRate,
    subtotal,
    securityDeposit: studio.securityDeposit,
    total: Math.round((subtotal + studio.securityDeposit) * 100) / 100,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  writeJSON(STORAGE_KEYS.bookings, [booking, ...loadBookings()]);
  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<Booking> {
    const bookings = loadBookings();
  const existing = bookings.find((booking) => booking.id === id);

  if (!existing) {
    throw new Error("This booking could not be found.");
  }

  const updated: Booking = { ...existing, status };
  writeJSON(
    STORAGE_KEYS.bookings,
    bookings.map((booking) => (booking.id === id ? updated : booking)),
  );
  return updated;
}
