
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './signUpPage.css'

export default function SignUp() {
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        studentNumber: "",
        upMail: "",
        password: "",
        repeatPassword: ""
    })


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setStudent(values => ({...values, [name]:value}))
    }

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
            repeatPassword: ""
        })
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
        const studentNo = document.getElementById("studentNumber").value;

        if(email.length !== 0 && password.length !== 0 && firstName !== 0 && lastName !== 0 && studentNo !== 0){
            if(password === confirmPassword){
                fetch("http://localhost:3001/signup",
                {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value,
                    firstName: document.getElementById("firstName").value,
                    middleName: document.getElementById("middleName").value,
                    lastName: document.getElementById("lastName").value,
                    studentNo: document.getElementById("studentNumber").value,
                    userType: "Student",
                    isApproved: false,
                    aplications: [],
                    adviser: ""
                    })
                })
                .then(response => response.json())
                .then(body => {
                    if (body.success) {
                    alert("Successfully sign up!")
                    navigate("/user");

                    }
                    else { alert(body.message)}
                })
            }
            else{
                alert("Passwords do not match.")
            }
        }
        else{
            alert("Incomplete fields.")
        }
        
      }
    
      const back = () => {
        navigate("/");
      };

    return (
        <>
            <section class="vh-100" >
            <div class="container h-100">
                <div class="row d-flex justify-content-center align-items-start h-100">
                <div class="col-lg-12 col-xl-11"id ="ourCard">
                    <div class="card text-black">
                    <div class="card-body p-md-5" >
                        <div class="row justify-content-center">
                        <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                            <p class="text-start h2 mb-5 mx-1 mx-md-4 mt-4">Sign Up</p>

                            <form class="mx-1 mx-md-4" onSubmit={handleSubmit}>

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
                                <label class="form-label" for="firstName">First Name</label>
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
                                <label class="form-label" for="middleName">Middle Name</label>
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
                                <label class="form-label" for="lastName">Last Name</label>
                                </div>
                            </div>

                            <div class="d-flex flex-row align-items-center mb-4">
                             
                                <div class="form-outline flex-fill mb-0">
                                <input 
                                    type="text" 
                                    id="studentNumber" 
                                    name="studentNumber" 
                                    value={student.studentNumber}
                                    onChange={handleChange}
                                    class="form-control" 
                                />
                                <label class="form-label" for="studentNumber">Student Number</label>
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
                                <label class="form-label" for="upMail">UP mail</label>
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
                                <label class="form-label" for="password">Password</label>
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
                                <label class="form-label" for="passwordRepeat">Repeat your password</label>
                                </div>
                            </div>

                            <div class="d-flex justify-content-start ">
                                <input type="submit"  class="btn btn-success btn-md" onClick = {signUp} style={{
                    width: "100px",
                  }}/> <button
                  class="btn btn-secondary btn-md"
                  style={{
                    marginLeft: "3px",
                    width: "100px",
                  }}
                  onClick={back}
                >
                  Back
                </button>
                            </div>

                            </form>

                        </div>
                        <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                            <img src="https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" 
                            class="img-fluid" 
                            alt="cool thing" 
                            id="pic"/>

                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
        </>
    )
}
