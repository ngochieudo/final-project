'use client'

import Container from "../Container";
import {TbBeach, TbPool} from 'react-icons/tb' 
import {GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiMountains, GiSailboat, GiWheat, GiWindmill} from 'react-icons/gi' 
import {MdOutlineVilla, MdPark, MdSportsGolf} from 'react-icons/md' 
import {FaMountain, FaSkiing} from 'react-icons/fa' 
import {BsSnow} from 'react-icons/bs'
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

export const categories = [
    {
        label: 'Beach',
        icon: TbBeach,
        description: 'This property is close to the beach'
    },
    {
        label: 'Countryside',
        icon: GiWheat,
        description: 'This property is in the countryside'
    },
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'This property is modern'
    },
    {
        label: 'Pools',
        icon: TbPool,
        description: 'This property has a pool'
    },
    {
        label: 'Islands',
        icon: GiIsland,
        description: 'This property is on a island'
    },
    {
        label: 'Lake',
        icon: GiBoatFishing,
        description: 'This property is close to a lake'
    },
    {
        label: 'Skiing',
        icon: FaSkiing,
        description: 'Places for skiing'
    },
    {
        label: 'Golfs',
        icon: MdSportsGolf,
        description: 'Places for golfing activities'
    },
    {
        label: 'Historical',
        icon: GiCastle,
        description: 'Historical places'
    },
    {
        label: 'Camping',
        icon: GiForestCamp,
        description: 'This property has camping activies'
    },
    {
        label: 'Farmhouse',
        icon: GiBarn,
        description: 'This property belong to a farm'
    },
    {
        label: 'Boat',
        icon: GiSailboat,
        description: 'Is in the boat'
    },
    {
        label: 'Cave',
        icon: GiCaveEntrance,
        description: 'This property is in the cave'
    },
    {
        label: 'Desert',
        icon: GiCactus,
        description: 'This property is in desert'
    },
    {
        label: 'Mountain',
        icon: FaMountain,
        description: 'This property is in mountain'
    },
    {
        label: 'Arctic',
        icon: BsSnow,
        description: 'This property is in arctic'
    },
    {
        label: 'National park',
        icon: MdPark,
        description: 'This property is in national park'
    },
    
]
const Categories = () => {
    const params = useSearchParams()
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';

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