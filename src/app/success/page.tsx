'use client'
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Container from '../components/Container';
import Button from '../components/Button';
import { FaCheckCircle } from 'react-icons/fa';
import Loading from '../components/Loading';
import { Backend_URL } from '../lib/Constants';
import axios from 'axios';

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleReservation = async () => {
      const sessionId = searchParams?.get("session_id");
  
      if (!sessionId) {
        setError("Session ID is missing.");
        setIsLoading(false);
        return;
      }
      
      // Check if the reservation was already handled to avoid re-processing
      if (sessionStorage.getItem(`reservation_handled_${sessionId}`)) {
        setIsLoading(false);
        return;
      }
  
      try {
        // Fetch the checkout session details from the backend
        const sessionResponse = await axios.get(
          `${Backend_URL}/payment/checkout-session/${sessionId}`
        );
        const session = sessionResponse.data;
  
        const reservationId = session.metadata.reservationId;
  
        if (reservationId) {
          // Fetch the current reservation to get the old totalPrice
          const reservationResponse = await axios.get(
            `${Backend_URL}/reservations/${reservationId}`
          );
          const oldReservation = reservationResponse.data;
  
          // Calculate the updated total price
          const updatedTotalPrice =
            Number(oldReservation.totalPrice) + Number(session.metadata.totalPrice);
  
          // Update the reservation with the new end date and total price
          await axios.patch(`${Backend_URL}/reservations/${reservationId}`, {
            endDate: session.metadata.endDate,
            totalPrice: updatedTotalPrice,
          });
        } else {
          // Create a new reservation
          await axios.post(`${Backend_URL}/reservations`, {
            userId: session.metadata.userId,
            listingId: session.metadata.listingId,
            startDate: session.metadata.startDate,
            endDate: session.metadata.endDate,
            totalPrice: Number(session.metadata.totalPrice),
            paymentIntentId: session.payment_intent,
          });
        }
        
        // Mark the reservation as handled
        sessionStorage.setItem(`reservation_handled_${sessionId}`, 'true');
      } catch (error) {
        console.error("Error during reservation creation or update:", error);
        setError("Something went wrong with the reservation.");
      } finally {
        setIsLoading(false);
      }
    };
  
    handleReservation();
  }, [searchParams, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <FaCheckCircle className="text-green-600 text-6xl mb-4" />
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-700 mb-8">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>
        <Button label="Continue viewing trips" onClick={() => router.push('/')} />
      </div>
    </Container>
  );
};

export default SuccessPage;
