import { useState } from "react";
import { HashRouter as Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Login } from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { SignUp } from "./pages/Signup.jsx";
import { Profile } from "./pages/Profile.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AddAds } from "./pages/AdAdd.jsx";
import { EditProfile } from "./pages/EditProfile.jsx";
import { Ads } from "./pages/Ads.jsx";
import { EditAds } from "./pages/EditAd.jsx";
import { ShowAd } from "./pages/ShowAd.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <HashRouter basename="/EarthDND">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/Login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/Signup" element={<SignUp />} />
        <Route
          path="/Profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/AdAdd" element={<AddAds />} />
        <Route
          path="/EditProfile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Ads"
          element={
            <ProtectedRoute>
              <Ads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditAd"
          element={
            <ProtectedRoute>
              <EditAds />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ShowAd"
          element={
            <ProtectedRoute>
              <ShowAd />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
