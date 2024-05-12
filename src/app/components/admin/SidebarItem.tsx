'use client'
import { usePathname, useRouter } from 'next/navigation'
import { IconType } from "react-icons"

type SidebarItemProps = {
    icon: IconType,
    label: string,
    href: string
}
export const SidebarItem = ({
    icon: Icon,
    label,
    href
}: SidebarItemProps) => {
    const pathname = usePathname()
    const router = useRouter()


    const isActive = pathname === href 
    const onClick = () => {
        router.push(href)
    }
    return (
        <button
            onClick={onClick}
            type = "button"
            className={isActive?  "text-sky-500 pl-6" 
            : 
            "flex items-center gap-x-3 text-slate-500 text-sm font-[600]  transition-all hover:text-slate-600 hover:bg-slate-300/20"}
        >
        <div className="flex items-center gap-x-2 py-4 pl-2">
            <Icon 
                size={22}
                className= {isActive? "text-sky-500" : "text-slate-500"}
            />
            {label}
        </div>
        </button>
    )
}