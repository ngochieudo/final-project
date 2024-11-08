"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Backend_URL } from "../lib/Constants";
import Image from "next/image";
import { User } from "../lib/types";
import ImageUpload from "../components/inputs/ImageUpload";
import Loading from "../components/Loading";
import useLoginModal from "../hooks/useLoginModal";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const UserProfile = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();
  const loginModal = useLoginModal();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined);

  // React Hook Form for profile update
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    
  } = useForm();

  // React Hook Form for password change
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    getValues,
  } = useForm();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.backendTokens?.accessToken) {
        try {
          const response = await axios.get(`${Backend_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${session?.backendTokens.accessToken}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [session]);

  // Handle profile update
  const handleProfileUpdate = async (data: { name: string; image: string }) => {
    try {
      await axios.patch(
        `${Backend_URL}/users/${user?.id}`,
        {
          name: data.name,
          image: newImageUrl || user?.image
        },
        {
          headers: {
            Authorization: `Bearer ${session?.backendTokens.accessToken}`,
          },
        }
      );
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle password change
  const handleChangePassword = async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      await axios.patch(
        `${Backend_URL}/users/${user?.id}`,
        {
          password: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.backendTokens.accessToken}`,
          },
        }
      );
      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };


  if (loading) {
    return <Loading />;
  }

  if (!user) {
    loginModal.onOpen();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-4xl font-semibold mb-6">Your Profile</h1>

      {/* Profile Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
        <div className="flex items-center space-x-6 mb-4">
          <Image
            src={user?.image || "/images/placeholder.png"}
            width={48}
            height={48}
            alt="Profile Image"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="text-lg font-medium">{user?.name || "Your Name"}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {editing ? (
          <form
            onSubmit={handleProfileSubmit(handleProfileUpdate)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...registerProfile("name", {
                  required: "Name is required.",
                  validate: (value) => {
                    if (/\d/.test(value)) {
                      return "Username cannot contain numbers";
                    }
                    return true;
                  },
                })}
                defaultValue={user?.name}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  profileErrors.name ? "border-red-500" : ""
                }`}
                placeholder="Full Name"
              />
              {profileErrors.name && (
                <span className="text-red-500 text-sm">
                  {profileErrors.name.message?.toString()}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <ImageUpload
                value={newImageUrl || ""}
                onChange={(value: string) => setNewImageUrl(value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between">
            <div>
              <p className="text-gray-700">Full Name: {user?.name}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form
          onSubmit={handlePasswordSubmit(handleChangePassword)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              {...registerPassword("oldPassword", {
                required: "Current password is required.",
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                passwordErrors.oldPassword ? "border-red-500" : ""
              }`}
            />
            {passwordErrors.oldPassword && (
              <span className="text-red-500 text-sm">
                {passwordErrors.oldPassword.message?.toString()}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              {...registerPassword("newPassword", {
                required: "New password is required.",
                minLength: {
                  value: 8,
                  message: "New password must be at least 8 characters long.",
                },
                pattern: {
                  value: /(?=.*[0-9])(?=.*[!@#$%^&*])/,
                  message:
                    "New password must contain at least one number and one special character.",
                },
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                passwordErrors.newPassword ? "border-red-500" : ""
              }`}
            />
            {passwordErrors.newPassword && (
              <span className="text-red-500 text-sm">
                {passwordErrors.newPassword.message?.toString()}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              {...registerPassword("confirmPassword", {
                required: "Please confirm your new password.",
                validate: (value) => {
                  const { newPassword } = getValues();
                  return value === newPassword || "Passwords do not match.";
                },
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                passwordErrors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {passwordErrors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {passwordErrors.confirmPassword.message?.toString()}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
