import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import applications from "./ApllicationsMockData.json";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../../table/table.css";

import "./pendingapplications.css";


export default function PendingApplication() {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [applicationsToShow, setApplicationsToShow] = useState([]);
  const [sorted, setSorted] = useState({ sorted: "name", reversed: false });
  const [searchName, setSearchName] = useState("");
  const [searchStudentNo, setSearchStudentNo] = useState("");
  const [filterAdviser, setFilterAdviser] = useState("");
  const [step, setStep] = useState("");
  const [status, setStatus] = useState("");

  const [filterOption, setFilterOption] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  const userid = sessionStorage.getItem("userid")
  const usertype = sessionStorage.getItem("usertype")

  useEffect(() => {
    if(usertype === "Clearance Officer"){
      fetch(`http://localhost:3001/get-pending-applications`)
        .then(response => response.json())
        .then(body => {
          getData(body)
            .then(updated => {
              setPendingApplications(updated);
              setApplicationsToShow(updated);
            });
        });
      }

      else if(usertype == "Adviser"){
          fetch(`http://localhost:3001/get-applications-by-adviser?adviserid=${userid}`)
            .then(response => response.json())
            .then(body => {
              getData(body)
                .then(updated => {
                  setPendingApplications(updated);
                  setApplicationsToShow(updated);
                  console.log(body)
                });
            });
      }

  }, []);

  function refresh(){
    if(usertype === "Clearance Officer"){
      fetch(`http://localhost:3001/get-pending-applications`)
        .then(response => response.json())
        .then(body => {
          getData(body)
            .then(updated => {
              setPendingApplications(updated);
              setApplicationsToShow(updated);
            });
        });
      }

      else if(usertype == "Adviser"){
          fetch(`http://localhost:3001/get-applications-by-adviser?adviserid=${userid}`)
            .then(response => response.json())
            .then(body => {
              getData(body)
                .then(updated => {
                  setPendingApplications(updated);
                  setApplicationsToShow(updated);
                  console.log(body)
                });
            });
      }
  }
  
  function getData(body) {
    const promises = body.map(app => {
      const userByIdPromises = [
        fetch(`http://localhost:3001/get-user-by-id?id=${app.studentid}`)
          .then(response => response.json()),
        fetch(`http://localhost:3001/get-user-by-id?id=${app.adviserid}`)
          .then(response => response.json())
      ];
  
      return Promise.all(userByIdPromises)
        .then(([student, adviser]) => {
          app.firstName = student.firstName;
          app.lastName = student.lastName;
          app.studentNo = student.studentNo;
          app.adviser = adviser.lastName + ", " + adviser.firstName;
        });
    });
  
    return Promise.all(promises)
      .then(() => body);
  }

  function approveApplication(id){
    fetch('http://localhost:3001/approve-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({appid: id, approverId: userid})
        })
        .then(response => response.json())
        .then(body => {
            refresh()
            alert(`Successfully approved application.`)
        })
  }

  function returnApplication(id){
    let approverRemark = prompt("Please enter your remarks:");
    if (approverRemark === null) {
      // Not returned
      alert("Failed to return application.")
    } else {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours= date.getHours();
        let minutes = date.getMinutes();
        if(minutes.length === 1){
          minutes = "0" + minutes
        }
        let currentDate = `${month}-${day}-${year} at ${hours}:${minutes}`;
        fetch('http://localhost:3001/return-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({appid: id, remark: approverRemark, date: currentDate, approverid: userid})
        })
        .then(response => response.json())
        .then(body => {
            refresh()
            alert(`Successfully returned application.`)
        })

    }
  }
  const sortByDate = () => {
    const applicationsToShowCopy = [...applicationsToShow];
    applicationsToShowCopy.sort((applicationA, applicationB) => {
      applicationA.date = applicationA.submission[0].date?.split(' ')[0]
      applicationB.date = applicationB.submission[0].date?.split(' ')[0]

      const [dateA, timeA] = applicationA.date?.split(' at ');
      const [dateB, timeB] = applicationB.date?.split(' at ');

      const [dayA, monthA, yearA] = dateA.split('-').map((part) => parseInt(part.trim(), 10));
      const [dayB, monthB, yearB] = dateB.split('-').map((part) => parseInt(part.trim(), 10));
  
      const dateObjectA = new Date(yearA, monthA - 1, dayA);
      const dateObjectB = new Date(yearB, monthB - 1, dayB);
      if (sorted.reversed) {
        return dateObjectB - dateObjectA;
      }
      return dateObjectA - dateObjectB;
    });
  
    setApplicationsToShow(applicationsToShowCopy);
    setSorted({ sorted: "date", reversed: !sorted.reversed });
  };

  const sortByName = () => {
    const applicationsToShowCopy = [...applicationsToShow];
    applicationsToShowCopy.sort((applicationA, applicationB) => {
      const fullNameA = `${applicationA.lastName}, ${applicationA.firstName}`;
      const fullNameB = `${applicationB.lastName}, ${applicationB.firstName}`;

      // to determine if sorting should be descending or ascending
      if (sorted.reversed) {
        return fullNameB.localeCompare(fullNameA);
      }
      return fullNameA.localeCompare(fullNameB);
    });
    setApplicationsToShow(applicationsToShowCopy);
    setSorted({ sorted: "name", reversed: !sorted.reversed });
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);

    const matchedApplications = pendingApplications.filter((application) => {
      if (filterOption === "name") {
        return `${application.lastName}, ${application.firstName}`
          .toLowerCase()
          .includes(value);
      } else if (filterOption === "studentNo") {
        return application.studentNo.toLowerCase().includes(value);
      } else if (filterOption === "adviser") {
        return application.adviser.toLowerCase().includes(value);
      } else if (filterOption === "step") {
        return application.step === parseInt(value, 10);
      } else if (filterOption === "status") {
        return application.status.toLowerCase().includes(value);
      } 
      else if (filterOption === "date") {
        return application.submission[0]?.date?.split(" ")[0].includes(value)
      }
    });

    setApplicationsToShow(matchedApplications);
  };

  const renderApplications = () => {
    return applicationsToShow
    .filter((application) => {
      if (filterOption === "name") {
        return `${application.lastName}, ${application.firstName} ${application.middleName}`
          .toLowerCase()
          .includes(searchName.toLowerCase());
      } else if (filterOption === "studentNo") {
        return `${application.studentNo}`
          .toLowerCase()
          .includes(searchStudentNo.toLowerCase());
      } else if (filterOption === "adviser") {
        return `${application.adviser}`
          .toLowerCase()
          .includes(filterAdviser.toLowerCase());
      } else if (filterOption === "step") {
        return `${application.step}`
          .toLowerCase()
          .includes(step.toLowerCase());
      } else if (filterOption === "status") {
        return `${application.status}`
          .toLowerCase()
          .includes(status.toLowerCase());
      }
    }).map((application, index) => {
      var remarkModalId = "remarkModal" + index
      var submissionModalId = "submissionModal" + index
      return (
        <tr>
          <td>{`${application.lastName}, ${application.firstName}`}</td>
          <td>{application.studentNo}</td>
          <td>{application.adviser}</td>
          <td>{application.step}</td>
          <td>{application.status}</td>
          <td>{application.submission.length > 0 ? application.submission[0].date?.split(' ')[0] : ''}</td>

          <td>
            <button
              type="button"
              style={{
                "--bs-btn-padding-y": ".25rem",
                "--bs-btn-padding-x": ".5rem",
                "--bs-btn-font-size": ".75rem",
                marginRight: "3px",
                width: "100px",
              }}
              class="btn btn-secondary"
              data-bs-toggle="modal"
              data-bs-target={`#${remarkModalId}`}
            >
              Show
            </button>

            <div
              class="modal fade"
              id={remarkModalId}
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Remarks
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                  {application.remarks.map((submitted, index) => {
                          var string = `(${submitted.date}) ${submitted.commenter}: ${submitted.remark}`;
                          return <div>{string}</div>;
                        })} {/** Text remark*/}
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>

          <td>
          <button
              type="button"
              style={{
                "--bs-btn-padding-y": ".25rem",
                "--bs-btn-padding-x": ".5rem",
                "--bs-btn-font-size": ".75rem",
                marginRight: "3px",
                width: "100px",
              }}
              class="btn btn-secondary"
              data-bs-toggle="modal"
              data-bs-target={`#${submissionModalId}`}
            >
              Application
            </button>

            <div
              class="modal fade"
              id={submissionModalId}
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Application
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                  {application.submission.map((submitted, index) => {
                          var string = `(${submitted.date}) ${submitted.remark}`;
                          return <div>{string}</div>;
                        })} {/** Text remark*/}
                  </div>

                  
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          
          </td>

          <td>
            <div class="d-flex flex-row">

            {(application.step === 2 && usertype === "Adviser" && application.status === "Pending") || (application.step === 3 && usertype === "Clearance Officer" && application.status === "Pending") ? (
  <button
    style={{
      "--bs-btn-padding-y": ".25rem",
      "--bs-btn-padding-x": ".5rem",
      "--bs-btn-font-size": ".75rem",
      marginRight: "3px",
      width: "100px",
    }}
    class="btn btn-success btn-sm"
    onClick={() => approveApplication(application._id)}
  >
    Approve
  </button>
) : null}

{(application.step === 2 && usertype === "Adviser" && application.status === "Pending") || (application.step === 3 && usertype === "Clearance Officer" && application.status === "Pending") ? (
  <button
    style={{
      "--bs-btn-padding-y": ".25rem",
      "--bs-btn-padding-x": ".5rem",
      "--bs-btn-font-size": ".75rem",
      marginLeft: "3px",
      width: "100px",
    }}
    class="btn btn-danger btn-sm"
    onClick={() => returnApplication(application._id)}
  >
    Return
  </button>
) : null}
            </div>
          </td>

        </tr>
      );
    });
  };

  const renderArrow = () => {
    if (sorted.reversed) {
      return <FaArrowUp />;
    }
    return <FaArrowDown />;
  };

  return (
    <>
      {/* page content */}
      <div class="container-fluid">
        <h1 class="h3 mb-2 text-gray-800"> Applications </h1>

        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
              Pending Applications
            </h6>
          </div>

          <div class="card-body">
          <div id="search_part" class="d-flex flex-row">
  <div class="search-container">
    <label htmlFor="searchSection" class="label">
      Search / Filter
    </label>
    <input
                  type="text"
                  placeholder="Enter value"
                  value={searchValue}
                  onChange={handleSearch}
                  id="searchSection"
                  class="inputSection"
                />
  </div>
  <div class="mb-3 d-flex flex-row" id="dropdown">
    <label htmlFor="filterSelect" class="label">
      By
    </label>
    <select
      id="filterSelect"
      class="form-select inputSection"
      value={filterOption}
      onChange={(e) => setFilterOption(e.target.value)}
    >
      <option value="name">Name</option>
      <option value="studentNo">Student Number</option>
      <option value="adviser">Adviser</option>
      <option value="step">Step</option>
      <option value="status">Status</option>
      <option value="date">Date</option>
    </select>
  </div>
</div>

            <div>
              <table class="table">
                <thead>
                  <tr>
                    <th onClick={sortByName}>
                      <span style={{ marginRight: 10 }}>Name</span>
                      {sorted.sorted === "name" ? renderArrow() : null}
                    </th>
                    <th>
                      <span>Student Number</span>
                    </th>
                    <th>
                      <span>Adviser</span>
                    </th>
                    <th>
                      <span>Step</span>
                    </th>
                    <th>
                      <span>Status</span>
                    </th>
                    <th onClick={sortByDate}>
                      <span style={{ marginRight: 10 }}>Date</span>
                      {sorted.sorted === "date" ? renderArrow() : null}
                    </th>
                    <th>
                      <span>Remark</span>
                    </th>
                    <th>
                      <span>Submissions</span>
                    </th>
                    <th>
                      <span>Decision</span>
                    </th>
                  </tr>
                </thead>
                <tbody>{renderApplications()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
