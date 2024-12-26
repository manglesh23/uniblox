const mongoose = require("mongoose");
console.log("model");

const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  mobileNumber: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    required: true,
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const gensalt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(this.password, gensalt);
      console.log(hashpassword);
      this.password = hashpassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.compare = function (password) {
  let response = bcrypt.compareSync(password, this.password);
  console.log(response);
  return response;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
console.log("model called");
