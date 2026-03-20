// const userSchema = require("../Model/UserModel");
// const bcrypt = require("bcrypt");
// const mailSend = require("../Util/MailSend");
// // const jwt = require("jsonwebtoken"); // 1. JWT Import karein

// const jwt = require("../AuthMiddleware/Jwt")
// // Secret Key (Isse .env file mein rakhein toh behtar hai)
// // const JWT_SECRET = "your_super_secret_key_123"; 

// const registerUser = async (req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const savedUser = await userSchema.create({ ...req.body, password: hashedPassword });
        
//         mailSend(savedUser.email, "Welcome to our app", "Thank you for registering with our app.");

//         res.status(201).json({
//             message: "user created successfully",
//             data: savedUser
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "error while creating user",
//             err: err
//         });
//     }
// }

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const foundUserFromEmail = await userSchema.findOne({ email: email });

//         if (foundUserFromEmail) {
//             // Password compare
//             const isPasswordMatched = await bcrypt.compare(password, foundUserFromEmail.password);

//             if (isPasswordMatched) {
//                 //jwt token generate
//                 const token = jwt.sign(
//                     { 
//                         id: foundUserFromEmail._id, 
//                         role: foundUserFromEmail.role 
//                     }, 
//                     JWT_SECRET, 
//                     { expiresIn: "24h" } 
//                 );

//                 // 3. response token and user data
//                 res.status(200).json({
//                     message: "Login Success",
//                     token: token, 
//                     data: {
//                         _id: foundUserFromEmail._id,
//                         name: foundUserFromEmail.name,
//                         email: foundUserFromEmail.email,
//                         role: foundUserFromEmail.role,
//                         flatNo: foundUserFromEmail.flatNo, 
//                         avatar: foundUserFromEmail.avatar
//                     }
//                 });
//             }
//             else {
//                 res.status(401).json({
//                     message: "Invalid Credentials"
//                 });
//             }
//         }
//         else {
//             res.status(404).json({
//                 message: "user not found."
//             });
//         }
//     } catch (err) {
//         res.status(500).json({
//             message: "error while logging in",
//             err: err.message
//         });
//     }
// }

// module.exports = {
//     registerUser,
//     loginUser
// }


const userSchema = require("../Model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "secret"; // move to .env in production

// ✅ REGISTER
const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await userSchema.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while creating user",
      error: err.message,
    });
  }
};

// ✅ LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ SAFE TOKEN (only id + role)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      SECRET,
      { expiresIn: "1s" } // ✅ token expires in 1 hour
    );

    res.status(200).json({
      message: "Login Success",
      token,
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Login error",
      error: err.message,
    });
  }
};

module.exports = { registerUser, loginUser };
// UserController.js
const getUserById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload Profile Picture → Cloudinary → save URL in MongoDB
const uploadToCloudinary = require("../Util/CloudinaryUtil");

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the file (stored locally by multer) to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.path);

    // Save the Cloudinary URL to the user document
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.params.id,
      { profilePic: cloudinaryResult.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: cloudinaryResult.secure_url,
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
      }
    });
  } catch (error) {
    console.error("Profile pic upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    uploadProfilePic,
}