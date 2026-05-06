import users from "../models/users.js";


// 🔐 LOGIN
export const login = async (req, res) => {
  try {
    const { clerkId } = req.body;

    // 🔎 Validation
    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "clerkId is required",
      });
    }

    // 🔎 Find user
    const user = await users.findOne({ clerk_id: clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // ✅ Success
    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// 📝 REGISTER
export const register = async (req, res) => {
  try {
    const { clerkId, role, name, email } = req.body;

    // 🔎 Validation
    if (!clerkId || !role || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields (clerkId, role, name, email) are required",
      });
    }

    // 🔎 Check existing user
    const existingUser = await users.findOne({clerk_id : clerkId });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
        data: existingUser,
      });
    }

    // ✅ Create user
    const newUser = await users.create({
      clerk_id: clerkId,
      role,
      name,
      email,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};