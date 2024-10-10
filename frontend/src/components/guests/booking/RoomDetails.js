import { useState, useEffect } from "react";
import CalendarComponent from "./CalendarComponent";
import { getSession } from "../../../lib/session";

function RoomDetails({ room }) {
  const isLoggedIn = getSession() !== undefined;
  const [selectedDates, setSelectedDates] = useState([new Date()]);
  const [finalPrice, setFinalPrice] = useState(room.price);
  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    if (selectedDates.length === 2) {
      const formattedDates = selectedDates.map(date => {
        const year = date.year;
        const month = String(date.monthIndex + 1).padStart(2, '0'); // monthIndex is 0-based
        const day = String(date.day).padStart(2, '0');
        return `${year}/${month}/${day}`;
      });

      const date1 = new Date(formattedDates[0]);
      const date2 = new Date(formattedDates[1]);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
      setFinalPrice(room.price * (diffDays + 1));

      // Generate all dates between date1 and date2
      const getDatesBetween = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          dates.push(`${year}/${month}/${day}`);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      };

      const allDates = getDatesBetween(date1, date2);
      console.log(allDates);
      setReservedDates(allDates);
    }
  }, [selectedDates]);

  return (
    <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
      <div className="flex flex-col-reverse">
        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {room.roomName}
          </h1>
          <p className="text-sm text-gray-500">{room.roomAddress}</p>
        </div>
      </div>

      <p className="mt-6 text-gray-500">{room.roomDescription}</p>
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900">Details</h3>
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm text-gray-500">
          <p className="col-span-1">Bedroom: {room.bedroomCount}</p>
          <p className="col-span-1">Bathroom: {room.bathroomCount}</p>
          <p className="col-span-1">Type: {room.roomType}</p>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900">Amenities</h3>
        <div className="prose prose-sm mt-4 text-gray-900">
          <ul className="grid grid-cols-3 gap-4 list-inside">
            {room.amenities?.map((amenity, index) => (
              <li key={index} className="text-sm col-span-1">
                ✓ {amenity}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {room && <CalendarComponent setSelectedDates={setSelectedDates}/>}
      
      <button
        type="button"
        className={`flex w-full mt-10 items-center justify-center rounded-md px-8 py-3 text-base font-medium text-white transition-all ease-in-out duration-300 ${isLoggedIn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
        disabled={!isLoggedIn}
      >
        Pay ${finalPrice}
      </button>
    </div>
  );
}

export default RoomDetails;
