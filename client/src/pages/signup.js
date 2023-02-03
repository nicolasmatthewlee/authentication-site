import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const SignUp = (props) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${props.server}/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const responseJSON = await response.json();
      const err = responseJSON.err;

      if (err) console.log(err);
      else {
        // redirect to login
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
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
        <span className="ms-2">Authentication Corp.</span>
      </h1>
      <div className="row g-0 h-100" style={{ paddingTop: "80px" }}>
        <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
          <h1 className="mt-3 mb-1">Create an account</h1>
          <p className="text-muted">Please enter your information.</p>

          <form>
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
                  className="form-control mb-4"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={(e) => handleSubmit(e)}
              className="mb-3 btn btn-success w-100"
            >
              Submit
            </button>
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
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
        <div className="d-none d-md-inline col-md-6 bg-dark"></div>
      </div>
    </div>
  );
};
