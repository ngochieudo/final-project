'use client'
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ReviewSection from "@/app/components/listings/ReviewSection";
import Loading from "@/app/components/Loading";
import { Backend_URL } from "@/app/lib/Constants";
import { Category, Listing } from "@/app/lib/types";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

interface Params {
  listingId: string;
}

const AdminListingDetail = ({ params }: { params: Params }) => {
  const [listing, setListing] = useState<Listing>();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.listingId) {
      const fetchListingAndCategories = async () => {
        try {
          const [listingResponse, categoriesResponse] = await Promise.all([
            axios.get(`${Backend_URL}/listings/${params.listingId}`),
            axios.get(`${Backend_URL}/categories`),
          ]);

          setListing(listingResponse.data);
          setCategories(categoriesResponse.data);
        } catch (error) {
          console.error("Failed to fetch data", error);
          setError("An error occurred while fetching the listing or categories.");
        } finally {
          setLoading(false);
        }
      };

      fetchListingAndCategories();
    }
  }, [params.listingId]);

  const category = useMemo(() => {
    return categories.find((item) => item.id === listing?.categoryId);
  }, [listing?.categoryId, categories]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing?.title || "Untitled Listing"}
            imageSrc={listing?.imageSrc || ""}
            locationValue={listing?.locationValue || ""}
            id={listing?.id || ""}
          />
        </div>
        <div className="w-full my-8">
          <ListingInfo
            category={category}
            description={listing?.description || ""}
            roomCount={listing?.roomCount || 0}
            guestCount={listing?.guestCount || 0}
            bathroomCount={listing?.bathroomCount || 0}
            locationValue={listing?.locationValue || ""}
          />
        </div>

        <div className="flex justify-between bg-white p-6 rounded-lg shadow-lg font-bold my-8">
            Price:
            <div>
                ${listing?.price} / night
            </div>
        </div>
        <ReviewSection listingId={params.listingId}/>
      </div>
    </Container>
  );
};

export default AdminListingDetail;
