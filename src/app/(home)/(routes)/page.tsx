"use client";
import { useState, useEffect } from "react";
import ListingCard from "@/app/components/listings/ListingCard";
import Loading from "@/app/components/Loading";
import EmptyState from "@/app/components/EmptyState";
import { Backend_URL } from "@/app/lib/Constants";
import useSWR from "swr";
import { Listing } from "@/app/lib/types";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const params = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listingsPerPage] = useState<number>(20); // Set the number of listings per page

  const fetchUrl = `${Backend_URL}/listings${params ? `?${params.toString()}` : ''}`;

  const { data, error, isLoading } = useSWR(fetchUrl, fetcher);

  useEffect(() => {
    if (data) {
      setListings(data);
    }
  }, [data]);

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (error) return <div>Error loading listings</div>;
  if (isLoading) return <Loading />;

  return (
    <div className="pt-40">
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {currentListings.length > 0 ? (
          currentListings.map((item: Listing) => (
            <ListingCard key={item.id} data={item} />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-full">
            <EmptyState showReset />
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 border ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-200'}`}
        >
          Previous
        </button>
        {[...Array(Math.ceil(listings.length / listingsPerPage)).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => paginate(page + 1)}
            className={`px-4 py-2 mx-2 border ${currentPage === page + 1 ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            {page + 1}
          </button> 
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(listings.length / listingsPerPage)}
          className={`px-4 py-2 mx-2 border ${currentPage === Math.ceil(listings.length / listingsPerPage) ? 'text-gray-400' : 'hover:bg-gray-200'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
