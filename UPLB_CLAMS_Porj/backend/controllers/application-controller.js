import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/group3-project')

const User = mongoose.model("User");

const Application = mongoose.model('Application', {
	studentid: String,
	studentName: String,
	adviserid: String,
	adviserName: String,
	studentNumber: String,
	status: String,
	step: Number,
	remarks: [{
		remark: String,
		date: String,
		commenter: String, 
		stepGiven: Number,
	}],
	submission: [{
		remark: String,
		date: String,
		stepGiven: Number
	}],
	isReturned: Boolean,
	isReturnedBy: String
}, 'applications') 

// Functions used for Student Module
const openApplication = async (req, res) => {
	const { studentid } = req.body
	const user = await User.findOne({_id: studentid})
	const adviser = await User.findOne({_id: user.adviser})

	const studentName = user.firstName + " " + user.middleName.charAt(0) + ". " + user.lastName
	const adviserName = adviser.firstName + " " + adviser.middleName.charAt(0) + ". " + adviser.lastName
	const studentNumber = user.studentNo
	const newApplication = new Application({ studentid, adviserid: user.adviser, status: "Open", step: 1, remarks: [], submission: [], isReturned: true, isReturnedBy: "", studentName: studentName, adviserName, adviserName, studentNumber: studentNumber  })
	const result = await newApplication.save()
	user.applications.push(result._id)
	
	if (result._id) {
		await User.findOneAndUpdate({ _id: studentid }, { applications: user.applications} , { new: true})
		res.send({ success: true, app: result })
	} else {
		res.send({ success: false })
	} 
}

const getApplications = async (req, res) => {
	const applicationList = await Application.find({});
	res.send(applicationList)
}

const getPendingApplications = async (req, res) => {
	const applicationList = await Application.find({ status: { $ne: "Closed" }});;
	res.send(applicationList)
}

const getApplicationsByAdviser = async (req, res) => {
	const applications = await Application.find({adviserid: req.query.adviserid, status: { $ne: "Closed" }})
	console.log(applications)
	res.send(applications)
}


const getApplicationsByStudent = async (req, res) => {
	const applications = await Application.find({studentid: req.query.studentid})
	res.send(applications)
}

const closeApplication = async (req, res) => {
	res.send(await Application.updateOne(
        {_id: req.body.appid},
        {$set: {status: "Closed"}}
    ));
}

const submitApplication = async (req, res) => {
	res.send(await Application.updateOne(
        {_id: req.body.id},
        {$set: {status: req.body.status, step: req.body.step, submission: req.body.submission, isReturned: req.body.isReturned}}
    ));
}

const findOpenApplication = async (req, res) => {
	try{
		const openapp = await Application.findOne({status: "Open", studentid: req.body.studentid})
		const openapp2 = await Application.findOne({status: "Pending", studentid: req.body.studentid})
		if (openapp !== null) {
			res.send({ success: true, app: openapp })
		} else {
			if(openapp2 !== null){
				res.send({ success: true, app: openapp2 })
			}
			else{
				res.send({ success: false })
			}
		} 
	}
	catch(err){
		console.log(err)
		res.send({ success: false, app: [] })
	}
}

const returnApplication = async (req, res) => {
	const { appid, remark, date, approverid } = req.body

	const approver = await User.findOne({_id: approverid})
	const app = await Application.findOne({_id: appid})
	
	const commenter = approver.lastName + ", " + approver.firstName
	
	var remarks = app.remarks
	remarks.push({remark: remark, date: date, commenter: commenter, stepGiven: app.step})

	if (app) {
		res.send(await Application.updateOne(
			{_id: appid},
			{$set: {status: "Open", isReturned: true, remarks: remarks}}
		));
	} else {
		res.send({ success: false })
	} 
}


const approveApplication = async (req, res) => {
	const { appid, approverId } = req.body
	const app = await Application.findOne({_id: appid})
	const approver = await User.findOne({_id: approverId})
	
	var step = app.step
	var status = app.status
	step = step + 1
	if(step === 4){
		status = "Cleared"
		var isReturnedBy = approver.firstName + " " + approver.middleName.charAt(0) + ". " + approver.lastName
	}
	
	if (app) {
		res.send(await Application.updateOne(
			{_id: appid},
			{$set: {status: status, isReturned: false, step: step, isReturnedBy: isReturnedBy}}
		));
	} else {
		res.send({ success: false })
	} 
}

// const editRegularCustomer = async(req,res) => {
//     res.send(await Customer.updateMany(
//         {isRegular: true, customerID: req.body.customerID, email: req.body.email},
//         {$set: {username: req.body.newUsername}}
//     ));
// }

export { openApplication, getApplications, getApplicationsByStudent, closeApplication, findOpenApplication, submitApplication, returnApplication, approveApplication, getPendingApplications, getApplicationsByAdviser }
