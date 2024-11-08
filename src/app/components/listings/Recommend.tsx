import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Listing } from "@/app/lib/types";
import ListingCard from "@/app/components/listings/ListingCard";
import { Backend_URL } from "@/app/lib/Constants";
import EmptyState from "../EmptyState";

interface RecommendListingsProps {
  currentListingId: string;
  categoryId: string;
}

const RecommendListing: React.FC<RecommendListingsProps> = ({
  currentListingId,
  categoryId,
}) => {
  const [recommends, setRecommends] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendListings = async () => {
      try {
        const response = await axios.get<Listing[]>(
          `${Backend_URL}/listings/recommend`,
          {
            params: {
              categoryId,
              excludeId: currentListingId,
            },
          }
        );
        setRecommends(response.data);
      } catch (error) {
        console.error("Error fetching similar listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendListings();
  }, [categoryId, currentListingId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Explore other options</h2>
      {recommends.length !== 0 ? (
        <Carousel>
        <CarouselContent>
          {recommends.map((listing) => (
            <CarouselItem key={listing.id} className="md:basis-1/2 lg:basis-1/3">
              <div key={listing.id} className="px-2">
                <ListingCard data={listing} />
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      </Carousel>
      ) : (
        <EmptyState
          title="No place related to this listing by now"
          subtitle="There will be new place added in the future"
        />
      )}
    </div>
  );
};

export default RecommendListing;
