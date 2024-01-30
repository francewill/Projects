
export default function AdminHomePage() {
    return(
        <>
            <div id="page">
      <div class="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div class="card">
          <div class="card-body" id="cardbody">
            <h5 class="card-title">Welcome, Admin!</h5>
            <p class="card-text">
            Administration of student account applications as well as the creation, editing, and deletion of accounts for Approvers fall under the authority of the Admin. It offers the features the administrative user needs to effectively complete these tasks.
              <ul>
                <li>Home - This is our home</li>
                <li>
                  View Student Accounts - View student account Applications
                </li>
                <li>
                  View Approver Accounts - Manage Approver Accounts
                </li>
                
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
        </>
    )
}