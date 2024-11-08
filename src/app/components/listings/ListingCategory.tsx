import Image from "next/image";


interface ListingCategoryProps {
    icon: string;
    label: string;
    description: string;
}

const ListingCategory: React.FC<ListingCategoryProps> = ({
    icon,
    label,
    description
}) => {
    
    return ( 
        <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center gap-4">
                <Image src={icon} alt={label} width={40} height={40} />
                <div className="flex flex-col">
                    <div className="text-lg font-semibold">
                        {label}
                    </div>
                    <div className="text-neutral-500 font-light">
                        {description}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default ListingCategory;