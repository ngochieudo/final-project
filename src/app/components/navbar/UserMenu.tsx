'use client'
import MenuItem from './MenuItem';
import Avatar from '../Avatar';
import {AiOutlineMenu} from 'react-icons/ai'
import { signOut, useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

const UserMenu = () => {

    const { data: session } = useSession();

    const registerModal = useRegisterModal()

    const loginModal = useLoginModal()



    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    
    
    return ( 
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                {session? (
                    <div
                    className="
                        hidden
                        md:block
                        text-sm
                        font-semibold
                        py-3
                        px-4
                        rounded-full
                        hover:bg-neutral-100
                        transition
                        cursor-pointer
                    "
                >
                    Welcome, {session.user.name}
                </div>
                ): (
                    <div className='
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:bg-neutral-100
                    transition
                    '>
                        Let me journey begin
                    </div>
                )}
                <div
                    onClick={toggleOpen}
                    className="
                        p-4
                        md:py-1
                        md:px-2
                        border-[1px]
                        border-neutral-200
                        flex
                        flex-row
                        items-center
                        gap-3
                        rounded-full
                        cursor-pointer
                        hover:shadow-md
                        transition
                        font-semibold
                    "
                >
                    <AiOutlineMenu />
                    <div className='hidden md:block'>
                        <Avatar src={session?.user.image}/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className='
                    absolute
                    rounded-xl
                    shadow-md
                    w-[40vw]
                    md:w-3/4
                    bg-white
                    overflow-hidden
                    right-0
                    top-12
                    text-sm
                '
                >
                    <div className='flex flex-col cursor-pointer'>
                        {session? (
                        <>
                            <MenuItem 
                                onClick={() => {}}
                                label="My favorites"
                            />
                            <MenuItem 
                                onClick={() => {}}
                                label="My reservations"
                            />
                            <MenuItem 
                                onClick={() => {}}
                                label="My profile"
                            />
                            <hr />
                            <MenuItem 
                                onClick={() => signOut()}
                                label="Log out"
                            />
                        </>
                        ): (
                        <>
                            <MenuItem 
                                onClick={loginModal.onOpen} 
                                 label="Login"
                            />
                            <MenuItem 
                                onClick={registerModal.onOpen} 
                                label="Sign up"
                            />
                        </>
                        )}
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default UserMenu;