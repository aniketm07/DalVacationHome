import { useEffect, useState } from "react";
import { doc, onSnapshot, collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db, chatDb, chatMessagesCollection } from "../lib/firebase";
import doubletick from "../assets/images/doubletick.png";
import { getEmail } from "../lib/session";

function ChatWindow({ selectedChat }) {
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await getEmail();
      setUserEmail(email);
    };
    fetchEmail();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const unsubscribe = onSnapshot(collection(db, chatDb, selectedChat.id, chatMessagesCollection), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(data);
        const sortedMessages = data.sort((a, b) => a.timeStamp - b.timeStamp);
        setMessages(sortedMessages);
      });

      return () => unsubscribe();
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    const currentTime = Date.now();
    const messageData = {
      message: newMessage,
      role: "AGENT",
      sender: userEmail,
      timeStamp: currentTime
    };

    try {
      const chatRef = doc(db, chatDb, selectedChat.id);
      await addDoc(collection(chatRef, chatMessagesCollection), messageData);
      setNewMessage("");

      // Update lastMessage and lastMessageTimestamp in chatList
      const chatListRef = collection(db, "chatList");
      const q = query(chatListRef, where(`${selectedChat.id}`, "!=", null));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          [`${selectedChat.id}.lastMessage`]: newMessage,
          [`${selectedChat.id}.lastMessageTimestamp`]: currentTime,
          [`${selectedChat.id}.lastMessageBy`]: userEmail
        });
      });

    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div
      className="flex flex-col flex-auto p-6"
      style={{ maxHeight: "calc(100vh - 2.5rem)" }}
    >
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
        <div className="flex flex-row justify-between mb-4 sticky">
          <span className="text-lg font-bold">
            Chat for - {selectedChat && selectedChat.id}
          </span>
        </div>
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            {messages && messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start mb-2 ${message.sender === userEmail ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-xs lg:max-w-md ${message.sender === userEmail ? "bg-indigo-100" : "bg-white"} text-sm py-2 px-4 shadow rounded-xl`}
                >
                  <div>{message.message}</div>
                  <div className="flex gap-1 justify-end text-xs text-gray-500 mt-1">
                    {formatDate(message.timeStamp)}
                    {message.sender === userEmail && <img src={doubletick} className="w-4 h-4" alt="double tick" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <div className="flex-grow">
            <div className="relative w-full">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 focus:border-2 pl-4 h-10"
              />
            </div>
          </div>
          <div className="ml-4">
            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 h-10 font-semibold flex-shrink-0"
            >
              <span className="hidden lg:block">Send</span>
              <span className="lg:ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
