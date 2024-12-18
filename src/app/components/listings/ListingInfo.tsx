'use client'

import useCountries from "@/app/hooks/useCountries";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../Map'), {
    ssr: false
});

interface ListingInfoProps {
    description?: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category?: {
        icon: string;
        label: string;
        description: string;
    } | undefined
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
    locationValue
}) => {
    const { getByValue } = useCountries();
    const coordinates = getByValue(locationValue)?.latlng;
    return ( 
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-4 text-neutral-500">
                    <div>
                        {guestCount} guests
                    </div>
                    <div>
                        {roomCount} rooms
                    </div>
                    <div>
                        {bathroomCount} bathrooms
                    </div>
                </div>
            </div>
            <hr />
            {category && (
                <ListingCategory
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                />
            )}
            <hr />
            <div className="text-lg font-light text-neutral-500">
                {description}
            </div>
            <hr />
            <Map center={coordinates}/>
        </div>
     );
}
 
export default ListingInfo;