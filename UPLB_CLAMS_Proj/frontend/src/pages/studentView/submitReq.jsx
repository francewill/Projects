import './submitReq.css';
import { useState, useEffect } from "react";

export default function Requirements() {
    const [hasOpen, setHasOpen] = useState(false);
    const [openApp, ongoingApp] = useState([])
    const studentid = sessionStorage.getItem("userid")

    useEffect(() => {
        fetch(`http://localhost:3001/find-open-application`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentid: studentid })
        })
            .then(response => response.json())
            .then(body => {
                setHasOpen(body.success)
                if(body.success){
                  ongoingApp(body.app)
                }else{
                  console.log(body.app)
                }
                
            })
    }, [hasOpen, openApp])


    function openApplication(){
        fetch('http://localhost:3001/open-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentid: studentid })
        })
        .then(response => response.json())
        .then(body => {
            setHasOpen(true)
            ongoingApp(body.app)
        })
    }

    function closeApplication(){
        fetch('http://localhost:3001/close-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appid: openApp._id })
        })
        .then(response => response.json())
        .then(body => {
            setHasOpen(false)
            alert(`Successfully closed application.`)
        })
    }

    function submitApplication(){
        var link = document.getElementById("link").value;
        var status = "Pending";
        var step = openApp.step;
        if(openApp.step === 1){
          step = 2
        }
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
        var submission = {remark: link, date: currentDate, stepGiven: step};

        var userSubmissions = openApp.submission
        userSubmissions.push(submission)
        if(link.length === 0){
            alert("Missing values. ")
        }
        else{
            fetch('http://localhost:3001/submit-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: openApp._id, status: status, step: step, submission: userSubmissions, isReturned: false})
            })
            .then(response => response.json())
            .then(body => {
                setHasOpen(true)
                alert(`Successfully submitted application.`)
            })
        }
    }

    // User Interface
    if(!hasOpen){
        return (
            <>
            <div class ="container-fluid" id="submitReqHolder">
                <form id = "openApplication">
                    <p> You do not have an ongoing application.</p>
                    <button type="button" class ="btn btn-outline-success form-control"onClick={() => (
                        openApplication()
                    )}> Open Application </button>
            </form>
            </div>
            </>
        )
    }

    else if(openApp.isReturned === true){
        var remark = ""
        if(openApp.step === 1){
          remark = "You created an application!"
        }
        else if(openApp.step === 2){
          remark = "Your adviser returned your application. View remarks and resubmit."
        }
        else if(openApp.step === 3){
          remark = "A clearance officer returned your application. View remarks and resubmit."
        }
        return (
            <>
              <div class="container-fluid" id="ongoingAppscreen">
                <div class="d-flex align-items-center justify-content-center h-100">
                  <div class="card" id="holderOngoing">
                    <div class="card-body" id="cardOngoing">
                      <p class="card-text">
                        <b>{remark}</b><br />
                        Status: {openApp.status}<br />
                        Step: {openApp.step} <br />
                        Remarks:
                  <br />
           
                  {openApp.remarks.map((submitted, index) => {
                          var string = `(${submitted.date}) ${submitted.commenter}: ${submitted.remark}`;
                          return <div>{string}</div>;
                        })} {/** Text remark*/}
          
          
                    Submission:
                  <br />
                    {openApp.submission.map((submitted, index) => {
                          var string = `(${submitted.date}) ${submitted.remark}`;
                          return <div>{string}</div>;
                        })} {/** Text remark*/}
                        <input id = "link" placeholder = "Github Link / Remarks" class ="form-control"required/> <br />
                        {/* Remarks: {openApp.remarks?.remark} | {openApp.remarks?.date} | {openApp.remarks?.commenter} | {openApp.remarks?.stepGiven}<br />
                        Submission: {openApp.submission.remark} | {openApp.submission.date} */}
                      </p>
                      <div class ="d-flex flex-row justify-content-around d-grid gap-2">
                        <button type="button" class="btn btn-danger"onClick={closeApplication}>Close Application</button>
                        <button type="button" class="btn btn-secondary" onClick = {submitApplication}>Submit / Resubmit Application</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
          

    }

    else{
      var remark = ""
        if(openApp.step === 2){
          remark = "Pending for adviser's review..."
        }
        else if(openApp.step === 3){
          remark = "Pending for clearance officer's review.."
        }
        return (
            <>
              <div class="container-fluid" id="ongoingAppscreen">
                <div class="d-flex align-items-center justify-content-center h-100">
                  <div class="card" id="holderOngoing">
                    <div class="card-body" id="cardOngoing">
                      <p class="card-text">
                        <b>{remark}</b><br />
                        Status: {openApp.status}<br />
                        Step: {openApp.step} <br />

                        Remarks:
                  <br />
           
                  {openApp.remarks.map((submitted, index) => {
                          var string = `(${submitted.date}) ${submitted.commenter}: ${submitted.remark}`;
                          return <div>{string}</div>;
                        })} {/** Text remark*/}
          
          
                    Submission:
                  <br />
                    {openApp.submission.map((submitted, index) => {
                          var string = `(${submitted.date}) ${submitted.remark}`;
                          return <div>{string}</div>;
                        })} {/** Text remark*/}
{/*                       
                        <input id = "link" placeholder = "Github Link" class ="form-control"required/> <br /> */}
                        {/* Remarks: {openApp.remarks?.remark} | {openApp.remarks?.date} | {openApp.remarks?.commenter} | {openApp.remarks?.stepGiven}<br />
                        Submission: {openApp.submission.remark} | {openApp.submission.date} */}
                      </p>
          
                      <div class ="d-flex flex-row justify-content-around d-grid gap-2">
                        <button type="button" class="btn btn-danger"onClick={closeApplication}>Close Application</button>
                        {/* <button type="button" class="btn btn-secondary" onClick = {submitAdviser}>Submit Application to Adviser</button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
    }
}