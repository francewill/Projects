import { signUp, login, checkIfLoggedIn } from "./controllers/auth-controller.js";
import { getUsers, greetByPOST, getUserByEmail, addUser, deleteUser, approveUser, assignAdviser, getUserById, getPendingStudents, getAdvisers, getStudents, getApprovers, editApprover} from './controllers/user-controller.js';
import { openApplication, getApplications, getApplicationsByStudent, closeApplication, findOpenApplication, submitApplication, returnApplication, approveApplication, getPendingApplications, getApplicationsByAdviser } from './controllers/application-controller.js';

const setUpRoutes = (app) => {

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
  })

  app.get("/", (req, res) => { res.send("API Home") });
  app.post("/signup", signUp);
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);

  app.get("/get-advisers", getAdvisers);
  app.get("/get-students", getStudents);
  app.get("/get-approvers", getApprovers);
  app.get("/get-users", getUsers);
  app.get("/get-pending-students", getUsers);
  app.post("/greet-by-post", greetByPOST);
  app.get("/get-user-by-code", getUserByEmail);
  app.get("/get-user-by-id", getUserById);
  app.post("/add-user", addUser);
  app.post("/delete-user", deleteUser);
  app.post("/approve-user", approveUser);
  app.post("/assign-adviser", assignAdviser);
  app.post("/edit-approver", editApprover)

  app.get("/get-applications", getApplications);
  app.get("/get-applications-by-student", getApplicationsByStudent);
  app.post("/open-application", openApplication);
  app.post("/close-application", closeApplication);
  app.post("/find-open-application", findOpenApplication);
  app.post("/submit-application", submitApplication);
  app.post("/return-application", returnApplication);
  app.post("/approve-application", approveApplication);
  app.get("/get-pending-applications", getPendingApplications);
  app.get("/get-applications-by-adviser", getApplicationsByAdviser);

}

export default setUpRoutes;
