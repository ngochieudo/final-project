'use client'
import { useEffect, useState } from "react";
import Button from "../Button";
import { Backend_URL } from "@/app/lib/Constants";
interface Listing {
  id: string;
  title: string;
  category: string;
  location: {
      value: string;
  };
  price: number;
}
export default function ListingTable(){
    const [data, setData] = useState<Listing[]>([])
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
  }, [data])
  function sortListing() {
    const sortedData = data.sort((a: any,b: any) => a.title.localeCompare(b.title))
    setData(sortedData);
    console.log(data)
  }

    return (
        <div className="overflow-x-auto pt-10">
          <div>
            Total listing: {data.length}
          </div>
          <button
            className="w-[10%] p-2 text-white rounded-lg m-2 hover:opacity-70 bg-blue-600"
            onClick={sortListing}
          >
            Sort listing
          </button>
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Price ($)</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item: Listing, index: number) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="border px-4 py-2">
                    <div
                      onClick={() => {}}
                      className="hover:underline hover:cursor-pointer"
                    >
                    {item.id}
                    </div>
                  </td>
                  <td className="border px-4 py-2 text-center">{item.title}</td>
                  <td className="border px-4 py-2 text-center">{item.category}</td>
                  <td className="border px-4 py-2 text-center">{item.location.value}</td>
                  <td className="border px-4 py-2 text-center">{item.price}</td>
                  <td className="border px-4 py-2">
                        <div className="flex flex-row gap-8">
                        <Button label="Edit" onClick={()=>{}}/>
                        <Button label="Delete" onClick={()=>{}}/>
                        </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

 
