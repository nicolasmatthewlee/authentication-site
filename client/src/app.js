import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import { Login } from "./pages/login";
import { SignUp } from "./pages/signup";
import { Home } from "./pages/home";
import { PageNotFound } from "./pages/page-not-found";

export const App = () => {
  const [user, setUser] = useState({ username: "" });

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};
