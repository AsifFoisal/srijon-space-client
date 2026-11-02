import type { Amenity, BookingStatus, StudioCategory } from "./types";

export interface CategoryMeta {
  value: StudioCategory;
  title: string;
  description: string;
  image: string;
}

export const STUDIO_CATEGORIES: CategoryMeta[] = [
  {
    value: "Photo Studio",
    title: "Photo Studios",
    description:
      "Cyc walls, seamless backdrops, and daylight-filled lofts built for image-makers.",
    image: "/images/categories/photo.jpg",
  },
  {
    value: "Film Stage",
    title: "Film & Sound Stages",
    description:
      "Production-ready stages with rigging, green screens, and room for a full crew.",
    image: "/images/categories/film.jpg",
  },
  {
    value: "Podcast Lounge",
    title: "Podcast Rooms",
    description:
      "Acoustically treated rooms with broadcast mics and recording setups ready to go.",
    image: "/images/categories/podcast.jpg",
  },
  {
    value: "Music Suite",
    title: "Music Suites",
    description:
      "Live rooms, control rooms, and consoles tuned for serious sound work.",
    image: "/images/categories/music.jpg",
  },
  {
    value: "Art Workshop",
    title: "Art Workshops",
    description:
      "Mess-friendly, light-filled studios for painting, ceramics, printmaking, and making.",
    image: "/images/categories/art.jpg",
  },
];

export const CATEGORY_VALUES = STUDIO_CATEGORIES.map((category) => category.value);

export const AMENITIES: Amenity[] = [
  "Wi-Fi",
  "Air Conditioning",
  "Lighting Equipment",
  "Professional Cameras",
  "Soundproofing",
  "Microphones",
  "Editing Equipment",
  "Parking",
  "Kitchen",
  "Restroom",
  "Natural Lighting",
];

export const TIME_OPTIONS: string[] = (() => {
  const options: string[] = [];
  for (let minutes = 7 * 60; minutes <= 23 * 60; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    options.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return options;
})();

export const STUDIOS_PER_PAGE = 8;

export const FALLBACK_AVATAR = "/images/avatars/fallback-avatar.png";

export const BOOKING_STATUSES: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export const SORT_OPTIONS = [
  "Recommended",
  "Newest First",
  "Price: Low to High",
  "Price: High to Low",
  "Highest Rated",
] as const;

export const ABOUT_VALUES = [
  "Photographers",
  "Filmmakers",
  "Podcasters",
  "Musicians",
  "Content creators",
  "Artists",
  "Studio owners",
];

export const SUPPORT_EMAIL = "hello@srijonspace.com";
