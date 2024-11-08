'use client'
import Heading from "../Heading";
import useCountries from "@/app/hooks/useCountries";
import Image from "next/image";
import FavButton from "../FavButton";

interface ListingHeadProps {
    title: string;
    locationValue: string;
    imageSrc: string;
    id: string;
}

const ListingHead:React.FC<ListingHeadProps> = ({
    title,
    locationValue,
    imageSrc,
    id,

}) => {
    const { getByValue } = useCountries();

    const location = getByValue(locationValue)

    return ( 
        <>
            <div className="
                w-full
                h-[50vh]
                overflow-hidden
                rounded-xl
                relative
            ">
                <Image
                    alt="Image"
                    src={imageSrc}
                    fill
                    className="object-cover w-full"
                />
                <FavButton listingId={id}/>
            </div>
            <Heading
                title={title}
                subtitle={`${location?.region}, ${location?.label}`}
            />
        </>
     );
}
 
export default ListingHead;