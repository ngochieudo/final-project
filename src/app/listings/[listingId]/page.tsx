'use client'
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import { Backend_URL } from "@/app/lib/Constants";
import { Listing } from "@/app/lib/types";
import { useEffect, useState } from "react";

interface Params {
    listingId: string;
  }

const ListingPage = ({params} : {params: Params}) => {
    const [listing, setListing] = useState<Listing | null>(null)

    useEffect(() => {
        const getListing = () => {
            fetch(`${Backend_URL}/listings/${params.listingId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data: Listing) => {
            setListing(data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          })
        }
        getListing()
    }, [])
    console.log(listing)
    if(!listing) {
        return (
            <ClientOnly>
                <EmptyState/>
            </ClientOnly>   
        )
    }
    return (  
        <ClientOnly>
            {listing.title}
        </ClientOnly>
    );
}
 
export default ListingPage;