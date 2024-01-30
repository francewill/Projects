import React from "react";
import "./clearanceCard.css";
import { MyDocument } from "../../document/pdf";
import { PDFDownloadLink } from '@react-pdf/renderer';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const date = new Date();
const currentMonth = monthNames[date.getMonth()];
let day = date.getDate();
let year = date.getFullYear();
let hours = date.getHours();
let minutes = date.getMinutes();
if (minutes.toString().length === 1) {
  minutes = "0" + minutes;
}
let currentDate = `${currentMonth} ${day}, ${year} at ${hours}:${minutes}`;

const officerName = (test, test2) => {
  return test2.map((application, index) => {
    let string = '';
    if (index === test) {
      application.remarks.map((submitted, remarkIndex) => {
        if (remarkIndex === application.remarks.length - 1) {
          string = submitted.commenter;
        }
        return submitted;
      });
    }
    return string;
  });
};

export default function ClearanceCard({ data }) {
  return (
    <>
      {data.map((application, index) => {
        if (application.status === "Cleared") {
          return (
            <div class="card clearance_card" key={index}>
              <div class="card-body" id="clearance_card_body">
                <div id="topCard">
                  <h5 class="card-title">
                    Status:{" "}
                    <span
                      style={{
                 
                        color:
                          application.status === "Open"
                            ? "#848482"
                            : application.status === "Pending"
                            ? "#FFDB58"
                            : application.status === "Closed"
                            ? "#CE2029"
                            : "#177245",
                           
                      }}
                    >
                      {application.status}
                    </span>
                  </h5>
                  <PDFDownloadLink document={<MyDocument date={currentDate} studentName={application.studentName} studentNo={application.studentNumber} adviserName={application.adviserName} officerName={application.isReturnedBy} />} fileName="example.pdf">
                    <button class="btn btn-success btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                        <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                        <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                      </svg> Print
                    </button>
                  </PDFDownloadLink>
                </div>
                <p class="card-text lead">
                  Step: {application.step}
                  <br />
                  Remarks:
                  <br />
                  <div key={index}>
                    {application.remarks.map((submitted, index) => {
                      const string = `(${submitted.date}) ${submitted.commenter}: ${submitted.remark}`;
                      return <div key={index}>{string}</div>;
                    })}
                  </div>
                  Submission:
                  <br />
                  <div key={index}>
                    {application.submission.map((submitted, index) => {
                      const string = `(${submitted.date}) ${submitted.remark}`;
                      return <div key={index}>{string}</div>;
                    })}
                  </div>
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div class="card clearance_card" key={index}>
              <div class="card-body" id="clearance_card_body">
                <div id="topCard">
                  <h5 class="card-title">
                    Status:{" "}
                    <span
                      style={{
                        color:
                          application.status === "Open"
                            ? "#848482"
                            : application.status === "Pending"
                            ? "#FFDB58"
                            : application.status === "Closed"
                            ? "#CE2029"
                            : "#177245",
                          
                      }}
                    >
                      {application.status}
                    </span>
                  </h5>
             
                </div>
                <p class="card-text lead">
                  Step: {application.step}
                  <br />
                  Remarks:
                  <br />
                  <div key={index}>
                    {application.remarks.map((submitted, index) => {
                      const string = `(${submitted.date}) ${submitted.commenter}: ${submitted.remark}`;
                      return <div key={index}>{string}</div>;
                    })}
                  </div>
                  Submission:
                  <br />
                  <div key={index}>
                    {application.submission.map((submitted, index) => {
                      const string = `(${submitted.date}) ${submitted.remark}`;
                      return <div key={index}>{string}</div>;
                    })}
                  </div>
                </p>
              </div>
            </div>
          );
        }
      })}
    </>
  );
}
