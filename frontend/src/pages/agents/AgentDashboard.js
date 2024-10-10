// AgentDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/agents/Card";
import ChatComponent from "../../components/ChatComponent";
import { ROOMS_ENDPOINT } from "../../constants/constants.js";

function AgentDashboard() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(ROOMS_ENDPOINT);
        const data = await response.json();
        console.log("Fetched rooms:", JSON.parse(data.body));
        setRooms(JSON.parse(data.body));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleAddRoom = () => {
    navigate("/room-details-form"); // Adjust the path as per your routing configuration
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header color="#471AA0" />
      <div className="flex flex-1">
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center border-b border-indigo-200 pb-6 pt-24">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#471AA0]">
              Room management
            </h1>

            <div className="flex items-center">
              <button
                type="button"
                onClick={handleAddRoom}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Room
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <ul className="space-y-6">
              {rooms && rooms.length > 0 ? (
                rooms.map((room) => (
                  <li key={room.id}>
                    <Card room={room} />
                  </li>
                ))
              ) : (
                <p>No rooms found.</p>
              )}
            </ul>
          </section>
        </main>
      </div>
      <Footer />
      <ChatComponent />
    </div>
  );
}

export default AgentDashboard;
