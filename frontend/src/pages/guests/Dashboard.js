import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RoomCard from "../../components/guests/RoomCard";
import ChatComponent from "../../components/ChatComponent";
import axios from "axios";
import { getSession } from "../../lib/session";
import { GET_ROOMS } from "../../constants/constants";

export default function Dashboard() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const session = getSession();
    console.log(session);

    axios
      .get(GET_ROOMS)
      .then((response) => {
        console.log(JSON.parse(response.data.body));
        setRooms(JSON.parse(response.data.body));
        setFilteredRooms(response.data);
        console.log(response);
      })
      .catch((error) => {
        setError("Failed to fetch rooms. Please try again later.");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // Filter rooms based on search term
    if (rooms && rooms.length > 0 && searchTerm) {
      const filtered = rooms.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRooms(filtered);
    }else{
      setFilteredRooms(rooms);
    }
  }, [searchTerm, rooms]);

  return (
    <div className="flex flex-col min-h-screen">
      <ChatComponent />
      <Header color="#471AA0" />
      <div className="flex flex-1">
        <Dialog
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear" />
          <div className="fixed inset-0 z-40 flex">
            <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              {/* Add filter options here */}
            </DialogPanel>
          </div>
        </Dialog>

        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center border-b border-indigo-200 pb-6 pt-24">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#471AA0]">
              Find Your Room
            </h1>

            <div className="flex items-center">
              <input
                id="search"
                name="search"
                type="text"
                required
                placeholder="Enter room name"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full min-w-44 sm:min-w-64 md:min-w-80 rounded-md border-0 px-4 py-1 md:py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6 placeholder:text-sm"
              />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Rooms
            </h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 lg:gap-x-8">
              {error && <div className="text-red-500">{error}</div>}
              {filteredRooms && filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))
              ) : (
                <div className="text-red-500">No rooms found.</div>
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
