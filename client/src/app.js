import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const App = () => {
  return (
    <div className="App">
      <div className="container-fluid position-absolute h-100 p-0">
        <div className="row g-0 h-100">
          <div className="col-6 d-flex flex-column align-items-center justify-content-center">
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
                    type="text"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button className="mb-3 btn btn-dark w-100" type="submit">
                Sign In
              </button>
              <button className="mb-3 btn btn-light w-100">
                <i className="bi-google"></i> Sign In with Google
              </button>
            </form>

            <p>
              Don't have an account? <a href="">Sign up</a>
            </p>
          </div>
          <div className="col-6 bg-dark"></div>
        </div>
      </div>
    </div>
  );
};
