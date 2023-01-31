import { Link } from "react-router-dom";

export const SignUp = () => {
  return (
    <div className="container-fluid position-absolute h-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
          <h1 className="mt-3 mb-1">Create an account</h1>
          <p className="text-muted">Please enter your information.</p>

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
                />
              </div>
            </div>

            <button className="mb-3 btn btn-success w-100" type="submit">
              Submit
            </button>
            <button className="mb-3 btn btn-light w-100">
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
