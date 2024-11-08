"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import queryString from "query-string";
import { formatISO } from "date-fns";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import { Range } from "react-date-range";
import PriceFilter from "../PriceFilter";

const Search = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [category, setCategory] = useState('')
  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestCountInput, setShowGuestCountInput] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const onSubmit = useCallback(async () => {
    let currentQuery = {};

    if (params) {
      currentQuery = queryString.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
      category
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) { 
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    category,
    params,
  ]);

  return (
    <div
      className="
        border-[1px]
        w-full
        md:w-auto
        py-2
        hidden
        lg:rounded-full
        shadow-sm
        hover:shadow-md
        transition
        cursor-pointer
        relative
        lg:flex
        lg:flex-row
      "
    >
      {/* Location */}
      <div
        className="
          text-sm
          font-semibold
          px-6
          flex-1
          cursor-pointer
        "
        onClick={() => {
          setShowLocationInput(!showLocationInput);
          setShowDatePicker(false);
          setShowGuestCountInput(false);
        }}
      >
        <div className="text-xs font-semibold text-black">Where</div>
        <div className="text-sm text-gray-500">
          {location?.value || "Search destination"}
        </div>
      </div>

      {showLocationInput && (
        <div className="absolute top-16 z-10 bg-white shadow-lg p-4 rounded-lg w-[90%] md:w-[50%]">
          <CountrySelect
            value={location}
            onChange={(value) => setLocation(value as CountrySelectValue)}
          />
          <hr />
          <Map center={location?.latlng} />
        </div>
      )}

      {/* Check In and Out */}
      <div
        className="
          text-sm
          font-semibold
          px-6
          flex-2
          cursor-pointer
          border-t md:border-t-0 md:border-x-[2px]
        "
        onClick={() => {
          setShowDatePicker(!showDatePicker);
          setShowLocationInput(false);
          setShowGuestCountInput(false);
        }}
      >
        <div className="text-xs font-semibold text-black">Check in-out</div>
        <div className="text-sm text-gray-500 ">
          {dateRange?.startDate && dateRange?.endDate
            ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
            : "Add dates"}
        </div>
      </div>

      {showDatePicker && (
        <div className="absolute top-16 z-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4">
          <div className="flex flex-col gap-8">
            <Calendar
              value={dateRange}
              onChange={(value) => setDateRange(value.selection)}
            />
          </div>
        </div>
      )}

      {/* More Info */}
      <div
        className="
          text-sm
          font-semibold
          px-6
          flex-1
          cursor-pointer
          border-t md:border-t-0
        "
        onClick={() => {
          setShowGuestCountInput(!showGuestCountInput);
          setShowLocationInput(false);
          setShowDatePicker(false);
        }}
      >
        <div className="text-xs font-semibold text-black">More info</div>
        <div className="text-sm text-gray-500">
          {guestCount} guests
        </div>
      </div>

      {showGuestCountInput && (
        <div className="absolute top-16 z-10 right-0 bg-white shadow-lg rounded-lg p-4">
          <div className="flex flex-col gap-8">
            <Counter
              title="Guests"
              subtitle="How many guests are coming?"
              value={guestCount}
              onChange={(value) => setGuestCount(value)}
            />
            <Counter
              title="Rooms"
              subtitle="How many rooms do you need?"
              value={roomCount}
              onChange={(value) => setRoomCount(value)}
            />
            <Counter
              title="Bathrooms"
              subtitle="How many bathrooms do you need?"
              value={bathroomCount}
              onChange={(value) => setBathroomCount(value)}
            />
          </div>
        </div>
      )}

      <div
        className="
          p-2
          bg-blue-500
          rounded-full
          text-white
          mx-4
          mt-4 md:mt-0
          self-center md:self-auto
          hover:bg-blue-800
        "
      >
        <BiSearch size={20} onClick={onSubmit} />
      </div>
    </div>
  );
};

export default Search;
