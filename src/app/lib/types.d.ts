export type User = {
    id: string;
    name: string;
    email: string;
    image?: string
    password: string
    createdAt: Date     
    updatedAt: Date    
    favoriteIds: string[]
  };

export type Listing = {
    id: string
    title: string
    description: string
    imageSrc: string
    createAt: string
    category: string
    roomCount: number
    bathroomCount: number
    guestCount: number
    location: {
      value: string
        label: string
        flag: string
        latlng: number[]
        region: string
    }
    price: number
}

export type Reservation = {
  id: string
  userId: string
  listingId: string
  startDate: Date
  endDate: Date
  totalPrice: number
  createdAt: Date
}