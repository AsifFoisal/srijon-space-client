"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AuthUser,
  Booking,
  BookingDraft,
  Review,
  Studio,
  StudioDraft,
} from "@/lib/types";
import {
  createBooking,
  createStudio,
  deleteStudio,
  fetchBookings,
  fetchFavorites,
  fetchReviews,
  fetchStudios,
  saveFavorites,
  updateBookingStatus,
  updateStudio,
} from "@/services/marketplace";

interface MarketplaceContextValue {
  studios: Studio[];
  bookings: Booking[];
  favorites: string[];
  isReady: boolean;
  addStudio: (draft: StudioDraft, user: AuthUser) => Promise<Studio>;
  editStudio: (
    id: string,
    draft: StudioDraft,
    user: AuthUser,
  ) => Promise<Studio>;
  removeStudio: (id: string, user: AuthUser) => Promise<void>;
  addBooking: (
    studio: Studio,
    draft: BookingDraft,
    user: AuthUser,
  ) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<Booking>;
  toggleFavorite: (studioId: string) => void;
  isFavorite: (studioId: string) => boolean;
  getStudio: (id: string) => Studio | undefined;
  getReviews: (studioId: string) => Review[];
  getBookingsFor: (email: string) => Booking[];
  getStudiosFor: (email: string) => Studio[];
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const [nextStudios, nextBookings, nextFavorites] = await Promise.all([
        fetchStudios(),
        fetchBookings(),
        fetchFavorites(),
      ]);
      if (!active) return;
      setStudios(nextStudios);
      setBookings(nextBookings);
      setFavorites(nextFavorites);
      setIsReady(true);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const addStudio = useCallback(async (draft: StudioDraft, user: AuthUser) => {
    const studio = await createStudio(draft, user);
    setStudios((current) => [studio, ...current]);
    return studio;
  }, []);

  const editStudio = useCallback(
    async (id: string, draft: StudioDraft, user: AuthUser) => {
      const studio = await updateStudio(id, draft, user);
      setStudios((current) =>
        current.map((item) => (item.id === id ? studio : item)),
      );
      return studio;
    },
    [],
  );

  const removeStudio = useCallback(async (id: string, user: AuthUser) => {
    await deleteStudio(id, user);
    setStudios((current) => current.filter((studio) => studio.id !== id));
  }, []);

  const addBooking = useCallback(
    async (studio: Studio, draft: BookingDraft, user: AuthUser) => {
      const booking = await createBooking(studio, draft, user);
      setBookings((current) => [booking, ...current]);
      return booking;
    },
    [],
  );

  const cancelBooking = useCallback(async (id: string) => {
    const booking = await updateBookingStatus(id, "Cancelled");
    setBookings((current) =>
      current.map((item) => (item.id === id ? booking : item)),
    );
    return booking;
  }, []);

  const toggleFavorite = useCallback((studioId: string) => {
    setFavorites((current) => {
      const next = current.includes(studioId)
        ? current.filter((id) => id !== studioId)
        : [...current, studioId];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (studioId: string) => favorites.includes(studioId),
    [favorites],
  );

  const getStudio = useCallback(
    (id: string) => studios.find((studio) => studio.id === id),
    [studios],
  );

  const getReviews = useCallback((studioId: string) => {
    return fetchReviews(studioId);
  }, []);

  const getBookingsFor = useCallback(
    (email: string) =>
      bookings.filter(
        (booking) =>
          booking.userEmail.toLowerCase() === email.toLowerCase(),
      ),
    [bookings],
  );

  const getStudiosFor = useCallback(
    (email: string) =>
      studios.filter(
        (studio) => studio.ownerEmail.toLowerCase() === email.toLowerCase(),
      ),
    [studios],
  );

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      studios,
      bookings,
      favorites,
      isReady,
      addStudio,
      editStudio,
      removeStudio,
      addBooking,
      cancelBooking,
      toggleFavorite,
      isFavorite,
      getStudio,
      getReviews,
      getBookingsFor,
      getStudiosFor,
    }),
    [
      studios,
      bookings,
      favorites,
      isReady,
      addStudio,
      editStudio,
      removeStudio,
      addBooking,
      cancelBooking,
      toggleFavorite,
      isFavorite,
      getStudio,
      getReviews,
      getBookingsFor,
      getStudiosFor,
    ],
  );

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used inside a MarketplaceProvider.");
  }
  return context;
}
