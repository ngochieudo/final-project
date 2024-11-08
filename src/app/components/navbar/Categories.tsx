'use client'

import Container from "../Container";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Backend_URL } from "@/app/lib/Constants";

interface Category {
    id: string;
    label: string;
    description: string;
    icon: string;
}

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const params = useSearchParams()
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${Backend_URL}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    if(!isMainPage) {
        return null
    }

    return ( 
        <Container>
            <div className="
                pt-4
                flex
                flex-row
                items-center
                justify-between
                overflow-x-auto
            ">
            {categories.map(item => (
                <CategoryBox
                    key={item.label}
                    label={item.label}
                    selected={category === item.label}
                    icon={item.icon}
                />
            ))}
            </div>
        </Container>   
     );
}
 
export default Categories;