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

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  address: string;
  imageUrl: string;
  images?: string[];
  description: string;
  amenities: Amenity[];
  ownerEmail: string;
  ownerName: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
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
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  category: StudioCategory;
  address: string;
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
