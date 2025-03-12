import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => {
  return {
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
      try {
        const response = await axiosInstance.get("/auth/check");
        set({ authUser: response.data.user, isCheckingAuth: false });
        get().connectSocket();
      } catch (error) {
        console.error("Error in CheckAuth", error);
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async function ({ fullName, email, password }) {
      try {
        set({ isSigningUp: true });
        const response = await axiosInstance.post("auth/signup", {
          fullName,
          email,
          password,
        });
        set({ authUser: response.data.user });
        get().connectSocket();
        toast.success("User created successfully");
      } catch (error) {
        console.error("Error in SignUp", error);
        toast.error(error.response?.data?.message || "Failed to create user");
      } finally {
        set({ isSigningUp: false });
      }
    },
    logout: async function () {
      try {
        useChatStore.getState().resetChatState();

        await axiosInstance.post("auth/logout");
        toast.success("Logged out successfully");
        set({ authUser: null });
        get().disconnectSocket();
      } catch (error) {
        console.error("Error in Logout", error);
        toast.error(error.response?.data?.message || "Failed to log out");
      }
    },
    login: async function ({ email, password }) {
      try {
        set({ isLoggingIn: true });
        const res = await axiosInstance.post("auth/login", { email, password });
        set({ authUser: res.data.user });
        toast.success("Login Successfull");
        get().connectSocket();
      } catch (error) {
        console.log("Error in logging", error);
        toast.error(error.response?.data?.message || "Failed to log in");
      } finally {
        set({ isLoggingIn: false });
      }
    },
    updateProfile: async function (data) {
      try {
        set({ isUpdatingProfile: true });
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data.user });
        toast.success("Profile pic updated");
      } catch (error) {
        console.log("Error in updating profile", error);
        toast.error("Couldn't upload");
      } finally {
        set({ isUpdatingProfile: false });
      }
    },
    connectSocket: async function () {
      const authUser = get().authUser;
      const socket = get().socket;
      if (!authUser || (socket && socket.connected)) return;
      try {
        const socket = io(BASE_URL, {
          query:{
            userId : authUser._id,
          }
        });
        socket.on("connect", () => {
          console.log("Connected to Socket.io Server");
        });
        socket.on("disconnect", () => {
          console.log("Disconnected from Socket.io Server");
        });
        socket.on("getOnlineUsers", (userIds)=>{
          set({onlineUsers : userIds})
        })
        socket.connect();
        set({ socket: socket });
      } catch (error) {
        console.error("Error in connecting to socket", error);
      }
    },
    disconnectSocket: async function () {
      if (get().socket?.connected) get().socket.disconnect();
    },
  };
});
