"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Backend_URL } from "../lib/Constants";
import { useSession } from "next-auth/react";
import ListingHead from "../components/listings/ListingHead";
import Loading from "../components/Loading";
import { Listing } from "../lib/types";

const stripePromise = loadStripe("pk_test_51Pr4KA1cncpuvsIiWSGu3Mo4pzBJOCY4EgRtcyko6ETOkkcSlBqtf2svSo2cPhGGFRkEAXEUnH1HktGXjNSs3UTS00YBjSMSfH");

interface ReservationData {
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  reservationId?: string; // Optional property
}

const CheckoutPage: React.FC = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isListingLoading, setIsListingLoading] = useState(false); // Loading state for listing
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get reservation data from the query parameters
  useEffect(() => {
    if (searchParams) {
      const listingId = searchParams.get("listingId");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const totalPrice = searchParams.get("totalPrice");
      const reservationId = searchParams.get("reservationId");

      if (listingId && startDate && endDate && totalPrice) {
        setReservationData({
          listingId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice: parseFloat(totalPrice),
          reservationId: reservationId || undefined,
        });
      }
    }
  }, [searchParams]);

  // Fetch listing details for the reservation
  useEffect(() => {
    if (reservationData && session) {
      const fetchListing = async () => {
        setIsListingLoading(true);
        try {
          const response = await axios.get(`${Backend_URL}/listings/${reservationData.listingId}`);
          setListing(response.data);
        } catch (error) {
          console.error("Error fetching listing data:", error);
          setErrorMessage("Could not fetch listing details. Please try again.");
        } finally {
          setIsListingLoading(false);
        }
      };

      fetchListing();
    }
  }, [reservationData, session]);

  // Create a checkout session and redirect to Stripe
  const handleCheckout = async () => {
    if (!reservationData || !session) {
      console.error("Reservation data or session is missing.");
      return;
    }

    setIsLoading(true);
    try {
      // Send request to create checkout session
      const response = await axios.post(`${Backend_URL}/payment/create-checkout-session`, {
        userId: session.user.id,
        listingId: reservationData.listingId,
        listingTitle: listing?.title,
        imageSrc: listing?.imageSrc,
        startDate: reservationData.startDate.toISOString(),
        endDate: reservationData.endDate.toISOString(),
        totalPrice: reservationData.totalPrice,
        reservationId: reservationData.reservationId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });

      const { sessionId } = response.data;
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setErrorMessage("Could not create checkout session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Complete Your Reservation</h1>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      {reservationData ? (
        <>
          {listing ? (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <ListingHead
                title={listing.title}
                imageSrc={listing.imageSrc}
                locationValue={listing.locationValue}
                id={listing.id}
              />
            </div>
          ) : isListingLoading ? (
            <Loading />
          ) : (
            <div className="text-red-500 mb-4">Failed to load listing details.</div>
          )}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Reservation Summary</h2>
            <div className="flex justify-between mb-4">
              <span className="font-medium">Check-in:</span>
              <span>{reservationData.startDate.toDateString()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-medium">Check-out:</span>
              <span>{reservationData.endDate.toDateString()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total Price:</span>
              <span>${reservationData.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <button
              onClick={handleCheckout}
              disabled={isLoading || isListingLoading}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-red-500 mb-4">No reservation data available.</div>
      )}
    </div>
  );
};

export default CheckoutPage;
