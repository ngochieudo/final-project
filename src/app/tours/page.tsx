'use client'
import PriceFilter from "@/components/price.filter";
import ProductCard from "@/components/product.card";
import { useState } from "react";
export default function ToursList() {
    return (
        <div className="flex w-9/12 m-auto py-10">
            <div className="w-1/4 px-[12px] max-lg:hidden">
                <PriceFilter/>
                <div className="bg-slate-50  rounded-[20px] my-4">
                    
                </div>
            </div>
            <div className="w-3/4 max-lg:w-full  flex justify-evenly">
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>
        </div>
    )

}