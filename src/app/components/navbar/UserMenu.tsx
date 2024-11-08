"use client";
import { useCallback, useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MenuItem from "./MenuItem";
import Avatar from "../Avatar";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

const UserMenu = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(session);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedSession = await getSession();
      setCurrentSession(updatedSession); 
    }, 5 * 60 * 1000); 

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    if (session !== currentSession) {
      setCurrentSession(session); 
    }
  }, [session, currentSession]);


  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };


  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {!currentSession?.user ? (
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
            "
          >
            Let your journey begin
          </div>
        ) : (
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
            Welcome, {currentSession?.user?.name}
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
          <div className="hidden md:block">
            <Avatar src={currentSession?.user?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
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
          "
        >
          <div className="flex flex-col cursor-pointer">
            {currentSession && currentSession.user ? (
              <>
                <MenuItem onClick={() => router.push("/favorites")} label="My favorites" />
                <MenuItem
                  onClick={() => router.push("/reservations")}
                  label="My reservations"
                />
                <MenuItem onClick={() => router.push("/profile")} label="My profile" />
                <hr />
                <MenuItem onClick={handleSignOut} label="Log out" />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label="Login" />
                <MenuItem onClick={registerModal.onOpen} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
