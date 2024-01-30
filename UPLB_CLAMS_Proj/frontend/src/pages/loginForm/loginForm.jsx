import "./loginForm.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";

export default function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // redirect when login is successful
  useEffect(() => {
    if (isLoggedIn) {
      var usertype = sessionStorage.getItem("usertype")
      if(usertype === "Student"){
        navigate("/user/student");
      } else if (usertype === "Admin") {
        navigate("/user/admin");
      } else if (usertype === "Adviser") {
        navigate("/user/approver");
      } else if (usertype === "Clearance Officer") {
        navigate("/user/approver");
      }
    }
  }, [isLoggedIn, navigate]);

  function logIn(e) {
    e.preventDefault();

    // form validation goes here

    if (email === "" || password === "") {
      alert("Don't leave blanks");
    }

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: document.getElementById("email_input").value,
        password: document.getElementById("password_input").value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          setIsLoggedIn(true);
          // successful log in. store the token as a cookie
          const cookies = new Cookies();
          cookies.set("authToken", body.token, {
            path: "localhost:3001/",
            age: 60 * 60,
            sameSite: false,
          });

          sessionStorage.setItem("userid", body.username);
          sessionStorage.setItem("usertype", body.usertype)

        } else {
          alert("Log in failed");
        }
      });
  }

  const back = () => {
    navigate("/");
  };

  return (
    <>
      <div
        class="container-fluid d-flex justify-content-around"
        id="loginscreen"
      >
        <div class="card" id="cardSection">
          <div class="card-body d-flex justify-content-around">
            <div class="d-flex flex-column justify-content-center" id="form">
              <h5 class="card-title">Welcome Back!</h5>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="email_input"
                  placeholder="name@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="password_input"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div class="mb-3">
                <button
                  class="btn btn-success btn-sm"
                  style={{
                    width: "100px",
                  }}
                  onClick={logIn}
                >
                  Log in
                </button>
                <button
                  class="btn btn-secondary btn-sm"
                  style={{
                    marginLeft: "3px",
                    width: "100px",
                  }}
                  onClick={back}
                >
                  Back
                </button>
              </div>
            </div>

            <div id="imgHolder">
              <img id ="loginpic"
                src="https://images.unsplash.com/photo-1525921429624-479b6a26d84d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                class="card-img-top img_design"
                alt="..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
