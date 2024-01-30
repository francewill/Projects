
import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../../table/table.css";
import { useEffect } from "react";
import accounts from '../../table/studentAccountApplications.json'
import DropdownMenu from "./dropdownMenu";


export default function AdminStudentAccountsView() {
    const [studentsToShow, setStudentsToShow] = useState([]);
    const [sorted, setSorted] = useState({ sorted:"name", reversed: false });
    const [advisers, setAdvisers] = useState([]);

    useEffect(() => {
        // request to get the array of students and advisers
        Promise.all([
            fetch('http://localhost:3001/get-students'),
            fetch('http://localhost:3001/get-advisers')
        ])
        .then(([resStudents, resAdvisers]) => 
            Promise.all([resStudents.json(), resAdvisers.json()])
        )
        .then(([dataStudents, dataAdvisers]) => {
            setStudentsToShow(dataStudents);
            setAdvisers(dataAdvisers);
        })
    },[]
);

    function refresh(){
        // request to get the array of students
        fetch('http://localhost:3001/get-students')
        .then(response => response.json())
        .then(body => {
            getData(body)
                .then(updated => {
                    setStudentsToShow(updated)
                })
        });
    }

    function getData(body) {
        const promises = body.map(account => {
            const userByIdPromises = [
                fetch(`http://localhost:3001/get-user-by-id?id=${account._id}`)
                    .then(response => response.json()),
            ];

            return Promise.all(userByIdPromises)
                .then(([student]) => {
                    account.isApproved = student.isApproved;
                    account.adviser = student.adviser;
                });
        });

        return Promise.all(promises)
            .then(() => body);
    }

    function approveAccount(studentNo) {
        const accountToApprove = { studentNo: studentNo };

        fetch('http://localhost:3001/approve-user',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountToApprove)
        })
        .then((response) =>  response.json())
        .then((body) => {
            refresh()
            console.log(body.success);
        })
        .catch((error) => console.error(error))
    }

    function assignAdviser(studentNo, adviser) {
        const approvedAdviser = { studentNo: studentNo, adviser: adviser };

        fetch('http://localhost:3001/assign-adviser',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(approvedAdviser)
        })
        .then((response) =>  response.json())
        .then((body) => {
            refresh();
            console.log(body.success)
        })
        .catch((error) => console.error(error))
    }

    function confirmAdviser(adviser, studentNo){
        console.log(adviser);
        assignAdviser(studentNo, adviser);
    }

    function getAdviserName(adviserId) {
        for(let i=0; i < advisers.length; i++) {
            if(advisers[i]._id == adviserId) {
                return (advisers[i].studentNo);
            }
          }
    }

    function getAdviserId(adviserInitials) {
        for(let i=0; i < advisers.length; i++) {
            if(advisers[i].studentNo == adviserInitials) {
                return (advisers[i]._id);
            }
          }
    }

    function rejectAccount(studentNo) {
        const accountToReject = { studentNo: studentNo };

        fetch('http://localhost:3001/delete-user',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountToReject)
        })
        .then((response) =>  response.json())
        .then((body) => {
            refresh();
            console.log(body.success);
        })
        .catch((error) => console.error(error))
    }

    const sortByName = () => {
    const studentsToShowCopy = [...studentsToShow];
    studentsToShowCopy.sort((studentA, studentB) => {
        const fullNameA = `${studentA.lastName}, ${studentA.firstName} ${studentA.middleName}`;
        const fullNameB = `${studentB.lastName}, ${studentB.firstName} ${studentB.middleName}`;

        // to determine if sorting should be descending or ascending
        if (sorted.reversed) {
            return fullNameB.localeCompare(fullNameA);
        }
        return fullNameA.localeCompare(fullNameB);
    })
    setStudentsToShow(studentsToShowCopy);
    setSorted({ sorted: "name", reversed: !sorted.reversed});
    };

    const sortByStudentNo = () => {
        const studentsToShowCopy = [...studentsToShow];
        studentsToShowCopy.sort((studentA, studentB) => {
            if(sorted.reversed) {
                return studentB.studentNo.split('-').join().localeCompare(studentA.studentNo.split('-').join());
            }
            return studentA.studentNo.split('-').join().localeCompare(studentB.studentNo.split('-').join());
        });

        setStudentsToShow(studentsToShowCopy);
        setSorted({ sorted: "studentNo", reversed: !sorted.reversed});
    }

    const uploadCSV = () => {
        const uploaded = document.getElementById('studentAdviserCSV');
        const file = uploaded.files[0];

        if (!file) {
            alert('No file selected.');
            return;
        }

        else {

        const reader = new FileReader();
        reader.onload = function(e) {
            const info = e.target.result;
            mapStudentAdvisers(info);
        };
        reader.readAsText(file);

    }
    }

    const mapStudentAdvisers = (info) => {
        const mappings = info.split('\n');
        for (var i = 0; i < mappings.length; i++) {
            const map = mappings[i].trim();
            if (map !== '') {
                const data = map.split(',');
                const studentNumber = data[0];
                const adviser = data[1];
                const adviserId = getAdviserId(adviser)
                console.log(studentNumber)
                console.log(adviser)
                approveAccount(studentNumber)
                assignAdviser(studentNumber, adviserId)

            }
        }
    }

    const renderStudents = () => {
        return studentsToShow.map((student, index) => {
            var studentModalId = "studentModal" + index;
            return (
                <tr>
                    <td>{`${student.lastName}, ${student.firstName} ${student.middleName}`}</td>
                    <td>{student.studentNo}</td>
                    <td>{student.email}</td>
                    <td>{student.adviser == "" ? "None" : getAdviserName(student.adviser)}</td>
                    <td>
                    <div class="d-flex flex-row">
                        <button
                            style={{
                            "--bs-btn-padding-y": ".25rem",
                            "--bs-btn-padding-x": ".5rem",
                            "--bs-btn-font-size": ".75rem",
                            marginRight: "3px",
                            width: "100px",
                            }}
                            class="btn btn-success btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target={`#${studentModalId}`}
                        >
                            Assign Adviser
                        </button>
                        
                        <div
                        class="modal fade"
                        id={studentModalId}
                        tabindex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                        >
                            <div class="modal-dialog">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                                    Assign an adviser
                                    </h1>
                                    <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    ></button>
                                </div>
                                <div class="modal-body">
                                    Choose an Adviser
                                    <DropdownMenu options={advisers.map((adviser) => { return adviser.studentNo})} onSelect={confirmAdviser} studentNo={student.studentNo} currentAdviser={student.adviser}/>
                                </div>
                                <div class="modal-footer">
                                    {/* <button
                                    type="button"
                                    class="btn btn-success btn-sm"
                                    data-bs-dismiss="modal"
                                    onClick={() => confirmAdviser(student.studentNo, adviser)}
                                    >
                                    Confirm
                                    </button> */}
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
                        </div>
                    </td>
                    {
                        !student.isApproved && (
                            <td>
                                <div class="d-flex flex-row">
                                <button
                                    style={{
                                    "--bs-btn-padding-y": ".25rem",
                                    "--bs-btn-padding-x": ".5rem",
                                    "--bs-btn-font-size": ".75rem",
                                    marginRight: "3px",
                                    width: "100px",
                                    }}
                                    class="btn btn-success btn-sm"
                                    onClick={() => {approveAccount(student.studentNo);
                                    console.log(student.studentNo)}}
                                >
                                    Approve
                                </button>
                                <button
                                    style={{
                                    "--bs-btn-padding-y": ".25rem",
                                    "--bs-btn-padding-x": ".5rem",
                                    "--bs-btn-font-size": ".75rem",
                                    marginLeft: "3px",
                                    width: "100px",
                                    }}
                                    class="btn btn-danger btn-sm"
                                    onClick={() => rejectAccount(student.studentNo)}
                                >
                                    Reject
                                </button>
                                </div>
                            </td>
                        )
                    }
                </tr>
            )
        })
    };

        // Indicates the direction of sorting
        const renderArrow = () => {
    		if (sorted.reversed) {
    			return <FaArrowUp />;
    		}
    		return <FaArrowDown />;
    	};

        return(
        <>
            {/* page content */}
            <div class="container-fluid">

                <h1 class="h3 mb-2 text-gray-800"> Students </h1>

                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary"> Student Accounts </h6>
                    </div>

                    <div class="card-body">
                        {/* <div class="search-container">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchPhrase}
                                onChange={search}
                            />
                        </div> */}
                        <div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th onClick={sortByName}>
                                        <span style={{ marginRight: 10 }}>Name</span>
                                        {sorted.sorted === "name"
                                            ? renderArrow()
                                            : null}
                                    </th>
                                    <th onClick={sortByStudentNo}>
                                        <span style={{ marginRight: 10 }}>Student Number</span>
                                            {sorted.sorted === "studentNo"
                                            ? renderArrow()
                                            : null}
                                    </th>
                                    <th>
                                        <span>Email</span>
                                    </th>
                                    <th>
                                        <span>Adviser</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{renderStudents()}</tbody>
                        </table>
                        </div>

                    </div>
                </div>
                <h4> Upload CSV File </h4>
                <input type="file" id="studentAdviserCSV" accept=".csv"/>
                <button onClick={uploadCSV}>Upload CSV File</button>
            </div>
        </>
    )
}