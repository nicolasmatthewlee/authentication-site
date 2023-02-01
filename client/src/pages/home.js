import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Home = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmitPassword = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "post",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const responseJSON = await response.json();
      const err = responseJSON.err;
      if (err) console.log(err);
      else {
        console.log(responseJSON);
        setShowPasswordInput(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/user", {
        credentials: "include",
      });
      const responseJSON = await response.json();
      setUsername(responseJSON.username);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const getMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/message", {
        credentials: "include",
      });
      const responseJSON = await response.json();
      setMessages(responseJSON);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const handleMessageSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/message", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const responseJSON = await response.json();
      const err = responseJSON.err;

      if (err) console.log(err);
      getMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/logout", {
        credentials: "include",
      });
      const responseJSON = await response.json();
      const err = responseJSON.err;

      if (err) console.log(err);
      else navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div
        className="container-fluid p-3 pt-0"
        style={{ marginBottom: "50px" }}
      >
        <div className="row py-3 shadow-sm d-flex align-items-center">
          <div className="col">
            <h1 className="m-0">Welcome, {username}</h1>
          </div>
          <div className="col-auto">
            <button className="btn btn-dark" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="row mt-3 d-flex justify-content-center gx-3">
          <div
            className="d-flex flex-column align-items-center w-100"
            style={{ maxWidth: "500px" }}
          >
            {Array.isArray(messages)
              ? messages.map((m) => (
                  <div key={m._id} className="card w-100 mb-3">
                    <div className="card-body">
                      {m.author ? (
                        <h6 className="card-title">{m.author}</h6>
                      ) : null}

                      <p className="card-text">{m.content}</p>
                    </div>
                    <div className="card-footer text-muted">{m.datetime}</div>
                  </div>
                ))
              : null}
          </div>

          <div className="col-12" style={{ maxWidth: "500px" }}>
            <div className="card w-100">
              <div className="card-body">
                <h6 className="card-text">Add Post</h6>
                <textarea
                  className="form-control my-3"
                  type="text"
                  placeholder="Your message here..."
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={handleMessageSubmit}
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="position-fixed w-100 left-0 bottom-0 bg-dark text-white d-flex align-items-center px-3 justify-content-center"
        style={{ height: "50px" }}
      >
        {showPasswordInput ? (
          <div className="input-group" style={{ maxWidth: "150px" }}>
            <input
              className="form-control"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••••••"
              style={{ height: "30px" }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn btn-success py-0 px-2"
              style={{ height: "30px" }}
              onClick={handleSubmitPassword}
            >
              <i className="bi-caret-right-fill"></i>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPasswordInput(true)}
            className="btn btn-dark py-0"
            style={{ height: "30px", fontWeight: "500" }}
          >
            Register Account
          </button>
        )}
      </div>
    </div>
  );
};
