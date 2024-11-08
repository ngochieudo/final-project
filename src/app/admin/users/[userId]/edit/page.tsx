"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
import { User } from "@/app/lib/types";
import { Backend_URL } from "@/app/lib/Constants";
import { Button } from "@/components/ui/button";

interface Params {
  userId: string;
}

const EditUser = ({ params }: { params: Params }) => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nameError, setNameError] = useState(""); // Error state for name validation
  const router = useRouter();

  useEffect(() => {
    if (params.userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `${Backend_URL}/users/${params.userId}`
          );
          const userData = response.data;
          setUser(userData);
          setName(userData.name);
          setEmail(userData.email);
          setImage(userData.image);
          setIsAdmin(userData.isAdmin);
        } catch (error) {
          console.error("Failed to fetch user", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [params.userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name: at least two letters and no numbers
    const nameRegex = /^[A-Za-z]{2,}(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
      setNameError("Name must contain at least two letters and no numbers.");
      return;
    }

    try {
      await axios.patch(`${Backend_URL}/users/${params.userId}`, {
        name,
        email,
        image,
        isAdmin,
      });
      router.push("/admin/users");
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Account Settings
      </h1>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <img
              src={image || "/images/placeholder.png"}
              alt="User profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              disabled
            />
          </div>

          {/* Name Fields */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>

          {/* Admin Status */}
          <div className="flex items-center space-x-3">
            <label
              htmlFor="isAdmin"
              className="text-sm font-medium text-gray-700"
            >
              Admin
            </label>
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </form>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default EditUser;
