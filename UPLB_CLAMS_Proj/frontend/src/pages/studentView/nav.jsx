import { Link, Outlet, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function NavBarStudent() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("username");
    const cookies = new Cookies();
    cookies.remove("authToken");

    navigate("/user");
  }

  return (
    <>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
          <img
            src="https://ics.uplb.edu.ph/wp-content/uploads/2021/07/ics-logo.png"
            alt="Book Icon"
            width="30"
            height="30"
            class="bi bi-book"
          />{" "}
            UPLB CLAMS
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="true"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link class="nav-link" to="/user/student">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/user/student/clearance">
                  Status of Clearance
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/user/student/requirements">
                  Submit Requirements
                </Link>
              </li>
            </ul>

            <button
              type="button"
              class="btn btn-outline-secondary"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
