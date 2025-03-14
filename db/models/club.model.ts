import { Schema, model, models } from "mongoose";

// Schema for club membership
const MemberSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: ["owner", "moderator", "member"],
    default: "member",
  },
  joinedAt: { type: Date, default: Date.now },
});

// Main Club Schema
const ClubSchema = new Schema({
  // Core club details
  name: { type: String, required: true, maxlength: 50 }, // e.g., "Dog Lovers Club"
  slug: { type: String, required: true, unique: true }, // e.g., "dog-lovers-club"
  description: { type: String, required: true, maxlength: 500 }, // Club purpose
  coverImage: String, // Club banner (e.g., a group pet photo)
  petCategory: {
    type: String,
    enum: ["dogs", "cats", "birds", "smallPets", "all"],
    required: true,
  },

  // Membership
  visibility: { type: String, enum: ["public", "private"], default: "public" }, // Public or private club
  members: [MemberSchema], // List of members with roles
  memberCount: { type: Number, default: 0 }, // Cached count for quick access

  // Club-specific posts (discussions)
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }], // References to Post model
  postCount: { type: Number, default: 0 }, // Cached count for display

  // Club settings
  rules: [{ type: String }], // e.g., "No off-topic posts", "Be kind"
  isActive: { type: Boolean, default: true }, // Club status (active/inactive)

  // Meta fields
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Club creator
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for performance
ClubSchema.index({ slug: 1 }, { unique: true });
ClubSchema.index({ petCategory: 1, createdAt: 1 });
ClubSchema.index({ visibility: 1 });

// Pre-save hook to update memberCount and postCount
ClubSchema.pre("save", function (next) {
  this.memberCount = this.members.length;
  this.postCount = this.posts.length;
  this.updatedAt = new Date();
  next();
});

// Export the model
export const Club = models.Club || model("Club", ClubSchema);
