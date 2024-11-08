"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Backend_URL } from "@/app/lib/Constants";
import Loading from "@/app/components/Loading";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import { Listing } from "@/app/lib/types";
import CountrySelect, {
  CountrySelectValue,
} from "@/app/components/inputs/CountrySelect";
import toast from "react-hot-toast";
import useCountries from "@/app/hooks/useCountries";

interface Category {
  id: string;
  label: string;
}

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.listingId as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageSrc: "",
    categoryId: "",
    roomCount: 0,
    bathroomCount: 0,
    guestCount: 0,
    locationValue: "",
    price: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingResponse, categoriesResponse] = await Promise.all([
          axios.get(`${Backend_URL}/listings/${listingId}`),
          axios.get(`${Backend_URL}/categories`),
        ]);

        const listingData = listingResponse.data;
        const categoryData = categoriesResponse.data;

        setListing(listingData);
        setCategories(categoryData);

        setFormData({
          title: listingData.title,
          description: listingData.description,
          imageSrc: listingData.imageSrc,
          categoryId: listingData.categoryId,
          roomCount: listingData.roomCount,
          bathroomCount: listingData.bathroomCount,
          guestCount: listingData.guestCount,
          locationValue: listingData.locationValue,
          price: listingData.price,
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to load listing or categories:", error);
        setLoading(false);
      }
    };

    if (listingId) {
      fetchData();
    }
  }, [listingId]);
  

  if (loading) return <Loading />;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryChange = (selectedCountry: CountrySelectValue) => {
    setFormData({
      ...formData,
      locationValue: selectedCountry.value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`${Backend_URL}/listings/${listingId}`, {
        ...formData,
        roomCount: Number(formData.roomCount), 
        bathroomCount: Number(formData.bathroomCount), 
        guestCount: Number(formData.guestCount),
        price: Number(formData.price)
      });
      toast.success('Updated product succesfully!')
      router.push("/admin/listings");
    } catch (error) {
      console.error("Failed to update listing:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Image Source</label>
          <ImageUpload
            value={formData.imageSrc}
            onChange={(newImageUrl: string) =>
              setFormData({ ...formData, imageSrc: newImageUrl })
            }
          />
        </div>

        <div>
          <label className="block text-gray-700">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Room Count</label>
          <input
            type="number"
            name="roomCount"
            value={formData.roomCount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Bathroom Count</label>
          <input
            type="number"
            name="bathroomCount"
            value={formData.bathroomCount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Guest Count</label>
          <input
            type="number"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Location</label>
          <CountrySelect
            value={useCountries().getByValue(formData.locationValue)}
            onChange={handleCountryChange}
          />
        </div>

        <div>
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white rounded-md p-4">
          Save Changes
        </button>
      </form>
    </div>
  );
}
