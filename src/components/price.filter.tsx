import { Button, Slider } from "@mui/material";

export default function PriceFilter() {
    return (
        <div className="bg-slate-50  rounded-[20px]">
            <div className="py-8 px-5">
                <h1 className="font-bold">Filter Price</h1>
                {/*Slider content*/}
                <div className="mt-5">
                    <Slider
                        sx={{
                            width: '95%',
                            marginLeft: '8px',
                            '& .MuiSlider-thumb': {
                                backgroundColor: 'white',
                                border: '1px solid',
                            },
                        }}
                        value={[0, 1000000]}
                    />
                    <div className="flex justify-between">
                        <div className="w-2/5 h-[50px] border border-solid border-[#dedede] rounded-[10px] flex flex-col justify-center items-center">
                            <h3 className="text-xs text-slate-500">Min price</h3>
                            <span className="font-medium block text-[14px]">đ</span>
                        </div>
                        <div className="w-2/5 h-[50px] border border-solid border-[#dedede] rounded-[10px] flex flex-col justify-center items-center">
                            <h3 className="text-xs text-slate-500">Max price</h3>
                            <span className="font-medium block text-[14px]">đ</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-10">
                        <Button className="capitalize text-base">Clear</Button>
                        <Button
                            variant="contained"
                            className="capitalize font-medium rounded-[20px] bg-blue-700 text-white px-5 py-2 text-base"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}