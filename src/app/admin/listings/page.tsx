'use client'
import Button from "@/app/components/Button";
import Container from "@/app/components/Container";
import ListingTable from "@/app/components/admin/ListingTable";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { BiPlus } from "react-icons/bi";

const AdminListing = () => {
    const rentModal = useRentModal();
    const { data: session } = useSession();
    const loginModal = useLoginModal();

    const onRent = useCallback(() => {
        if(!session) {  
            loginModal.onOpen()
            rentModal.onClose()
        }
        rentModal.onOpen();
    }, [session, loginModal, rentModal])
    return ( 
        
        <div className="py-10">
            <Container>
                <div className="flex flex-row">
                    <Button
                        label="Add new place"
                        onClick={onRent}
                        icon={BiPlus}
                    />
                </div>
                <ListingTable/>
            </Container>  
        </div>
     );
}
 
export default AdminListing;