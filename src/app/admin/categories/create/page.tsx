'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Backend_URL } from "@/app/lib/Constants";
import ImageUpload from "@/app/components/inputs/ImageUpload";

const NewCategory = () => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('')
  const router = useRouter();

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (/^\d+$/.test(label)) {
      setError("Label cannot contain only numbers.");
      return;
    }

    
    try {
      await axios.post(`${Backend_URL}/categories`, { label, description, icon });
      router.push('/admin/categories');
    } catch (error) {
      console.error("Error creating category:", error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Create New Category</h1>
      <form onSubmit={handleCreateCategory}>
        <div className="mb-4">
          <label htmlFor="label" className="block font-medium">Label</label>
          <input 
            type="text" 
            id="label" 
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          {error ? <span className="font-light text-sm text-red-500">{error}</span> : ''}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="icon" className="block font-medium">Icon URL</label>
          <ImageUpload
            value={icon}
            onChange={(value) => setIcon(value)}
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Create Category</button>
      </form>
    </div>
  );
};

export default NewCategory;
