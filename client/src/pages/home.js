import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Home = (props) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const [messageLoadingError, setMessageLoadingError] = useState(null);

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");

  const [logoutLoading, setLogoutLoading] = useState(false);

  const [authorized, setAuthorized] = useState(null);
  const [authorizationError, setAuthorizationError] = useState(null);

  const handleSubmitPassword = async () => {
    try {
      const response = await fetch(`${props.server}/register`, {
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
        getUser();
        getMessages();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(`${props.server}/delete`, {
        method: "post",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const responseJSON = await response.json();
      const err = responseJSON.err;
      if (err) console.log(err);
      else {
        console.log(responseJSON);
        getMessages();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch(`${props.server}/user`, {
        credentials: "include",
      });
      const responseJSON = await response.json();

      if (responseJSON.username && responseJSON.status) {
        setUsername(responseJSON.username);
        setStatus(responseJSON.status);
        return { err: false };
      } else {
        return responseJSON;
      }
    } catch (err) {
      return { err: "An unknown error occurred." };
    }
  };

  const getMessages = async () => {
    setMessageLoadingError(null);
    try {
      const response = await fetch(`${props.server}/message`, {
        credentials: "include",
      });
      const responseJSON = await response.json();

      if (responseJSON.err)
        return setMessageLoadingError("Failed to load messages.");
      setMessages(responseJSON);
    } catch (err) {
      setMessageLoadingError("An unknown error occurred loading messages.");
    }
  };

  useEffect(() => {
    // called to initially set the value of authorized
    // (and authorizationError, if necessary)
    const setUser = async () => {
      const result = await getUser();
      if (result.err === false) setAuthorized(true);
      else {
        setAuthorized(false);
        setAuthorizationError(result.err);
      }
    };
    setUser();
  }, []);

  useEffect(() => {
    getMessages();
  }, []);

  const handleMessageSubmit = async () => {
    try {
      const response = await fetch(`${props.server}/message`, {
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
    setLogoutLoading(true);
    try {
      const response = await fetch(`${props.server}/logout`, {
        credentials: "include",
      });
      const responseJSON = await response.json();
      const err = responseJSON.err;

      if (!err) navigate("/");
    } catch (err) {}
    setLogoutLoading(false);
  };

  const formatTimeSince = (milliseconds) => {
    var remaining = milliseconds;

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    remaining %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    remaining %= 1000 * 60 * 60;

    const minutes = Math.floor(remaining / (1000 * 60));
    remaining %= 1000 * 60;

    const seconds = Math.floor(remaining / 1000);

    if (days) {
      if (days === 1) return "1 day";
      else return days + " days";
    } else if (hours) {
      if (hours === 1) return "1 hour";
      else return hours + " hours";
    } else if (minutes) {
      if (minutes === 1) return "1 minute";
      else return minutes + " minutes";
    } else {
      if (seconds === 0) return "now";
      if (seconds === 1) return "1 second";
      else return seconds + " seconds";
    }
  };

  const timeSince = (datetime) => {
    const now = new Date();
    return formatTimeSince(now - Date.parse(datetime));
  };

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };

  const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  };

  const { height, width } = useWindowDimensions();

  return (
    <div>
      {authorized === true ? (
        <div>
          <div className="container-fluid p-3 pt-0">
            <div className="row p-3 shadow-sm d-flex align-items-center bg-white">
              <div className="col">
                <h1 className="m-0">Welcome, {username}</h1>
              </div>
              <div className="col-auto">
                {logoutLoading ? (
                  <button
                    onClick={handleLogout}
                    className="btn btn-dark"
                    disabled
                  >
                    <i className="spinner-border spinner-border-sm"></i>{" "}
                    Loading...
                  </button>
                ) : (
                  <button onClick={handleLogout} className="btn btn-dark">
                    Logout
                  </button>
                )}
              </div>
            </div>

            <div
              className="row flex-grow-1 justify-content-center gx-3 overflow-auto"
              style={{
                height: `calc(${height}px - 50px - 84px)`,
              }}
            >
              <div
                className="container w-100 m-0 pt-3 d-flex flex-column rounded-top px-3"
                style={{
                  maxWidth: "500px",
                  paddingBottom: "80px",
                  border: "3px solid whitesmoke",
                }}
              >
                <div className="row m-0">
                  <div className="col m-0">
                    {messageLoadingError ? (
                      <div className="list-group mb-3">
                        <div className="list-group-item list-group-item-danger">
                          {messageLoadingError}
                        </div>
                      </div>
                    ) : null}
                    {Array.isArray(messages)
                      ? messages.map((m) =>
                          status === "admin" ? (
                            <div className="container w-100 mb-3" key={m._id}>
                              <div className="row">
                                <div
                                  className="col-auto p-0"
                                  style={{ fontWeight: "500" }}
                                >
                                  {m.author ? (
                                    <p className="m-0">{m.author}</p>
                                  ) : (
                                    <p className="m-0">anonymous</p>
                                  )}
                                </div>
                                <p
                                  className="col-auto text-muted p-0 m-0 ms-2"
                                  style={{
                                    fontSize: "12px",
                                    transform: "translateY(4px)",
                                  }}
                                >
                                  {timeSince(m.datetime)}
                                </p>
                              </div>
                              <div className="row">
                                <div className="col-auto p-1 bg-light rounded border">
                                  <p className="card-text px-2 m-0">
                                    {m.content}
                                  </p>
                                  <button
                                    onClick={() => handleDeleteMessage(m._id)}
                                    className="position-relative btn btn-danger m-1"
                                    style={{ fontSize: "13px" }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="container w-100 mb-3" key={m._id}>
                              <div className="row">
                                <div
                                  className="col-auto p-0"
                                  style={{ fontWeight: "500" }}
                                >
                                  {m.author ? (
                                    <p className="m-0">{m.author}</p>
                                  ) : (
                                    <p className="m-0">anonymous</p>
                                  )}
                                </div>
                                <p
                                  className="col-auto text-muted p-0 m-0 ms-2"
                                  style={{
                                    fontSize: "12px",
                                    transform: "translateY(4px)",
                                  }}
                                >
                                  {timeSince(m.datetime)}
                                </p>
                              </div>
                              <div className="row">
                                <div className="col-auto p-1 bg-light rounded border">
                                  <p className="card-text px-2">{m.content}</p>
                                </div>
                              </div>
                            </div>
                          )
                        )
                      : null}
                  </div>
                </div>
              </div>
              <div
                className="container-fluid fixed-bottom d-flex justify-content-center p-0"
                style={{ marginBottom: "50px" }}
              >
                <div
                  className="col-12 container-fluid rounded-top bg-white"
                  style={{
                    maxWidth: "500px",
                    borderLeft: "3px solid whitesmoke",
                    borderRight: "3px solid whitesmoke",
                    borderTop: "3px solid whitesmoke",
                  }}
                >
                  <div className="container-fluid w-100">
                    <div className="row my-3">
                      <div className="col">
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Your message here..."
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button
                            onClick={handleMessageSubmit}
                            className="btn btn-primary"
                          >
                            <i className="bi-send-fill"></i>
                          </button>
                        </div>
                      </div>
                    </div>
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
      ) : (
        <div className="container-fluid position-absolute h-100 w-100 gap-2 d-flex flex-column align-items-center justify-content-center">
          <h1 className="position-absolute top-0 shadow-sm p-3 m-0 w-100">
            <i className="bi-patch-check-fill" style={{ color: "black" }}></i>{" "}
            <span className="ms-2">Authentication Corp.</span>
          </h1>
          <div
            className="d-flex flex-column align-items-center position-absolute mt-3"
            style={{ top: "clamp(60px,40%,40%)" }}
          >
            {authorized === null ? (
              <>
                <h1>Loading resources...</h1>
                <div className="spinner-border"></div>
              </>
            ) : (
              <h1>{authorizationError}</h1>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
