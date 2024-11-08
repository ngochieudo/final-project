'use client';
import ClientOnly from "@/app/components/ClientOnly";
import Loading from "@/app/components/Loading";
import { Backend_URL } from "@/app/lib/Constants";
import useSWR from "swr";
import ListingClient from "./ListingClient";
import { useEffect, useState } from "react";
import axios from "axios";

interface Params {
  listingId: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ListingDetail = ({ params }: { params: Params }) => {
  const { data: listingData, error, isLoading } = useSWR(`${Backend_URL}/listings/${params.listingId}`, fetcher);
  
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`${Backend_URL}/reservations`, {
          params: {
            listingId: params.listingId,
          },
        });
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    if (params.listingId) {
      fetchReservations();
    }
  }, [params.listingId]);

  if (error) return <div>Failed to load</div>;
  if (isLoading || !listingData) return <Loading />;

  return (
    <ClientOnly>
      <ListingClient
        listing={listingData}
        reservations={reservations}
      />
    </ClientOnly>
  );
}

export default ListingDetail;
