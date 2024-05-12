'use client'
import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import ListingCard from "@/app/components/listings/ListingCard";

import { Backend_URL } from "@/app/lib/Constants";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export default function Home() {
    const [data, setData] = useState([])
    const [currentUser, setCurrentUser] = useState()
    const {data: session} = useSession()
    useEffect(() => {
      const fetchCurrentUser = async () => {
        if (session) {
          try {
            const response = await fetch(`${Backend_URL}/users/profile`, {
              headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
              },
            });;
            if (response.ok) {
              const userData = await response.json();
              setCurrentUser(userData);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      };
  
      fetchCurrentUser();
    }, [session]);

    useEffect(() => {
      const fetchData =  () => {

        fetch(`${Backend_URL}/listings`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setData(data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          })
    }
    fetchData();
  }, [])

    if(data.length === 0) {
        return (
            <EmptyState showReset/>
        )
    }
    return ( 
        <div>
            <Container>
                <div className="
                    pt-40
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-8
                "> 
                    {data.map((item : any)=>{
                        return (
                            <ListingCard
                                currentUser={currentUser}
                                key={item.id}
                                data={item}
                            /> 
                        )
                    })}
                </div>
            </Container>
        </div>
     );
}
 