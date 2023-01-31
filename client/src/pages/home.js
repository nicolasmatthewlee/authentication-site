export const Home = (props) => {
  return (
    <div>
      <h1>Home</h1>
      <h3>Welcome, {props.user.username}</h3>
    </div>
  );
};
