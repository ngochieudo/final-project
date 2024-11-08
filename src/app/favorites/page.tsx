"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "../components/listings/ListingCard";
import { Backend_URL } from "../lib/Constants";
import EmptyState from "../components/EmptyState";
import { Listing } from "../lib/types";
import Loading from "../components/Loading";
import { useSession } from "next-auth/react";
import Heading from "../components/Heading";

const MyFavorites = () => {
  const { data: session, status } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (session) {
        try {
          const response = await axios.get(`${Backend_URL}/favorites/user`, {
            headers: {
              Authorization: `Bearer ${session.backendTokens.accessToken}`,
            },
          });
          setListings(response.data);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFavorites();
  }, [session]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Failed to load favorites.</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="my-8">
        <Heading title="My Favorite" subtitle="What trips you like the most" />
      </div>
      {listings.favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.favorites.map((listing: Listing) => (
            <ListingCard key={listing.id} data={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorite yet"
          subtitle="Look like you haven't favor any trips."
        />
      )}
    </div>
  );
};

export default MyFavorites;
