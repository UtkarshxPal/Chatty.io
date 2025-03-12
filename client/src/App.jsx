import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import PageSkeleton from "./pages/Skeleton/pageSkeleton";

function App() {
  const { authUser, checkAuth, isCheckingAuth , onlineUsers} = useAuthStore();
  console.log(onlineUsers, "online");
  const { theme } = useThemeStore();

  useEffect(
    function () {
      checkAuth();
    },
    [checkAuth]
  );

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
       
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        ></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        ></Route>
      </Routes>
      <Toaster></Toaster>
    </div>
  );
}

export default App;
