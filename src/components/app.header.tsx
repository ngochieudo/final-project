'use client'
import SignInModal from "@/components/signin.modal"
import SideNav from "./sidenav";

import Link from 'next/link'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Image from 'next/image';
import { useState } from "react";




const AppHeader = () => {
    const pages = ['home','about', 'tours', 'blogs', 'contact']
    const [showModalSignIn, setShowModalSignIn] = useState<boolean>(false)
    return (
        
        <header className="px-10 z-10 sticky top-0 flex items-center justify-between w-full border border-b-slate-200 bg-white shadow-lg">
            {/* Header left */}
            <SideNav
                pages={pages}
            />
            <div className="box-border text-base leading-6 text-[#232323] antialiased flex items-center max-md:w-full max-md:justify-center">

                <Link href={"/"}>
                    <Image
                        alt='Logo'
                        height={100}
                        width={100}
                        src='/images/logo-pep-removebg.png'
                    />
                </Link>
            </div>
            {/* Header Center */}
            <div className='w-6/12 max-md:hidden'>
                <ul className='flex justify-center font-bold'>
                    {pages.map((page) => {
                        return (
                            <li key={page} className='px-5 py-4 hover:text-primary '>
                                <Link href={page == 'home'? '/' : `/${page}`} className='capitalize'>{page}</Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {/* Header Right */}
            <div className='box-border text-base text-[#232323]'>
                <ul className='flex items-center p-8 max-md:p-0'>
                    <li className='rounded-full hover:shadow-lg p-4 cursor-pointer border-solid border-slate-500 border-[1px] mx-3 max-md:m-0 max-md:border-none max-md:p-1'>
                        <ShoppingCartOutlinedIcon />
                    </li>
                    <li className='rounded-full hover:shadow-lg p-4 cursor-pointer border-solid border-slate-500 border-[1px] mx-3 max-md:m-0 max-md:border-none max-md:p-1' onClick={() => setShowModalSignIn(true)}>
                        <PersonOutlinedIcon />
                    </li>
                </ul>
            </div>
            <SignInModal
                showModalSignIn={showModalSignIn}
                setShowModalSignIn={setShowModalSignIn}
            />

        </header>
    )
}
export default AppHeader