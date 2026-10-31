export type StudioCategory =
  | "Photo Studio"
  | "Film Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Art Workshop";

export type Amenity =
  | "Wi-Fi"
  | "Air Conditioning"
  | "Lighting Equipment"
  | "Professional Cameras"
  | "Soundproofing"
  | "Microphones"
  | "Editing Equipment"
  | "Parking"
  | "Kitchen"
  | "Restroom"
  | "Natural Lighting";

export type ListingStatus = "Active" | "Paused";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Host {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  verified: boolean;
  bio: string;
}

export interface StudioSpec {
  label: string;
  value: string;
}

export interface Studio {
  id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  city: string;
  address: string;
  shortDescription: string;
  description: string;
  mainImage: string;
  gallery: string[];
  amenities: Amenity[];
  rating: number;
  reviewCount: number;
  host: Host;
  ownerEmail: string;
  status: ListingStatus;
  featured: boolean;
  createdAt: string;
  availableDays: number[];
  openTime: string;
  closeTime: string;
  specs: StudioSpec[];
  squareFeet: number;
}

export interface Review {
  id: string;
  studioId: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface AuthUser {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

export interface Booking {
  id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  category: StudioCategory;
  location: string;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  attendees: number;
  projectDescription?: string;
  hourlyRate: number;
  subtotal: number;
  securityDeposit: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

export interface StudioDraft {
  title: string;
  category: StudioCategory;
  description: string;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  address: string;
  city: string;
  mainImage: string;
  gallery: string[];
  amenities: Amenity[];
}

export interface BookingDraft {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  projectDescription?: string;
}

export interface Filters {
  search: string;
  category: StudioCategory | "All Categories";
  minPrice: number;
  maxPrice: number;
  location: string;
  minCapacity: number;
  rating: number;
  amenities: Amenity[];
  date: string;
  startTime: string;
  endTime: string;
}

export type SortOption =
  | "Recommended"
  | "Newest First"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Highest Rated";
