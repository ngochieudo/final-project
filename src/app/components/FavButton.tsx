'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Backend_URL } from '../lib/Constants';
import { useSession } from 'next-auth/react';
import useLoginModal from '../hooks/useLoginModal';

interface FavoriteButtonProps {
    listingId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ listingId }) => {
  const [favorited, setFavorited] = useState(false);
  const { data: session } = useSession();
  const loginModal = useLoginModal();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (session) {
        try {
          const response = await axios.get(`${Backend_URL}/favorites/user`, {
            headers: {
              Authorization: `Bearer ${session.backendTokens.accessToken}`,
            },
          });
          const favorites = response.data.favorites;
          // Check if the listingId is in the user's favorites
          setFavorited(favorites.some((fav: { id: string; }) => fav.id === listingId));
        } catch (error) {
          console.error('Error fetching favorite status:', error);
        }
      }
    };
    
    fetchFavoriteStatus();
  }, [session, listingId]);

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!session) {
      loginModal.onOpen();
      return;
    }
    try {
      if (favorited) {
        await axios.delete(`${Backend_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${session.backendTokens.accessToken}`,
          },
          data: { listingId }
        });
      } else {
        await axios.post(`${Backend_URL}/favorites`, { listingId }, {
          headers: {
            Authorization: `Bearer ${session.backendTokens.accessToken}`,
          }
        });
      }
      // Toggle the favorited state
      setFavorited(prev => !prev);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavorited(prev => !prev); // Rollback UI state if needed
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`transition duration-300 ease-in-out transform hover:text-white hover:scale-110 ${
        favorited ? 'text-red-500' : 'text-gray-500'
      }`}
    >
      {favorited ? (
        <div className="relative">
        <AiFillHeart className="h-6 w-6 text-red-500" />
        <AiOutlineHeart className="h-6 w-6 absolute inset-0 text-white" style={{ stroke: 'white', strokeWidth: '2' }} />
      </div>
      ) : (
        <AiOutlineHeart className="h-6 w-6" />
      )}
    </button>
  );
};

export default FavoriteButton;
