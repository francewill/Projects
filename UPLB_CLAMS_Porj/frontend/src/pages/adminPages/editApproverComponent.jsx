import React, { useState } from 'react';
import { useEffect } from "react";
// import DropdownMenuApprover from './dropDownMenuApprover';

export default function EditApproverComponent({ approverToEdit, refresh }) {

  useEffect(() => {
    setApprover({
      firstName: approverToEdit.firstName,
      middleName: approverToEdit.middleName,
      lastName: approverToEdit.lastName,
      studentNumber: approverToEdit.studentNo,
      email: approverToEdit.email,
      userType: approverToEdit.userType,
      docId: approverToEdit._id,
    });
  }, [approverToEdit]);

  const [approver, setApprover] = useState({
    firstName: approverToEdit.firstName,
    middleName: approverToEdit.middleName,
    lastName: approverToEdit.lastName,
    studentNumber: approverToEdit.studentNo,
    email: approverToEdit.email,
    userType: approverToEdit.userType,
    docId: approverToEdit._id
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setApprover((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(approver);
    refresh();
    // setApprover({
    //   firstName: "",
    //   middleName: "",
    //   lastName: "",
    //   studentNumber: "",
    //   email: "",
    //   userType: ""
    // });
  };

  function confirmEdits(e) {

     // form validation goes here
     const email = document.getElementById("email").value;
     const firstName = document.getElementById("firstName").value;
     const middleName = document.getElementById("middleName").value;
     const lastName = document.getElementById("lastName").value;
     const studentNo = document.getElementById("studentNumber").value;
     const userType = document.getElementById("selectApprover").value;

     if (!(userType != "Adviser" || userType != "Clearance Officer")){
      alert("Invalid user type");
     } else if (
      email.length === 0 &&
      firstName.length === 0 &&
      lastName.length === 0 &&
      middleName.length === 0 &&
      studentNo.length === 0
     ) {
      alert("Incomplete fields.");
     } else {
      //   const editedApprover = { email: document.getElementById("email").value,
      //                           firstName: document.getElementById("firstName").value,
      //                           middleName: document.getElementById("middleName").value,
      //                           lastName: document.getElementById("lastName").value,
      //                           studentNo: document.getElementById("studentNumber").value,
      //                           userType: document.getElementById("selectApprover").value,
      //                           docId: approver.docid
      // }

      const editedApprover = { email: approver.email,
                                firstName: approver.firstName,
                                middleName: approver.middleName,
                                lastName: approver.lastName,
                                studentNo: approver.studentNumber,
                                userType: approver.userType,
                                docId: approver.docId
      }

        fetch("http://localhost:3001/edit-approver", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedApprover),
        })
          .then((response) => response.json())
          .then((body) => {
              console.log(body.success)
          });
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
            
                <form class="mx-1 mx-md-4" onSubmit={handleSubmit}>
                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={approver.firstName}
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
                        value={approver.middleName}
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
                        value={approver.lastName}
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
                        type="text"
                        id="studentNumber"
                        name="studentNumber"
                        value={approver.studentNumber}
                        onChange={handleChange}
                        class="form-control"
                      />
                      <label class="form-label" for="studentNumber">
                        Employee Number
                      </label>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <div class="form-outline flex-fill mb-0">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={approver.email}
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
                    <select
                      id="selectApprover"
                      name="userType"
                      value={approver.userType}
                      onChange={handleChange}
                      class="form-select"
                    >
                      <option value="Adviser">Adviser</option>
                      <option value="Clearance Officer">Clearance Officer</option>
                    </select>
                      <label class="form-label" for="selectApprover">
                        User Type
                      </label>
                    </div>
                  </div>

                  <div class="d-flex">
                    <input
                      type="submit"
                      class="btn btn-success btn-sm"
                      data-bs-dismiss="modal"
                      onClick={confirmEdits}
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
};
