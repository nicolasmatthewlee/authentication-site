import { useNavigate } from "react-router-dom";

export const Home = (props) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/logout");
      const responseJSON = await response.json();
      const err = responseJSON.err;

      if (err) console.log(err);
      else navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // hard-coded messages
  const messages = [
    { content: "hello there", datetime: "2:01am", _id: "1" },
    { content: "welcome!", datetime: "9:34am", _id: "2" },
    { content: "hello world", datetime: "6:17am", _id: "3" },
  ];

  return (
    <div className="container-fluid p-3 pt-0">
      <div className="row py-3 shadow-sm d-flex align-items-center">
        <div className="col">
          <h1 className="m-0">Welcome, {props.user.username}</h1>
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
          {messages.map((m) => (
            <div key={m._id} className="card w-100 mb-3">
              <div className="card-body">
                <p className="card-text">{m.content}</p>
              </div>
              <div className="card-footer text-muted">{m.datetime}</div>
            </div>
          ))}
        </div>

        <div className="col-12" style={{ maxWidth: "500px" }}>
          <div className="card w-100">
            <div className="card-body">
              <p className="card-text">Add Post</p>
              <textarea
                className="form-control mb-3"
                type="text"
                placeholder="Your message here..."
              />
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
