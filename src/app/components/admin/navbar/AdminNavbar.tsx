'use client'
import { useRouter } from "next/navigation";
import Logo from "../../navbar/Logo";
import Search from "../../navbar/Search";
import UserMenu from "../../navbar/UserMenu";
import Container from "../../Container";
import { User } from "@/app/lib/types";

interface NavbarProps {
    currentUser?: User | null
} 
const AdminNavbar:React.FC<NavbarProps> = ({
    currentUser
}) => {
    console.log(currentUser)
    return (
        <div className="w-full bg-white z-10 shadow-sm">
            <div className="
                py-4
                border-b-[1px]
            ">
                <Container>
                    <div className="
                        flex 
                        flex-row
                        items-center
                        justify-between
                        gap-3
                        md:gap-0
                    "
                    >
                        <Logo />
                        <UserMenu/>
                    </div>
                </Container>
            </div>
        </div>
    )
}


export default AdminNavbar;
