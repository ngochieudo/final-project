"use client";
import useCountries from "@/app/hooks/useCountries";
import { Listing, Reservation } from "@/app/lib/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import Button from "../Button";
import FavButton from "../FavButton";

interface ListingCardProps {
  data: Listing;
  reservation?: Reservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  isReservationPage?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = " ",
  isReservationPage
}) => {
  const router = useRouter();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }
    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  const countryValue = useCountries().getByValue(data.locationValue);

  return (
    <div
      onClick={() => !disabled && isReservationPage? router.push(`/reservations/${reservation?.id}`) : router.push(`/listings/${data.id}`)} // Disable navigation if card is disabled
      className={`col-span-1 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex flex-col gap-2 w-full rounded-xl shadow-md">
        <div className="aspect-square w-full relative overflow-hidden rounded-t-xl">
          <Image
            fill
            alt="Listing"
            src={data.imageSrc}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            className="
              object-cover
              h-full
              w-full
              group-hover:scale-110
              transition
              duration-1000
            "
          />
          <div className="absolute top-3 right-3">
            <FavButton listingId={data.id} />
          </div>
        </div>
        <div className="font-bold text-lg px-6 py-2 truncate">{data.title}</div>
        <div className="text-sm px-6 pb-2 text-neutral-500 truncate-text">
          {countryValue?.region}, {countryValue?.label}
        </div>
        <div className="font-light text-neutral-500 px-6">
          {reservationDate}
        </div>
        <div className="flex flex-row items-center gap-1 border-t-[1px] border-t-neutral-300 pt-4 p-6">
          <div className="font-semibold">$ {price}</div>
          {!reservation && <div className="font-light">/ night</div>}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
