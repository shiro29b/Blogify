const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { createToken } = require("../services/auth");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/User_Image.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User does not exist");

    const salt = user.salt;

    const hpassword = user.password;
 
    const upassword = createHmac("sha256", salt).update(password).digest("hex");

    if (upassword !== hpassword) throw new Error("Incorrect Password");
    const token = createToken(user);

    return token;
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
