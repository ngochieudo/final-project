import React, { useState } from 'react';
import Slider from 'react-slider';

type PriceFilterProps = {
    minPrice: number;
    maxPrice: number;
    onPriceChange: (value: number[]) => void;
}

const PriceFilter:React.FC<PriceFilterProps> = ({ minPrice, maxPrice, onPriceChange }) => {
    const [range, setRange] = useState([minPrice, maxPrice]);

    const handleSliderChange = (newRange: number[]) => {
        setRange(newRange);
        onPriceChange(newRange);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Price Range</h2>
            <div className="flex items-center justify-between mb-2">
                <span>${range[0]}</span>
                <span>${range[1]}</span>
            </div>
            <Slider
                value={range}
                min={minPrice}
                max={maxPrice}
                onChange={handleSliderChange}
                className="slider"
                thumbClassName="thumb"
                trackClassName="track"
                minDistance={0}
                renderThumb={(props, state) => (
                    <div {...props} className={`thumb ${state.index === 0 ? 'left-thumb' : 'right-thumb'}`}>
                    </div>
                )}
            />
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setRange([minPrice, maxPrice])}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default PriceFilter;
