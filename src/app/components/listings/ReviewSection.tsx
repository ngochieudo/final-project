import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Backend_URL } from "@/app/lib/Constants";
import useLoginModal from "@/app/hooks/useLoginModal";
import ConfirmModal from "../modals/ConfirmModal";
import useConfirmModal from "@/app/hooks/useConfirmModal";

interface Review {
  id: string;
  userId: string;
  listingId: string;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
}

interface ReviewSectionProps {
  listingId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ listingId }) => {
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  const confirmModal = useConfirmModal();

  useEffect(() => {
    // Fetch existing reviews
    axios
      .get(`${Backend_URL}/reviews/listing/${listingId}`)
      .then((response) => setReviews(response.data))
      .catch(() => toast.error("Failed to load reviews"));
  }, [listingId]);

  const handleSubmit = () => {
    if (!session) {
      loginModal.onOpen();
      return;
    }

    if (content === "") {
      toast.error("Review cannot be empty!");
      return;
    }

    axios
      .post(
        `${Backend_URL}/reviews`,
        {
          listingId,
          content,
          rating,
          userId: session.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.backendTokens.accessToken}`,
          },
        }
      )
      .then((response) => {
        setReviews([...reviews, response.data]);
        setContent("");
        setRating(5);
        toast.success("Review submitted successfully!");
      })
      .catch((error: any) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      });
  };

  const handleEdit = (reviewId: string) => {
    const review = reviews.find((review) => review.id === reviewId);
    if (review) {
      setEditReviewId(reviewId);
      setEditContent(review.content);
      setEditRating(review.rating);
    }
  };

  const handleUpdate = () => {
    if (!session) {
      loginModal.onOpen();
      return;
    }

    axios
      .put(
        `${Backend_URL}/reviews/${editReviewId}`,
        {
          content: editContent,
          rating: editRating,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.backendTokens.accessToken}`,
          },
        }
      )
      .then(() => {
        setReviews(
          reviews.map((r) =>
            r.id === editReviewId
              ? { ...r, content: editContent, rating: editRating }
              : r
          )
        );
        setEditReviewId(null);
        setEditContent("");
        setEditRating(5);
        toast.success("Review updated successfully!");
      })
      .catch(() => toast.error("Failed to update review."));
  };

  const handleDelete = (reviewId: string) => {
    if (!session) {
      loginModal.onOpen();
      return;
    }

    axios
      .delete(`${Backend_URL}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
      })
      .then(() => {
        setReviews(reviews.filter((review) => review.id !== reviewId));
        toast.success("Review deleted successfully!");
        confirmModal.onClose();
      })
      .catch(() => toast.error("Failed to delete review."));
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">Reviews</h2>
      <p className="text-sm font-light text-gray-500">
        {reviews.length === 0 ? "Leave a review" : `${reviews.length} reviews`}
      </p>
      <div className="flex flex-col gap-4 mt-4">
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center gap-2">
              <img
                src={review.user.image || "/images/placeholder.png"}
                alt={review.user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{review.user.name}</span>
              <span className="text-sm text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2">{review.content}</p>
            <div className="text-yellow-500">{"★".repeat(review.rating)}</div>
            {session?.user?.id === review.userId || session?.user.isAdmin === true && (
              <div className="mt-4">
                {session?.user.id === review.userId ? (<button
                  onClick={() => handleEdit(review.id)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>) : ''}
                <button
                  onClick={() => confirmModal.onOpen()}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
            <ConfirmModal
              onConfirm={() => handleDelete(review.id)}
              title="Confirm Delete"
              message="Are you sure you want to delete this comment?"
            />
          </div>
        ))}
      </div>
      {editReviewId ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Edit Review</h3>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit your review here..."
            className="w-full border p-2 mt-2"
            rows={4}
          />
          <div className="flex items-center gap-2 mt-2">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={editRating}
              onChange={(e) => setEditRating(Number(e.target.value))}
              className="border p-1"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded mb-8"
          >
            Update Review
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Leave a Review</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your review here..."
            className="w-full border p-2 mt-2"
            rows={4}
          />
          <div className="flex items-center gap-2 mt-2">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-1"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded mb-8 w-full md:w-auto"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
