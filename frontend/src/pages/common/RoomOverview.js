import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL, roomDetails } from "../../constants/constants";
import Reviews from "../../components/guests/booking/Reviews";
import FeedbackModal from "../../components/guests/booking/FeedbackModal";
import RoomDetails from "../../components/guests/booking/RoomDetails";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import { getSession, getEmail } from "../../lib/session";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatComponent from "../../components/ChatComponent";

export default function RoomOverview() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [reviews, setReviews] = useState(null);
  const token = getSession();
  const email = getEmail();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/rooms/${roomId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    }).then((response) => {
      const data = JSON.parse(response.data.body);
      console.log(data);
      if(data.message === "Room Not Found") {
        toast.error("Room not found");
        setTimeout(() => {
          navigate("/error");
        }, 3000);
        
      }
      setRoom(data);
    }).catch((error) => {
      console.error("Error fetching room:", error);
      navigate("/");
    });

    axios.get(`${API_URL}/api/feedback/${roomId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    }).then((response) => {
      console.log(response);
      const data = JSON.parse(response.data.body);
      setReviews(data);
    }).catch((error) => {
      console.error("Error fetching reviews:", error);
    });

  }, [roomId]);

  return (
    <div>
      {room  && (
        <div>
          <Header color="#471AA0" />
          <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
              <div className=" lg:col-span-4 lg:row-end-1">
                <div className=" max-h-96 aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    alt={room.imageAlt}
                    src={room.imageUrl}
                    className="object-cover object-center"
                  />
                </div>
              </div>
              {room && <RoomDetails room={room} />}

              {room && <Reviews reviews={reviews} setOpenModal={setOpenModal} />}
            </div>
          </div>
          <FeedbackModal roomId={roomId} open={openModal} setOpen={setOpenModal} />
          <Footer />
        </div>
      )}
      <ToastContainer />
      <ChatComponent />
      {(!room) && <Loader />}
      
    </div>
  );
}
