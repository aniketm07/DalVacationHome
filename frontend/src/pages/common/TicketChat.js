import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import SlideDrawer from "../../components/SlideDrawer";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import ChatWindow from "../../components/ChatWindow";
import { getEmail } from "../../lib/session";
import ChatComponent from "../../components/ChatComponent";

function TicketChat() {
  const [chatList, setChatList] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await getEmail();
      setUserEmail(email);
    };
    fetchEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      const unsubscribe = onSnapshot(doc(db, "chatList", userEmail), (doc) => {
        if (!doc.exists()) {
          return;
        }
        const data = doc.data();
        const sortedData = Object.entries(data).sort(
          (a, b) => b[1].lastMessageTimestamp - a[1].lastMessageTimestamp
        );
        const sortedChatList = sortedData.map(([id, chat]) => ({ id, ...chat }));
        setChatList(sortedChatList);
      });

      return () => unsubscribe();
    }
  }, [userEmail]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <>
      <Header color="#471AA0" />
      <div className="flex h-screen antialiased text-gray-800 mt-14">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <SlideDrawer chatList={chatList} handleSelectChat={handleSelectChat} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
          {selectedChat && <ChatWindow selectedChat={selectedChat} />}
          {chatList && !selectedChat && (
            <div className="w-full h-full flex justify-center items-center italic" style={{ maxHeight: "calc(100vh - 2.5rem)" }}>
              Select a ticket to start messaging
            </div>
          )}
          {!chatList && (
            <div className="w-full h-full flex justify-center items-center italic" style={{ maxHeight: "calc(100vh - 2.5rem)" }}>
              No tickets available
            </div>
          )}
        </div>
      </div>
      <ChatComponent />
    </>
  );
}

export default TicketChat;
