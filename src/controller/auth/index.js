import { fileUploader } from "../../helpers/fileUploader.js";
import { createToken } from "../../helpers/jwtHelpers.js";
import { sendResponse, sendError } from "../../helpers/sendResponse.js";
import User from "../../models/user/index.js";
import bcrypt from "bcrypt";




const GetAllFromDB = async (req, res) => {
  const result = await User.find();
  sendResponse(res, {
    statusCode: 200,
    message: "User rettrieve successfully",
    data: result,
  });
};


const SignUp = async (req, res) => {
  const formValues = req.body;
  if(!req.file){
    return sendError(res, 404, "File not round");
  }
  // file uploaded
  if (req.file) {
    const cloudResult = await fileUploader.uploadToCloudinary(req.file);
    Object.assign(formValues, { photoUrl: cloudResult.secure_url });
  }
  console.log({ formValues });

  
  // Find user
  const userExists = await User.findOne({ email: formValues?.email });

  if (userExists) {
    return sendError(res, 409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(formValues?.password, 12);
  // Save to DB
  const newUser = await User.create({
    ...formValues,
    password: hashedPassword,
  });

  const token = createToken({
    email: newUser?.email,
    password: newUser?.password,
  });

  sendResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      photoUrl: newUser.photoUrl,
      token,
    },
  });
};

const SignIn = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    return sendError(res, 409, "User not found and Invalid email address");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password." });
  }

  const token = createToken({
    email: user?.email,
    password: user?.password,
  });

  sendResponse(res, {
    statusCode: 201,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      token,
    },
  });
};

export const AuthController = {
  SignUp,
  SignIn,
};
