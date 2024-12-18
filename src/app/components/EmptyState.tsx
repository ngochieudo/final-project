'use client'
import { useRouter } from "next/navigation"
import Heading from "./Heading"
import Button from "./Button"

interface EmptyState {
    title?: string
    subtitle?: string
    showReset?: boolean   
}

const EmptyState:React.FC<EmptyState> = ({
    title = "No exact matches",
    subtitle = "We don't have anything to match your requirement, try again!",
    showReset
}) => {
    const router = useRouter()
    return ( 
        <div
            className="
                h-full
                flex
                flex-col
                gap-2
                justify-center
                items-center
            "
        >
            <Heading
                title={title}
                subtitle={subtitle}
                center
            />
            <div className="w-48 mt-4">
                {showReset && (
                    <Button
                        outline
                        label="Reset filter"
                        onClick={() => router.push('/')}
                    />
                )}
            </div>
        </div>
     );
}
 
export default EmptyState;