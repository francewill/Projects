import { useNavigate } from "react-router-dom";
import "./loginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const navigateToLoginUser = () => {
    navigate("/user");
  };
  const navigateToSignUp = () => {
    navigate("/signup");
  };

  return (
    <>
      <div class="container-fluid" id="cardHolder">
        <div class="card container loginCard">
          <img
            src="https://ics.uplb.edu.ph/wp-content/uploads/2021/07/ics-logo.png"
            class="card-img-top"
            id="logo"
            alt="..."
          />
          <div class="card-body mainCardBody">
            <h5 class="card-title">
              Welcome to the UPLB Clearance Application Monitoring System
            </h5>
            <p class="card-text">This app is currently in alpha phase.</p>
            <div class="d-flex justify-content-around">
              <button
                class="btn btn-secondary buttons"
                id="login_button"
                onClick={navigateToLoginUser}
              >
                Log in
              </button>
              <button
                class="btn btn-secondary buttons"
                id="signup_ `button"
                onClick={navigateToSignUp}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
        <p class="lead" id="reminder">
          For Mac Users, use Chrome Browser. Safari is not currently supported.
          If you are unable to login using your UP Mail, accomplish this UPLB CLAMS
          suppport form to notify us: <a>cmsc100_group3.up.edu.ph</a>
        </p>
      </div>
    </>
  );
}
