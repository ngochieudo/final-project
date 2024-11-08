"use client";
// import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/app/components/Loading";
import { User } from "@/app/lib/types";
import { Backend_URL } from "@/app/lib/Constants";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Params {
  userId: string;
}

const UserDetail = ({ params }: { params: Params }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (params.userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `${Backend_URL}/users/${params.userId}`
          );
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [params.userId]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <div>User not found</div>;
  }
  console.log(user);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <div className="flex items-center space-x-6">
        {/* User Image */}
        <Image
          src={user.image || "/images/placeholder.png"}
          alt={`${user.name}'s profile picture`}
          width={128}
          height={128}
          objectFit="cover"
          className="rounded-full"
        />

        {/* User Info */}
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
          <p className="mt-2">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                user.isAdmin
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100"
              }`}
            >
              {user.isAdmin ? "Admin" : "User"}
            </span>
          </p>
        </div>
      </div>

      {/* More User Details */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">User Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-sm">
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <p className="text-gray-500">Account Created</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

           {/* Role Section */}
           <div className="border rounded-lg p-4 shadow-sm">
            <p className="text-gray-500">Role</p>
            <p className="font-medium">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                }`}
              >
                {user.isAdmin ? 'Admin' : 'User'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => router.push(`/admin/users/${user.id}/edit`)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Edit User
        </button>
        <button
          onClick={() => router.push("/admin/users")}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
        >
          Back to Users
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
