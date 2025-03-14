import mongoose, { models } from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String }, // User's profile picture
  bio: { type: String, maxlength: 300 }, // Short bio about the user
  location: { type: String }, // User’s location (optional)

  // Pet-related fields
  pets: [
    {
      name: { type: String, required: true },
      species: { type: String, required: true }, // e.g., dog, cat, bird
      breed: { type: String }, // e.g., Labrador, Persian
      age: { type: Number }, // Age in years
      profileImage: { type: String }, // Pet’s profile picture
      bio: { type: String, maxlength: 200 }, // Short bio for the pet
    },
  ],

  // Social and community features
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users this user follows
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users following this user
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Pet-related posts by the user
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Posts the user has liked
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }], // Pet groups the user is part of

  // Activity and status
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "moderator", "admin"], default: "user" }, // Updated roles
  isActive: { type: Boolean, default: true }, // Account status

  socialLinks: [
    {
      platformName: { type: String, required: true }, // e.g., Instagram, Twitter
      link: { type: String, required: true },
    },
  ],
});

export const User = models.User || mongoose.model("User", UserSchema);
