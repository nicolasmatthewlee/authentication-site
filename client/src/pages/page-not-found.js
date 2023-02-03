export const PageNotFound = () => {
  return (
    <div>
      <h1 className="shadow-sm p-3 m-0">
        <i className="bi-patch-check-fill" style={{ color: "black" }}></i>
        <span className="ms-3">Authentication Corp.</span>
      </h1>

      <div className="container-fluid p-3 d-flex justify-content-center">
        <h1
          className="position-absolute"
          style={{ top: "clamp(80px,40%,40%)" }}
        >
          Page Not Found
        </h1>
      </div>
    </div>
  );
};
