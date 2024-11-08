"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import AdminRoute from "../components/admin/AdminRoutes";
import Image from "next/image";
import RevenueChart from "../components/admin/RevenueChart";
import { Backend_URL } from "../lib/Constants";
import axios from "axios";

const AdminDashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [stats, setStats] = useState({
    totalListings: 0,
    totalReservations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [listingsRes, reservationsRes] = await Promise.all([
          axios.get(`${Backend_URL}/listings`),
          axios.get(`${Backend_URL}/reservations/all`),
        ]);

        setStats({
          totalListings: listingsRes.data.length,
          totalReservations: reservationsRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            {session?.user && (
              <>
                <Image
                  src={session?.user.image || "/images/placeholder.png"}
                  width={40}
                  height={40}
                  alt="Profile Image"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Admin Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Hello,{" "}
                    <span className="font-semibold">{session?.user.name}</span>!
                  </p>
                </div>
              </>
            )}
          </div>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Total Listings</h2>
            <p className="text-gray-700">{stats.totalListings} Listings</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Total Reservations</h2>
            <p className="text-gray-700">
              {stats.totalReservations} Reservations
            </p>
          </div>
        </div>
        <RevenueChart />

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className="bg-blue-500 text-white p-6 rounded-lg cursor-pointer hover:bg-blue-600"
            onClick={() => router.push("/admin/listings")}
          >
            Manage Listings
          </div>
          <div
            className="bg-green-500 text-white p-6 rounded-lg cursor-pointer hover:bg-green-600"
            onClick={() => router.push("/admin/categories")}
          >
            Manage Categories
          </div>
          <div
            className="bg-purple-500 text-white p-6 rounded-lg cursor-pointer hover:bg-purple-600"
            onClick={() => router.push("/admin/reservations")}
          >
            Manage Reservations
          </div>
          <div
            className="bg-purple-500 text-white p-6 rounded-lg cursor-pointer hover:bg-purple-600"
            onClick={() => router.push("/admin/users")}
          >
            Manage Users
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => <AdminRoute component={AdminDashboard} />;
