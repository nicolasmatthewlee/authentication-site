import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Login = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${props.server}/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const responseJSON = await response.json();
      const err = responseJSON.err;
      const formErrors = responseJSON.formErrors;

      if (err) setErrors([{ msg: err }]);
      else if (formErrors) setErrors(formErrors);
      else navigate("/home"); // redirect to home
    } catch (err) {
      setErrors([{ msg: "An unknown error occurred." }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="container-fluid position-absolute h-100 p-0">
      <div
        className="modal fade"
        id="googleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="googleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Service Unavailable</h5>
              <button
                type="button"
                className="btn btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <p>
                Sign in with Google is currently unavailable. <br></br>To see an
                implementation, check out{" "}
                <a href="https://github.com/nicolasmatthewlee/passportJS-google-oath">
                  this repository.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <h1 className="position-absolute top-0 shadow-sm p-3 m-0 w-100">
        <i className="bi-patch-check-fill" style={{ color: "black" }}></i>{" "}
        <span className="ms-2">MessageChat</span>
      </h1>
      <div className="row g-0 h-100" style={{ paddingTop: "80px" }}>
        <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
          <h1 className="mt-3 mb-1">Welcome back!</h1>
          <p className="text-muted">Please enter your credentials.</p>

          <form action="">
            <div className="row">
              <div className="col">
                <label
                  className="form-label"
                  htmlFor="username"
                  style={{ fontWeight: "500" }}
                >
                  Username
                </label>
                <input
                  className="form-control mb-3"
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label
                  className="form-label"
                  htmlFor="password"
                  style={{ fontWeight: "500" }}
                >
                  Password
                </label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {errors.length > 0 ? (
              <div className="row m-0 list-group mb-3 mt-3">
                <div className="list-group-item list-group-item-danger">
                  <ul className="m-0 p-0 ps-3">
                    {errors.map((e, i) => (
                      <li key={i}>{e.msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="row m-0 mt-3">
              {isLoading ? (
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="mb-3 btn btn-dark w-100 px-0"
                  disabled
                >
                  <i className="spinner-border spinner-border-sm"></i>{" "}
                  Loading...
                </button>
              ) : (
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="mb-3 btn btn-dark w-100 px-0"
                >
                  Sign in
                </button>
              )}
            </div>

            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#googleModal"
              className="mb-3 btn btn-light w-100"
            >
              <i className="bi-google"></i> Sign In with Google
            </button>
          </form>

          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
        <div className="d-none d-md-inline col-md-6 bg-dark"></div>
      </div>
    </div>
  );
};
