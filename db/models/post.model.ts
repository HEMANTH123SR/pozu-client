import { Schema, model, models } from "mongoose";

// Schema for reactions (likes) on comments or posts
const ReactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Schema for replies to comments (nested comments)
const CommentReplySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxlength: 500 }, // Instagram-like short replies
  mentionedUser: { type: Schema.Types.ObjectId, ref: "User" }, // For @mentions
  likes: [ReactionSchema], // Likes on replies
  createdAt: { type: Date, default: Date.now },
  isHidden: { type: Boolean, default: false }, // For moderation
});

// Schema for top-level comments (Instagram-style)
const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxlength: 500 }, // Short, concise comments
  likes: [ReactionSchema], // Likes on comments
  replies: [CommentReplySchema], // Nested replies
  replyCount: { type: Number, default: 0 }, // For "View more replies"
  createdAt: { type: Date, default: Date.now },
  isHidden: { type: Boolean, default: false }, // For moderation
});

// Poll Option Schema
const PollOptionSchema = new Schema({
  text: { type: String, required: true },
  votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Poll Schema
const PollSchema = new Schema({
  options: [PollOptionSchema],
  totalVotes: { type: Number, default: 0 },
});

// Main Post Schema
const PostSchema = new Schema({
  content: { type: String, required: true, maxlength: 2200 }, // Instagram-like caption length
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String }], // e.g., #dog #petcare
  images: [{ type: String }], // Array of image URLs (pet pics!)
  poll: { type: PollSchema }, // Optional poll feature
  comments: [CommentSchema], // Instagram-style comments
  commentCount: { type: Number, default: 0 }, // For pagination or "View all comments"
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Simplified from upvotes/downvotes
  numViews: { type: Number, default: 0 }, // View count for popularity
  isPinned: { type: Boolean, default: false }, // For user profile or group pinning
  club: { type: Schema.Types.ObjectId, ref: "Club", default: null }, // Null if not club-specific
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for better query performance
PostSchema.index({ createdAt: -1 }); // Sort by recent posts
PostSchema.index({ "likes.length": -1 }); // Sort by popularity
CommentSchema.index({ createdAt: -1 }); // Sort comments by recency
CommentSchema.index({ "likes.length": -1 }); // Sort comments by likes

// Pre-save hook to update commentCount
PostSchema.pre("save", function (next) {
  this.commentCount = this.comments.length;
  next();
});

export const Post = models.Post || model("Post", PostSchema);
