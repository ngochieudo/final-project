'use client';
import { BiChart } from "react-icons/bi";
import { FaBook, FaUser } from "react-icons/fa";
import { GiHouse, GiTalk } from "react-icons/gi";
import { SidebarItem } from "./SidebarItem";
const adminRoutes = [
    {
        label: 'Dashboard',
        icon: BiChart,
        href: '/admin'
    },
    {
        label: 'Listing',
        icon: GiHouse,
        href: '/admin/listings'
    },
    {
        label: 'User',
        icon: FaUser,
        href: '/admin/users'
    },
    {
        label: 'Categories',
        icon: FaBook,
        href: '/admin/categories'
    }
]
export const SidebarRoutes = () => {

    return (
        <div className="
        flex 
        flex-col 
        w-1/6
        border-r-[1px]">
            {adminRoutes.map(route => (
                <SidebarItem 
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
            />
            ))}
        </div>
    )
}