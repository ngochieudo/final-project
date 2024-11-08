"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Backend_URL } from "@/app/lib/Constants";
import { Reservation } from "@/app/lib/types";
import toast from "react-hot-toast";
import Loading from "@/app/components/Loading";
import Image from "next/image";
import Container from "@/app/components/Container";

interface Params {
  reservationId: string;
}

const ReservationDetailPage = ({ params }: { params: Params }) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(
          `${Backend_URL}/reservations/${params.reservationId}`
        );
        setReservation(response.data);
      } catch (error) {
        console.error("Error fetching reservation:", error);
        toast.error("Failed to load reservation");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [params.reservationId]);

  if (isLoading) {
    return <Loading />;
  }

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString();

  if (!reservation) {
    return (
      <div className="text-red-500 text-center">Reservation not found.</div>
    );
  }

  return (
    <Container>
      <div className="mx-auto px-4">
        <h1 className="text-2xl font-bold my-6">Reservation Details</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Listing Information */}
          <div className="mb-4">
            <Image
              src={reservation.listing.imageSrc}
              alt={reservation.listing.title}
              width={500}
              height={500}
              className="w-full h-1/4 object-cover rounded-md mr-4"
            />
            <div>
              <h2 className="text-xl font-bold">{reservation.listing.title}</h2>
              <p className="text-sm text-gray-600">
                Reservation for: {reservation.user.name}
              </p>
            </div>
          </div>

          {/* Reservation Information */}
          <p className="font-bold">
            Reservation ID:{" "}
            <span className="font-normal">{reservation.id}</span>
          </p>
          <p className="font-bold">
            Reservator:{" "}
            <span className="font-normal">{reservation.user.name}</span>
          </p>
          <p className="font-bold">
            Listing ID:{" "}
            <span className="font-normal">{reservation.listingId}</span>
          </p>
          <p className="font-bold">
            Start Date:{" "}
            <span className="font-normal">
              {formatDate(reservation.startDate)}
            </span>
          </p>
          <p className="font-bold">
            End Date:{" "}
            <span className="font-normal">
              {formatDate(reservation.endDate)}
            </span>
          </p>
          <p className="font-bold">
            Total Price:{" "}
            <span className="font-normal">${reservation.totalPrice}</span>
          </p>
          <p className="font-bold">
            Status: <span className="font-normal">{reservation.status}</span>
          </p>

          {/* Actions */}
          <div className="flex space-x-4 mt-4">
            <button
              className="md:text-blue-500 md:bg-transparent md:hover:underline md:hover:bg-transparent md:w-auto hover:bg-blue-600  bg-blue-500 p-2 text-white w-full rounded-md"
              onClick={() =>
                router.push(`/admin/reservations/${reservation.id}/edit`)
              }
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReservationDetailPage;
