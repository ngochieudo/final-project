"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import Image from "next/image";
import Container from "@/app/components/Container";
import { useRouter } from "next/navigation";
import { Backend_URL } from "@/app/lib/Constants";
import Loading from "@/app/components/Loading";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

interface Category {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${Backend_URL}/categories`);
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loading />;

  const handleNewCategory = () => {
    router.push("/admin/categories/create");
  };

  const handleEditCategory = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}/edit`);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      if (confirm("Are you sure you want to delete this category?")) {
        await axios.delete(`${Backend_URL}/categories/${categoryId}`);
        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <Container>
      <div className="pt-8">
        <h1 className="text-3xl font-semibold mb-4">Categories</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded mb-8"
          onClick={handleNewCategory}
        >
          Add New Category
        </button>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by category label "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedCategories.map((category) => (
            <div
              key={category.id}
              className="relative border rounded-lg p-4 flex flex-col items-center justify-center hover:border-black hover:cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <Image
                src={category.icon}
                alt={category.label}
                width={60}
                height={60}
                className="mb-4"
              />
              <h2 className="text-lg font-medium">{category.label}</h2>
              <p className="text-sm text-gray-500">{category.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory(category.id);
                }}
                className="absolute top-2 right-8 text-gray-500 hover:text-gray-800"
              >
                <FaEdit className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category.id);
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              >
                <FaTrashAlt className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4 my-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </Container>
  );
};

export default CategoriesPage;
