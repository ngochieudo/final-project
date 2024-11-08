'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/app/components/Container';
import { Backend_URL } from '@/app/lib/Constants';
import Loading from '@/app/components/Loading';
import toast from 'react-hot-toast';

interface Params {
    categoryId: string;
  }

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
}

const CategoryListingsPage = ({ params }: { params: Params }) => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${Backend_URL}/categories/${params.categoryId}`);
        
        setListings(response.data.listings);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchListings();
  }, [params]);

  const handleEdit = (listingId: string) => {
    router.push(`/admin/listings/${listingId}/edit`);
  };

  const handleDelete = async (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`${Backend_URL}/listings/${listingId}`);
        setListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== listingId)
        );
        toast.success('Listing deleted successfully');
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <Container>
      <div className="pt-8">
        <h1 className="text-3xl font-semibold mb-4">Category Products</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
  {listings.map((listing) => (
    <tr key={listing.id}>
      <td className="px-4 py-2 border">{listing.title}</td>
      <td className="px-4 py-2 border">
        {listing.description.length > 50
          ? `${listing.description.slice(0, 50)}...`
          : listing.description}
      </td>
      <td className="px-4 py-2 border">${listing.price}</td>
      <td className="px-4 py-2 border flex justify-around">
        <button
          onClick={() => handleEdit(listing.id)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(listing.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </Container>
  );
};

export default CategoryListingsPage;
