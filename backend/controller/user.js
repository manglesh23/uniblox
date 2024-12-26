const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
console.log("Controller")

const createUser = async (req, res) => {
  try {
    console.log("start");
    const { name, mobileNumber, email, password, role } = req.body;
    console.log(name, mobileNumber, email);
    let registerUser = new User({ name, mobileNumber, email, password, role });

    await registerUser.save();

    res.status(200).json({ msg: "User Created Successfully", success: true });
  } catch (e) {
    // throw e;
    res.status(404).json({ msg: "Failed", error: e.message, success: false });
  }
};

const userlogIn = async (req, res) => {
  const { email, password } = req.body;

  let findUser = await User.findOne({ email });
  console.log("FindUser:-", findUser);
  if (!findUser || !findUser.compare(password)) {
    res.status(404).json({ msg: "Incorrect Credentials", success: false });
  } else {
    let token = jsonwebtoken.sign(
      { id: findUser._id, email: findUser.email,role:findUser.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    res
      .status(200)
      .json({ msg: "LogIn Successfull", success: true, token: token });
  }
};

module.exports = { createUser, userlogIn };
