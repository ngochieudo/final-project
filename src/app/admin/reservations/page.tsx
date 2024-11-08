"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Backend_URL } from "@/app/lib/Constants";
import { Reservation } from "@/app/lib/types";
import toast from "react-hot-toast";

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Reservation | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const getReservations = async () => {
      const response = await axios.get(`${Backend_URL}/reservations/all`);
      setReservations(response.data);
    };
    getReservations();
  }, []);

  const handleSort = (column: keyof Reservation) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    setReservations((prevReservations) => {
      const sortedReservations = [...prevReservations].sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];
        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
      return sortedReservations;
    });
  };

  const deleteReservation = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this reservation?")) {
        await axios.delete(`${Backend_URL}/reservations/${id}`);
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation.id !== id)
        );
        toast.success("Reservation deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete reservation");
      console.error(error);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-500 bg-green-100";
      case "check in":
        return "text-yellow-500 bg-yellow-100";
      case "cancelled":
        return "text-red-500 bg-red-100";
      case "check out":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const filteredReservations = reservations.filter((reservation) =>
    reservation.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-6">Admin Reservations</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by listing title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="hidden md:block">
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("id")}>
                Reservation ID {sortColumn === "id" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-2 cursor-pointer">
                Title
              </th>
              <th className="px-4 py-2 cursor-pointer">
                Reservator 
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("startDate")}>
                Start Date {sortColumn === "startDate" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("endDate")}>
                End Date {sortColumn === "endDate" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("totalPrice")}>
                Total Price {sortColumn === "totalPrice" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("status")}>
                Status {sortColumn === "status" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="border px-4 py-2">{reservation.id}</td>
                <td className="border px-4 py-2">{reservation.listing.title}</td>
                <td className="border px-4 py-2">{reservation.user.name}</td>
                <td className="border px-4 py-2">{new Date(reservation.startDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(reservation.endDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">${reservation.totalPrice}</td>
                <td className={`border px-4 py-2 ${getStatusClass(reservation.status)}`}>{reservation.status}</td>
                <td className="border px-4 py-2 flex space-x-2 justify-center items-center">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => router.push(`/admin/reservations/${reservation.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteReservation(reservation.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        {paginatedReservations.map((reservation) => (
          <div key={reservation.id} className="border rounded-lg shadow p-4 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{reservation.listing.title}</h2>
              <span className={`px-2 py-1 rounded ${getStatusClass(reservation.status)}`}>
                {reservation.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">ID: {reservation.id}</p>
            <p className="text-sm">Reservator: {reservation.user.name}</p>
            <p className="text-sm">Start Date: {new Date(reservation.startDate).toLocaleDateString()}</p>
            <p className="text-sm">End Date: {new Date(reservation.endDate).toLocaleDateString()}</p>
            <p className="text-sm">Total Price: ${reservation.totalPrice}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => router.push(`/admin/reservations/${reservation.id}/edit`)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => deleteReservation(reservation.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center items-center space-x-4 my-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminReservations;
