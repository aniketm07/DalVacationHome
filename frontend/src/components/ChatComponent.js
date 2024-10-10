import React, { useState, useEffect, useRef } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleBottomCenterTextIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import AWS from "aws-sdk";
import { getEmail, getSession } from "../lib/session";
import { lexCredentials } from "../constants/credentials";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const chatBoxRef = useRef(null);
  const [guestEmail, setGuestEmail] = useState("");
  const sessionToken = getSession();

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await getEmail();
      setGuestEmail(email);
    };
    fetchEmail();
  }, []);

  AWS.config.update({
    region: lexCredentials.region,
    accessKeyId: lexCredentials.accessKeyId,
    secretAccessKey: lexCredentials.secretAccessKey,
  });


  const handleSend = () => {
    if (input.trim() !== "") {
      const userMessage = { text: input, sender: "user" };
      setMessages([...messages, userMessage]);
      sendToLex(input);
      setInput("");
    }
  };

  const sendToLex = (message) => {
    const lexruntime = new AWS.LexRuntime();
    const params = {
      botName: "DalVacationHome",
      botAlias: "Prod",
      userId: sessionId,
      inputText: message,
      sessionAttributes: {
        guestEmail,
        sessionToken,
      },
    };

    lexruntime.postText(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        const lexMessage = {
          text: data.message,
          sender: "bot",
          responseCard: data.responseCard,
        };
        setMessages((prevMessages) => [...prevMessages, lexMessage]);
      }
    });
  };

  const handleCardButtonClick = (value) => {
    const userMessage = { text: value, sender: "user" };
    setMessages([...messages, userMessage]);
    sendToLex(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button
        className="fixed bottom-4 right-4 bg-indigo-500 text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
      </button>

      <div
        ref={chatBoxRef}
        className={`fixed bottom-16 right-4 w-72 sm:w-96 bg-white shadow-lg rounded-lg flex flex-col h-[550px] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 bg-indigo-500 rounded-t-lg">
          <h2 className="text-white text-xl font-semibold">Chat with Us</h2>
          <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="h-6 w-6 text-white hover:scale-110" />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.sender === "user"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-300 text-black"
                } p-2 rounded-lg mb-2 max-w-xs`}
              >
                {message.text}
                {message.sender === "bot" && message.responseCard && (
                  <div className="mt-2">
                    {message.responseCard.genericAttachments.map(
                      (attachment, i) => (
                        <div
                          key={i}
                          className="border rounded-lg p-2 mb-2 bg-white shadow"
                        >
                          <h3 className="font-semibold">{attachment.title}</h3>
                          {attachment.imageUrl && (
                            <img
                              src={attachment.imageUrl}
                              alt={attachment.title}
                              className="w-full mt-2"
                            />
                          )}
                          {attachment.buttons &&
                            attachment.buttons.map((button, j) => (
                              <button
                                key={j}
                                className="m-2 p-2 bg-indigo-500 text-white rounded"
                                onClick={() =>
                                  handleCardButtonClick(button.value)
                                }
                              >
                                {button.text}
                              </button>
                            ))}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center p-4 border-t">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button
            className="ml-2 p-2 bg-indigo-500 text-white rounded-lg"
            onClick={handleSend}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
