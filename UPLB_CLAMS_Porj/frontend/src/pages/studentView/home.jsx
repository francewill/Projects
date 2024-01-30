import './home.css';

export default function Home() {
  return (
    <div id="page">
      <div class="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div class="card">
          <div class="card-body" id="cardbody">
            <h5 class="card-title">Good afternoon, User!</h5>
            <p class="card-text">
            Welcome to the Clearance Approval System for the Institute of Computer Science! Our web application is made to make it easier for our students to get clearance. Never before has requesting approval been so simple. The application will then be sent to the appropriate institute departments for approval. There are certain procedures and approvals that must be obtained for each area.
We recognize how crucial it is for our students to have a hassle-free clearing process. Our system strives to offer a user-friendly interface, clear instructions, and quick communication because of this. We are available to assist you at every step of the way and respond to any questions you may have.
              <ul>
                <li>Home - This is our home</li>
                <li>
                  Status of Clearance - View status of clearance applications
                </li>
                <li>
                  Sunmit Requirements - Submit requirements for steps{" "}
                  <ul>
                    <li>Academic adviser - Link to Github</li><li>Clearance officer - Optional remarks</li>
                  </ul>
                </li>
                
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}