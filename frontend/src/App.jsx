import { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import RegisterandLogin from "./components/RegisterandLogin.jsx";
import Videos from "./components/Videos.jsx";
import VideoUploadForm from "./components/UploadVideo.jsx";
import WatchVideo from "./components/WatchVideo.jsx";
import NotFound from "./components/NotFound.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import FriendsSection from "./components/FriendsSection.jsx";
import SearchedVideos from "./assets/SearchedVideos.jsx";
import ChatPage from "./components/chats/ChatPage.jsx";
import ProfilePage from "./components/Profile.jsx";
import HomePage from "./components/HomePage.jsx";

import socket from "./socket"; 

function App() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <Routes>
      <Route path="/" element={<RegisterandLogin />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/videos"
        element={
          <PrivateRoute>
            <Videos />
          </PrivateRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <VideoUploadForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/video/:id"
        element={
          <PrivateRoute>
            <WatchVideo />
          </PrivateRoute>
        }
      />

      <Route
        path="/friends"
        element={
          <PrivateRoute>
            <FriendsSection />
          </PrivateRoute>
        }
      />

      <Route
        path="/videos/search"
        element={
          <PrivateRoute>
            <SearchedVideos />
          </PrivateRoute>
        }
      />

      <Route
        path="/chats"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
