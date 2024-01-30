import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClearanceCard from "../elements/clearanceCard";
import ReactPDF from '@react-pdf/renderer';
import { MyDocument } from "../../document/pdf";
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';




export default function Clearance() {
    var user = sessionStorage.getItem("userid")
    

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        // get request
        fetch(`http://localhost:3001/get-applications-by-student?studentid=${user}`)
            .then(response => response.json())
            .then(body => {
                setApplications(body)
            })
    }, [])

    const [pdfContent, setPdfContent] = useState(null);


  return (
    <>
      <div class="container-fluid">

        <h3> List of Applications</h3>
        {<ClearanceCard data={applications}></ClearanceCard>}
      </div>
    </>
  );
}
