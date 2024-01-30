// Reference: https://www.youtube.com/watch?v=SO5Z66tRW40

import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../../table/table.css";
import { useEffect } from "react";
import accounts from "../../table/approverAccounts.json";
import EditApproverComponent from "./editApproverComponent";

export default function AdminApproverAccountsView() {
    const [approvers, setApprovers] = useState([]);
    const [approversToShow, setApproversToShow] = useState(approvers);
    const [sorted, setSorted] = useState({ sorted: "name", reversed: false });
    const [searchPhrase, setSearchPhrase] = useState("");
    const completeApprovers = [...approvers];

    const [selectedApprover, setSelectedApprover] = useState({});

    useEffect(() => {
            // request to get array of approvers
            fetch('http://localhost:3001/get-approvers')
            .then(response => response.json())
            .then(body => {
                setApprovers(body)
                setApproversToShow(body);
            });
            console.log(approvers);
        }, []
    )

    function refresh(){
        // request for array of approvers
        fetch('http://localhost:3001/get-approvers')
        .then(response => response.json())
        .then(body => {
            getData(body)
                .then(updated => {
                    setApproversToShow(updated)
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
                .then(([approver]) => {
                    account.firstName = approver.firstName;
                    account.middleName = approver.middleName;
                    account.lastName = approver.lastName;
                    account.email = approver.email;
                    account.studentNo = approver.studentNo;
                });
        });

        return Promise.all(promises)
            .then(() => body)
    }

    function deleteAccount(studentNo) {
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

    // sort approver accounts by name
    const sortByName = () => {
		const approversCopy = [...approvers]; // create copy of approvers
		approversCopy.sort((approverA, approverB) => {
            // full names to be compared for sorting 
			const fullNameA = `${approverA.lastName}, ${approverA.firstName} ${approverA.middleName}`;
			const fullNameB = `${approverB.lastName}, ${approverB.firstName} ${approverB.middleName}`;
			
            // to determine if sorting should be descending or ascending
            if (sorted.reversed) {
				return fullNameB.localeCompare(fullNameA);
			}
			return fullNameA.localeCompare(fullNameB);
		});
		setApproversToShow(approversCopy);
        setApprovers(approversCopy)
		setSorted({ sorted: "name", reversed: !sorted.reversed });
	};

    // handles searching
    const search = (event) => {
        // Filter accounts based on search value
		const matchedApprovers = approvers.filter((approver) => {
			return `${approver.firstName} ${approver.middleName} ${approver.lastName}`
				.toLowerCase()
				.includes(event.target.value.toLowerCase());
		});

		setApproversToShow(matchedApprovers);
		setSearchPhrase(event.target.value);
	};

    // load approvers data
    const renderApprovers = () => {
		return approversToShow.map((approver, index) => {
            var approverModalId = "approverModal" + approver._id;

			return (
				<tr>
                    <td>{`${approver.firstName}, ${approver.middleName} ${approver.lastName}`}</td>
                    <td>{approver.studentNo}</td>
					<td>{approver.email}</td>
                    <td>{approver.userType}</td>
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
                            data-bs-target={`#${approverModalId}`}
                            onClick={() => setSelectedApprover(approver)}
                        >
                            Edit
                        </button>

                        <div
                        class="modal fade"
                        id={approverModalId}
                        tabindex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                        >
                            <div class="modal-dialog">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                                    Edit Approver Details
                                    </h1>
                                    <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    ></button>
                                </div>
                                <div class="modal-body">
                                 <EditApproverComponent approverToEdit={selectedApprover} refresh={refresh}/>
                                </div>
                                </div>
                            </div>
                        </div>

                        <button
                            style={{
                            "--bs-btn-padding-y": ".25rem",
                            "--bs-btn-padding-x": ".5rem",
                            "--bs-btn-font-size": ".75rem",
                            marginLeft: "3px",
                            width: "100px",
                            }}
                            class="btn btn-danger btn-sm"
                            onClick={() => deleteAccount(approver.studentNo)}
                        >
                            Delete
                        </button>
                        </div>
                    </td>                    
				</tr>
			);
		});
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

                <h1 class="h3 mb-2 text-gray-800"> Approvers </h1>

                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Approver accounts</h6>
                    </div>

                    <div class="card-body">
                        <div class="search-container">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchPhrase}
                                onChange={search}
                            />
                        </div>
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
                                    <th>
                                        <span>Initials</span>
                                    </th>
                                    <th>
                                        <span>Email</span>
                                    </th>
                                    <th>
                                        <span>Approver type</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{renderApprovers()}</tbody>
                        </table>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}