'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import qs from 'query-string';
import Image from 'next/image';

interface CategoryBoxProps {
    icon: string;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ icon, label, selected }) => {
    const router = useRouter();
    const params = useSearchParams();
    const [isLabelVisible, setIsLabelVisible] = useState(true);

    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            category: label,
        };

        // If the category is already selected, clear the filter
        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery,
        }, { skipNull: true });

        router.push(url);
    }, [label, params, router]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsLabelVisible(scrollTop === 0);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            onClick={handleClick}
            className={`
                flex
                flex-col
                items-center
                justify-center
                gap-2
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                ${selected ? 'text-neutral-800' : 'text-neutral-500'}
                ${isLabelVisible? 'p-3' : 'p-0'}
            `}
        >
            <Image src={icon} alt={label} width={24} height={24} />
            <div
                className={`font-medium text-xs transition-opacity transition-max-height duration-300 ${isLabelVisible ? 'max-h-10' : 'opacity-0 max-h-0 overflow-hidden'}`}
            >
                {label}
            </div>
        </div>
    );
};

export default CategoryBox;
