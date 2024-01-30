import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/group3-project')

const User = mongoose.model("User");

// const UserSchema = new Schema({
// 	email: { type: String, required: true },
// 	password: { type: String, required: true },
// 	firstName: { type: String, required: false },
// 	middleName: { type: String, required: false },
// 	lastName: { type: String, required: false },
// 	studentNo: { type: String, required: false },
// 	userType: { type: String, required: false },
// 	isApproved: { type: Boolean, required: false },
// 	applications: {type: Array, required: false, default: []},
// 	adviser: { type: String, required: false },
//   });

const getUsers = async (req, res) => {
	const users = await User.find({});
	res.send(users)
}

const getPendingStudents = async (req, res) => {
	const users = await User.find({userType: "Student", isApproved: false});
	res.send(users)
}

const getApprovers = async (req, res) => {
	const approvers = await User.find().or([{ userType: "Adviser" }, { userType: "Clearance Officer" }]);
	res.send(approvers);
}

const getAdvisers = async (req, res) => {
	const advisers = await User.find({userType: "Adviser"});
	res.send(advisers);
}

const getStudents = async (req, res) => {
	const students = await User.find({ userType: "Student"});
	res.send(students);
}

const greetByPOST = async (req, res) => {
	console.log(req.body.name)
	
	const greeting = "Hello, " + req.body.name;
	res.send(greeting)
}


// get User by email
const getUserByEmail = async (req, res) => {
	const user = await User.findOne({ email: req.query.email })
	res.send(user)
}

// get User by studentNumber
const getUserById = async (req, res) => {
	const user = await User.findOne({ _id: req.query.id })
	res.send(user)
}

// save new User
const addUser = async (req, res) => {
	const { firstName, middleName, lastName, studentNo, userType, email, password, isApproved, applications, adviser } = req.body

	const newUser = new User({ firstName, middleName, lastName, studentNo, userType, email, password, isApproved, applications, adviser })

	const result = await newUser.save()

	if (result._id) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

// delete 
const deleteUser = async (req, res) => {
	const { studentNo } = req.body

	const result = await User.deleteOne({ studentNo })

	if (result.deletedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
}



// const getUserApplications = async (req, res) => {
// 	const id = req.studentid
// 	const result = await User.findOne({ _id: id })

// 	if (result.deletedCount == 1) {
// 		res.send({ success: true, applications: result.applications })
// 	} else { 
// 		res.send({ success: false })	
// 	}
	
// }


const approveUser = async (req, res) => {
	const { studentNo } = req.body

	const result = await User.updateOne({ studentNo: studentNo }, {isApproved: true})

	if (result.isApproved) {
		res.send({ success: true })
	} else { 
		res.send({ success: false	 })
	}
	
}

const assignAdviser = async (req, res) => {
	const { studentNo, adviser } = req.body

	const result = await User.updateOne({ studentNo: studentNo }, {$set:{adviser: adviser}})

	if (result.adviser == adviser) {
		res.send({ success: true })
	} else { 
		res.send({ success: false	 })
	}
	
}

const editApprover = async (req, res) => {
	const { email, firstName, middleName, lastName, studentNo, userType, docId } = req.body

	const result = await User.updateOne({ _id: docId }, 
	{	
		email: email,
		firstName: firstName,
		middleName: middleName,
		lastName: lastName,
		studentNo: studentNo,
		userType: userType,
	})

	console.log(result);

	if (result._id) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}


export { getUsers, greetByPOST, getUserByEmail, addUser, deleteUser, approveUser, assignAdviser, getUserById, getPendingStudents, User, getAdvisers, getStudents, getApprovers, editApprover };