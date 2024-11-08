"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Backend_URL } from "@/app/lib/Constants";
import Loading from "@/app/components/Loading";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import CountrySelect, {
  CountrySelectValue,
} from "@/app/components/inputs/CountrySelect";
import toast from "react-hot-toast";
import useCountries from "@/app/hooks/useCountries";
import { Category } from "@/app/lib/types";


export default function EditcategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Backend_URL}/categories/${categoryId}`)

        const categoryData = response.data;
        setCategory(categoryData);

        setFormData({
          label: categoryData.label,
          description: categoryData.description,
          icon: categoryData.imageSrc,
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to load category or categories:", error);
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);
  

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
    setError('');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d+$/.test(formData.label)) {
      setError("Label cannot contain only numbers.");
      return;
    }

    try {
      await axios.put(`${Backend_URL}/categories/${categoryId}`, {
        ...formData,
      });
      toast.success('Updated category succesfully!')
      router.push("/admin/categories");
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Edit category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {error ? <span className="font-light text-sm text-red-500">{error}</span> : ''}
        </div>

        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Icon Source</label>
          <ImageUpload
            value={formData.icon}
            onChange={(newImageUrl: string) =>
              setFormData({ ...formData, icon: newImageUrl })
            }
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded-md p-4 w-full md:w-[20%]">
          Save Changes
        </button>
      </form>
    </div>
  );
}
