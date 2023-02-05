import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

import { Routes, Route } from "react-router-dom";

import { Login } from "./pages/login";
import { SignUp } from "./pages/signup";
import { Home } from "./pages/home";
import { PageNotFound } from "./pages/page-not-found";

export const App = () => {
  const server = "http://127.0.0.1:2000";

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login server={server} />} />
        <Route path="/signup" element={<SignUp server={server} />} />
        <Route path="/home" element={<Home server={server} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};
