'use client';
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Listing } from "@/app/lib/types";
import { Backend_URL } from "@/app/lib/Constants";
import { useRouter } from "next/navigation";
import useRentModal from "@/app/hooks/useRentModal";
import { useSession } from "next-auth/react";
import useLoginModal from "@/app/hooks/useLoginModal";
import Button from "@/app/components/Button";
import { BiPlus } from "react-icons/bi";

const truncateField = (data: string, maxLength: number = 50) => {
  if (data.length > maxLength) {
    return `${data.substring(0, maxLength)}...`;
  }
  return data;
};

const AdminListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listingsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<string>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();
  const rentModal = useRentModal();
  const { data: session } = useSession();
  const loginModal = useLoginModal();

  const onRent = useCallback(() => {
    if (!session) {
      loginModal.onOpen();
      rentModal.onClose();
    }
    rentModal.onOpen();
  }, [session, loginModal, rentModal]);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await axios.get(`${Backend_URL}/listings`);
      setListings(response.data); 
    };

    fetchListings();
  }, [listings]);

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedListings = filteredListings.sort((a, b) => {
    if (sortField === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else {
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
  });

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = sortedListings.slice(indexOfFirstListing, indexOfLastListing);

  const totalPages = Math.ceil(sortedListings.length / listingsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/listings/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this listing?");
    if (confirmDelete) {
      try {
        await axios.delete(`${Backend_URL}/listings/${id}`);
        setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));
        alert("Listing deleted successfully.");
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete the listing. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Listings</h1>
      <div className="my-8 flex items-center">
        <Button label="Add new place" onClick={onRent} icon={BiPlus} />
      </div>
      <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full mb-8"
        />
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("title")}>
              Title {sortField === "title" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("description")}>
              Description {sortField === "description" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("locationValue")}>
              Location {sortField === "locationValue" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("price")}>
              Price (USD) {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => (
            <tr key={listing.id} className="hover:bg-gray-100">
              <td 
                className="py-2 px-4 border-b cursor-pointer hover:underline"
                onClick={() => router.push(`/admin/listings/${listing.id}`)}
              >
                {truncateField(listing.title, 30)}
              </td>
              <td className="py-2 px-4 border-b">
                {truncateField(listing.description, 40)}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {listing.locationValue}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {listing.price}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                  onClick={() => handleEdit(listing.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(listing.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
        >
          Previous
        </button>
        <span className="mx-2">{` Page ${currentPage} of ${totalPages} `}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminListings;
