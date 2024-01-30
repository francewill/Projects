import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./adminCreateApprove.css";

export default function CreateApprover() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    studentNumber: "",
    upMail: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setStudent((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(student);
    setStudent({
      firstName: "",
      middleName: "",
      lastName: "",
      studentNumber: "",
      upMail: "",
      password: "",
      repeatPassword: "",
    });
  };
  function clearForm() {
    setStudent({
      firstName: "",
      middleName: "",
      lastName: "",
      studentNumber: "",
      upMail: "",
      password: "",
      repeatPassword: "",
    });
  }

  function signUp(e) {
    e.preventDefault();

    

    // form validation goes here
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("passwordRepeat").value;
    const firstName = document.getElementById("firstName").value;
    const middleName = document.getElementById("middleName").value;
    const lastName = document.getElementById("lastName").value;

    var input = document.getElementById("selectApprover");
    var inputTypeofApprover = input.value;

    var initials = firstName.charAt(0) + middleName.charAt(0) + lastName
    var studentNo = initials.toUpperCase()

    if (
      email.length !== 0 &&
      password.length !== 0 &&
      firstName !== 0 &&
      lastName !== 0 &&
      studentNo !== 0
    ) {
      if (password === confirmPassword) {
        if(inputTypeofApprover == "Adviser"){
      fetch("http://localhost:3001/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            firstName: document.getElementById("firstName").value,
            middleName: document.getElementById("middleName").value,
            lastName: document.getElementById("lastName").value,
            studentNo: studentNo,
            userType: inputTypeofApprover,
            isApproved: true,
            aplications: [],
            adviser: "",
          }),
        })
          .then((response) => response.json())
          .then((body) => {
            if (body.success) {
              alert("Successfully sign up!");
              clearForm();
            } else {
              alert("Sign up failed");
              clearForm();
            }
          });
        }else{
          fetch("http://localhost:3001/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: document.getElementById("email").value,
              password: document.getElementById("password").value,
              firstName: document.getElementById("firstName").value,
              middleName: document.getElementById("middleName").value,
              lastName: document.getElementById("lastName").value,
              studentNo: studentNo,
              userType: inputTypeofApprover,
              isApproved: true,
              aplications: [],
              adviser: "",
            }),
          })
            .then((response) => response.json())
            .then((body) => {
              if (body.success) {
                alert("Successfully sign up!");
                clearForm();
       
              } else {
                alert("Sign up failed");
                clearForm();
              }
            });
        }
  
      } else {
        alert("Passwords do not match.");
      }
    } else {
      alert("Incomplete fields.");
    }
  }






  return (
    <>

      <section class="vh-100">
        <div class="container-fluid">
          <div class="card" id="cardCreateApprover">
            <div
              class="card-body d-flex"
              id="approverCard"
            >
              <section class="container-fluid">
            
                <form class="mx-1 mx-md-4" onSubmit={handleSubmit} id="formApprover">
  <label for="selectApprover" class="form-label">Select Type of Approver</label>
                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                  
      <select id="selectApprover" class="form-select">
        <option value="Adviser">Adviser</option>
        <option value="Clearance Officer">Clearance Officer</option>
      </select>

      
                    </div>
                  </div>
                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={student.firstName}
                        onChange={handleChange}
                        class="form-control"
                      />
                      <label class="form-label" for="firstName">
                        First Name
                      </label>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                      <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        value={student.middleName}
                        onChange={handleChange}
                        class="form-control"
                      />
                      <label class="form-label" for="middleName">
                        Middle Name
                      </label>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={student.lastName}
                        onChange={handleChange}
                        class="form-control"
                      />
                      <label class="form-label" for="lastName">
                        Last Name
                      </label>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                      <input
                        type="email"
                        id="email"
                        name="upMail"
                        value={student.upMail}
                        onChange={handleChange}
                        class="form-control"
                      />
                      <label class="form-label" for="upMail">
                        Email
                      </label>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={student.password}
                        onChange={handleChange}
                        class="form-control"
                      />
                      <label class="form-label" for="password">
                        Password
                      </label>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                      <input
                        type="password"
                        id="passwordRepeat"
                        name="repeatPassword"
                        value={student.repeatPassword}
                        onChange={handleChange}
                        class="form-control"
                      />
                      <label class="form-label" for="passwordRepeat">
                        Repeat password
                      </label>
                    </div>
                  </div>

                  <div class="d-flex">
                    <input
                      type="submit"
                      class="btn btn-success btn-sm"
                      onClick={signUp}
                    />
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
