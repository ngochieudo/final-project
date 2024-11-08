"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Listing, Reservation } from "@/app/lib/types";
import ListingCard from "../components/listings/ListingCard";
import { Backend_URL } from "../lib/Constants";
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

interface ReservationWithListing extends Reservation {
  listing: Listing;
}

export default function UserReservationsPage() {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<ReservationWithListing[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (session) {
      fetchReservations();
    }
  }, [session]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        `${Backend_URL}/reservations`, {
          params: {
            userId: session?.user.id,
          },
        }
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelReservation = async (reservationId: string) => {
    const confirmed = confirm("Are you sure you want to cancel this reservation?");
    if (!confirmed) return;

    try {
      await axios.patch(`${Backend_URL}/reservations/${reservationId}/cancel`);
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== reservationId)
      );
      toast.success('Reservation canceled successfully. A refund will be processed shortly.');
    } catch (error: any) {
      console.error("Error canceling reservation:", error);
      toast.error(error.response.data.message);
    }
  };

  if (loading) {
    return <Loading/>;
  }

  if (reservations.length === 0) {
    return <ClientOnly>
        <EmptyState
            title="No trip found"
            subtitle="Look like you havent reserved any trips."
        />
    </ClientOnly>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Reservations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionLabel="Cancel Reservation"
            onAction={() => handleCancelReservation(reservation.id)} 
            disabled={reservation.status === 'Cancelled' || reservation.status === 'Check out'}
            isReservationPage
          />
        ))}
      </div>
    </div>
  );
}
