import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// get user model registered in Mongoose
const User = mongoose.model("User");

const signUp = async (req, res) => {
  const { email, password, firstName, middleName, lastName, studentNo, userType, isApproved, applications, adviser } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingUser2 = await User.findOne({ studentNo });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    if (existingUser2) {
      return res.status(400).json({ success: false, message: 'Student Number already exists' });
    }

    const newUser = new User({
      email,
      password,
      firstName,
      middleName,
      lastName,
      studentNo,
      userType,
      isApproved,
      applications,
      adviser,
    });

    const result = await newUser.save();

    if (result._id) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};




const login = async (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;
  // Check if email exists
  const user = await User.findOne({ email })
  //  Scenario 1: FAIL - User doesn't exist
  if (!user || !user.isApproved) {
    return res.send({ success: false })
  }
  // Check if password is correct using the Schema method defined in User Schema
   user.comparePassword(password, (err, isMatch) => {
    if (err || !isMatch) {
      // Scenario 2: FAIL - Wrong password
      return res.send({ success: false });
    }
    // Scenario 3: SUCCESS - time to create a token
    const tokenPayload = {
      _id: user._id
    }

    const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

    // return the token to the client
    return res.send({ success: true, token, username: user._id, usertype: user.userType });


  })
}

const checkIfLoggedIn = async (req, res) => {

  if (!req.cookies || !req.cookies.authToken) {
    // FAIL Scenario 1 - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }

  try {
    // try to verify the token
    const tokenPayload = jwt.verify(req.cookies.authToken, 'THIS_IS_A_SECRET_STRING');
    // check if the _id in the payload is an existing user id
    const user = await User.findById(tokenPayload._id)
    if (user) {
      // SUCCESS Scenario - User is found
      return res.send({ isLoggedIn: true })
    } else {
      // FAIL Scenario 2 - Token is valid but user id not found
      return res.send({ isLoggedIn: false })
    }
  } catch {
    // FAIL Scenario 3 - Error in validating token / Token is not valid
    return res.send({ isLoggedIn: false });
  }
}

export { signUp, login, checkIfLoggedIn }