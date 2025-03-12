import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

function ChatContainer() {
  const {
    getMessages,
    isMessagesLoading,
    messages,
    selectedUser,
    subscribeToMessages,
    unSubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unSubscribeFromMessages();
  }, [getMessages, selectedUser, subscribeToMessages, unSubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto  ">
        <ChatHeader></ChatHeader>
        <MessageSkeleton></MessageSkeleton>
        <MessageInput></MessageInput>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader></ChatHeader>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${
              authUser._id === message.senderId ? "chat-end" : "chat-start"
            }`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={`${
                    authUser._id === message.senderId
                      ? authUser.profilePic || "./avatar.png"
                      : selectedUser.profilePic
                  }`}
                  alt="profilePic"
                ></img>
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col ">
              {message.image && (
                <img
                  src={message.image}
                  alt="message"
                  className="sm:max-w-[200px] rounded-md mb-2 "
                />
              )}
              {message.text && <p className="text-sm">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput></MessageInput>
    </div>
  );
}

export default ChatContainer;
