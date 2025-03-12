import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => {
  return {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async function () {
      try {
        set({ isUsersLoading: true });
        const res = await axiosInstance.get("/messages/user");
        set({ users: res.data.users });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch users");
      } finally {
        set({ isUsersLoading: false });
      }
    },

    getMessages: async function (userId) {
      try {
        set({ isMessagesLoading: true });
        const res = await axiosInstance.get(`/messages/m/${userId}`);
        set({ messages: res.data.messages });
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch messages"
        );
      } finally {
        set({ isMessagesLoading: false });
      }
    },

    setSelectedUser: function (user) {
      set({ selectedUser: user });
    },

    sendMessage: async (messageData) => {
      const { selectedUser, messages } = get();
      try {
        const res = await axiosInstance.post(
          `/messages/send/${selectedUser._id}`,
          messageData
        );

        set({ messages: [...messages, res.data.messages] });
      } catch (err) {
        console.log("Failed to send msg ", err);
        toast.error("Failed to send msg");
      }
    },
    resetChatState: () => set({ messages: [], selectedUser: null }),
    subscribeToMessages: function () {
      const { selectedUser } = get();
      if (!selectedUser) return;
      const socket = useAuthStore.getState().socket;
      // todo :optimize this one later

      socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId !== selectedUser._id) return;
        set({ messages: [...get().messages, newMessage] });
      });
    },
    unSubscribeFromMessages: function () {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
    },
  };
});
