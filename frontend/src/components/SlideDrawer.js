import defaultPic from "../assets/images/Default.png";
import doubletick from "../assets/images/doubletick.png";
import { getEmail } from  "../lib/session";
import { useEffect, useState } from "react";

function SlideDrawer({ chatList, handleSelectChat, selectedChat }) {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await getEmail();
      setUserEmail(email);
    };
    fetchEmail();
  }, []);
  const handleChatClick = (chat) => {
    handleSelectChat(chat);
  };

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      {chatList && chatList.length !== 0 && (
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">Active Tickets</span>
              <span className="flex items-center justify-center bg-red-600 text-white font-semibold h-5 w-5 rounded-full">
                {chatList?.length}
              </span>
            </div>
            <div className="flex flex-col space-y-1 mt-4 -mx-2 overflow-y-auto gap-1">
              {chatList?.map((chat) => (
                <div className="w-full" key={chat.ticketId}>
                  <button
                    className={`relative flex flex-row w-full items-center rounded-xl p-2 ${
                      selectedChat?.id === chat.id
                        ? "bg-gray-200"
                        : "hover:bg-gray-200"
                    } transition ease-in-out duration-300`}
                    onClick={() => handleChatClick(chat)}
                    title={chat.id}
                  >
                    <img
                      src={defaultPic}
                      className="flex items-center justify-center h-12 w-12 bg-indigo-200 rounded-full"
                      alt={`DP of ${chat.ticketId}`}
                    />
                    <div className="flex flex-col ml-2 text-left">
                      <div
                        className="text-sm max-w-40 font-semibold overflow-hidden whitespace-nowrap text-ellipsis"
                      >
                        {chat.ticketId}
                      </div>
                      <div className="flex flex-row gap-1 max-w-40 text-xs text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                        {chat.lastMessageBy === userEmail && <img src={doubletick} className="w-4 h-4" alt="double tick" />} {chat.lastMessage}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlideDrawer;
