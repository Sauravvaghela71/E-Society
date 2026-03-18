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
const mailSend = require("../Util/MailSend");
const jwt = require("jsonwebtoken")
const secret = "secret"

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const savedUser = await userSchema.create({ ...req.body, password: hashedPassword });
        
        mailSend(savedUser.email, "Welcome to our app", "Thank you for registering with our app.");

        res.status(201).json({
            message: "user created successfully",
            data: savedUser
        });
    } catch (err) {
        res.status(500).json({
            message: "error while creating user",
            err: err.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUserFromEmail = await userSchema.findOne({ email: email });

        if (foundUserFromEmail) {
            const isPasswordMatched = await bcrypt.compare(password, foundUserFromEmail.password);


            if (isPasswordMatched) {

           const token = jwt.sign(foundUserFromEmail.toObject(),secret)


                res.status(200).json({
                    message: "Login Success",
                    token:token,
                    data: {
                        _id: foundUserFromEmail._id,
                        email: foundUserFromEmail.email,
                        role: foundUserFromEmail.role,
                        // MongoDB fields mapping
                        firstName: foundUserFromEmail.firstName, 
                        lastName: foundUserFromEmail.lastName,
                        flatNo: foundUserFromEmail.flatNo,
                        profilePic: foundUserFromEmail.profilePic
                    }
                });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (err) {
        res.status(500).json({ message: "Error while logging in", err: err.message });
    }
}

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