'use client'

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { User } from "../lib/types";

interface FavButtonProps {
    listingId: string
    currentUser?: User | null
}
const FavButton:React.FC<FavButtonProps> = ({
    listingId, currentUser
}) => {
    const hasFavorited = false
    const toggleFavorite = () => {

    }

    return ( 
        <div
            onClick={toggleFavorite}
            className="
                relative
                hover:opacity-80
                transtion
                cursor-pointer
            "
        >
            <AiOutlineHeart
                size={28}
                className="
                    fill-white
                    absolute
                    -top-[2px]
                    -right-[2px]
                "
            />
            <AiFillHeart
                size={24}
                className={
                    hasFavorited ? 'fill-red-600' : ' fill-neutral-500/70'
                }
            />
        </div>
     );
}
 
export default FavButton;