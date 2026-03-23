import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import RegisterandLogin from "./components/RegisterandLogin.jsx";
import HomePage from "./components/HomePage.jsx";
import Profile from "./components/Profile.jsx";
import Videos from "./components/Videos.jsx";
import VideoUploadForm from "./components/UploadVideo.jsx";
import WatchVideo from "./components/WatchVideo.jsx";
import NotFound from "./components/NotFound.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import FriendsSection from "./components/FriendsSection.jsx";
import SearchedVideos from "./assets/SearchedVideos.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" caseSensitive element={<RegisterandLogin />}></Route>
      <Route
        path="home"
        caseSensitive
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="profile"
        caseSensitive
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="Videos"
        caseSensitive
        element={
          <PrivateRoute>
            <Videos />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="upload"
        caseSensitive
        element={
          <PrivateRoute>
            <VideoUploadForm />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="video/:id"
        caseSensitive
        element={
          <PrivateRoute>
            <WatchVideo />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="Friends"
        caseSensitive
        element={
          <PrivateRoute>
            <FriendsSection />
          </PrivateRoute>
        }
      ></Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
