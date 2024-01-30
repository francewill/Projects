import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  middleName: { type: String, required: false },
  lastName: { type: String, required: false },
  studentNo: { type: String, required: false },
  userType: { type: String, required: false },
  isApproved: { type: Boolean, required: false },
  applications: {type: Array, required: false, default: []},
  adviser: { type: String, required: false },
});

UserSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

const User = mongoose.model("User", UserSchema);
export { User };
