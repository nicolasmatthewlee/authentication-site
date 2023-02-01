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
  return (
    <div className="container-fluid">
      <h1>Home</h1>
      <h3>Welcome, {props.user.username}</h3>
      <button className="btn btn-dark" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};
