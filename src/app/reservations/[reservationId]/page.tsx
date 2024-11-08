"use client";
import { Category, Listing, Reservation } from "@/app/lib/types";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";
import ListingReservation from "@/app/components/listings/ListingReservation";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import { Backend_URL } from "@/app/lib/Constants";
import useLoginModal from "@/app/hooks/useLoginModal";
import { Range } from "react-date-range";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface Params {
  reservationId: string;
}

const ReservationClient = ({ params }: { params: Params }) => {
  const loginModal = useLoginModal();
  const router = useRouter();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [listing, setListing] = useState<Listing | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch reservation and listing details
  useEffect(() => {
    const fetchReservationAndListing = async () => {
      try {
        const reservationResponse = await axios.get(
          `${Backend_URL}/reservations/${params.reservationId}`
        );
        setReservation(reservationResponse.data);

        const listingResponse = await axios.get(
          `${Backend_URL}/listings/${reservationResponse.data.listingId}`
        );
        setListing(listingResponse.data);

        setDateRange({
          startDate: new Date(reservationResponse.data.startDate),
          endDate: new Date(reservationResponse.data.endDate),
          key: "selection",
        });

        setTotalPrice(
          differenceInCalendarDays(
            new Date(reservationResponse.data.endDate),
            new Date(reservationResponse.data.startDate)
          ) * listingResponse.data.price
        );
      } catch (error) {
        console.error("Error fetching reservation or listing:", error);
      }
    };

    if (params.reservationId) {
      fetchReservationAndListing();
    }
  }, [params.reservationId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${Backend_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    if (reservation) {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    }

    return dates;
  }, [reservation]);

  //Handle if user want to extend checkout date
  const onExtendReservation = async () => {
    if (!session) {
      loginModal.onOpen();
      return;
    }

    setIsLoading(true);

    const oldEndDate = new Date(reservation.endDate);
    const newEndDate = new Date(dateRange.endDate);

    // Calculate the difference in days
    const extendedDays = differenceInCalendarDays(newEndDate, oldEndDate);

    if (extendedDays <= 0) {
      toast.error("The new end date must be after the old end date.");
      setIsLoading(false);
      return;
    }

    // Calculate the total price for the extended days
    const additionalPrice = extendedDays * listing.price;
  
    try {
      const reservationData = {
        listingId: listing.id,
        startDate: reservation.startDate.toString(),
        endDate: dateRange.endDate.toISOString(),
        totalPrice: additionalPrice.toString(),
        reservationId: reservation.id
      };

      setIsLoading(true);

      const queryString = new URLSearchParams(reservationData).toString();
      router.push(`/checkout?${queryString}`);
      
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate && listing) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing]);

  const category = useMemo(() => {
    return categories.find((item) => item.id === listing?.categoryId);
  }, [listing?.categoryId, categories]);

  if (!listing || !reservation) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
          <ListingInfo
            category={category}
            description={listing.description}
            roomCount={listing.roomCount}
            guestCount={listing.guestCount}
            bathroomCount={listing.bathroomCount}
            locationValue={listing.locationValue}
          />
          <div className="order-first mb-10 md:order-last md:col-span-3">
            <ListingReservation
              price={listing.price}
              totalPrice={totalPrice}
              onChangeDate={(value) => setDateRange(value)}
              onSubmit={onExtendReservation}
              dateRange={dateRange}
              disabled={isLoading}
              disabledDates={disabledDates}
              isReservationDetail
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReservationClient;
