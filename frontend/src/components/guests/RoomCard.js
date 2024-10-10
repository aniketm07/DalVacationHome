import { useNavigate } from "react-router-dom";

export default function RoomCard({ room }) {
  const navigate = useNavigate();
  const handleRoomClick = () => {
    console.log(room);
    navigate(`/room/${room.roomId}`);
  }
  return (
      <div className="bg-white">
        <a key={room.roomId} href={room.href} className="group text-sm">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
            <img
                alt={room.roomDescription}
                src={room.imageUrl}
                className="h-full w-full max-h-96 object-cover object-center"
            />
          </div>
          <div className="flex flex-row justify-between items-end">
            <div>
              <h3 className="mt-4 font-medium text-gray-900">{room.roomName}</h3>

              <p className="mt-2 font-medium text-gray-900">{room.price}</p>
            </div>
            <div>
              <button
                  type="submit"
                  className="flex w-full mt-4 justify-center rounded-md bg-indigo-600 px-4 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleRoomClick}
              >
                Details
              </button>
            </div>
          </div>
        </a>
      </div>
  );
}
