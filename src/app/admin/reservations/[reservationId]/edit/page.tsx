'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Backend_URL } from '@/app/lib/Constants';
import toast from 'react-hot-toast';

import { Range } from 'react-date-range';
import Calendar from '@/app/components/inputs/Calendar';

interface Params {
    reservationId: string
}

const EditReservation = ({ params } : { params : Params}) => {
  const [reservation, setReservation] = useState({
    startDate: '',
    endDate: '',
    totalPrice: '',
    status: '',
  });

  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const router = useRouter();

  useEffect(() => {
    axios.get(`${Backend_URL}/reservations/${params.reservationId}`).then((response) => {
      const { startDate, endDate, totalPrice, status } = response.data;
      setReservation({ startDate, endDate, totalPrice, status });

      // Initialize the date range for the calendar
      setDateRange({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        key: 'selection',
      });
    });
  }, [params.reservationId]);

  const handleDateChange = (ranges: any) => {
    const { selection } = ranges;
    setDateRange(selection);

    setReservation((prevState) => ({
      ...prevState,
      startDate: selection.startDate,
      endDate: selection.endDate,
    }));
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await axios.patch(`${Backend_URL}/reservations/${params.reservationId}`, {
        ...reservation,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        totalPrice: Number(reservation.totalPrice),
      });
      toast.success('Updated reservation successfully');
      router.push('/admin/reservations');
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Error updating reservation!!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Reservation</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">Date Range</label>
          <Calendar 
            value={dateRange} 
            onChange={handleDateChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">Total Price</label>
          <input
            type="number"
            name="totalPrice"
            value={reservation.totalPrice}
            onChange={handleChange}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">Status</label>
          <select
            name="status"
            value={reservation.status}
            onChange={handleChange}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Check in">Check in</option>
            <option value="Check out">Check out</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReservation;
