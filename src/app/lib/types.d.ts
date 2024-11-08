export type User = {
    id: string;
    name: string;
    email: string;
    image?: string
    createdAt: Date     
    updatedAt: Date    
    favoriteIds: string[]
    isAdmin: boolean
  };

export type Listing = {
    id: string
    title: string
    description: string
    imageSrc: string
    createAt: string
    categoryId: string
    roomCount: number
    bathroomCount: number
    guestCount: number
    locationValue: string
    price: number
    isFavorited: boolean
}

export type Category = {
  id: string;
  label: string;
  description: string;
  icon: string;
};


export type Reservation = {
  id: string
  userId: string
  listingId: string
  startDate: Date
  endDate: Date
  totalPrice: number
  createdAt: Date
  status: string
}