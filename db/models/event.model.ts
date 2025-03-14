import { Schema, model, models } from "mongoose";

// Schema for support contact info
const SupportSchema = new Schema({
  contactNumber: String,
  emailAddress: String,
  supportTeam: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["lead", "support"], default: "support" },
    },
  ],
});

// Schema for FAQs
const FAQSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

// Schema for pet event prizes
const PrizeSchema = new Schema({
  title: { type: String, required: true }, // e.g., "Best Dressed Pet"
  description: String, // e.g., "A pet toy bundle"
  type: {
    type: String,
    enum: ["cash", "petGear", "treats"],
    default: "petGear",
  },
});

// Schema for event schedule items
const ScheduleItemSchema = new Schema({
  title: { type: String, required: true }, // e.g., "Dog Agility Demo"
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g., "2:00 PM"
  endTime: { type: String, required: true }, // e.g., "3:00 PM"
  location: String, // e.g., "Main Stage" or Zoom link
  type: {
    type: String,
    enum: ["activity", "competition", "meetup"],
    default: "activity",
  },
});

// Schema for sponsors
const SponsorSchema = new Schema({
  name: { type: String, required: true }, // e.g., "PetCo"
  logo: String,
  website: String,
  tier: { type: String, enum: ["gold", "silver"], default: "silver" },
});

// Main Pet Event Schema
const PetEventSchema = new Schema({
  // Core event details
  title: { type: String, required: true, maxlength: 100 }, // e.g., "Paws in the Park"
  slug: { type: String, required: true, unique: true }, // e.g., "paws-park-2025"
  description: { type: String, required: true }, // Brief event info
  coverImage: String, // Pet-themed event banner
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  venue: {
    type: { type: String, enum: ["online", "offline"], required: true },
    address: String, // e.g., "City Park" (offline only)
    meetLink: String, // e.g., Zoom link (online only)
  },

  // Pet-specific fields
  petCategory: {
    type: String,
    enum: ["dogs", "cats", "all", "other"],
    required: true,
  },
  petRules: {
    vaccinations: { type: Boolean, default: false }, // Vaccination required?
    leash: { type: Boolean, default: false }, // Leash required?
  },

  // Visibility and organizers
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  organizers: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["owner", "helper"], default: "helper" },
    },
  ],

  // Additional features
  support: SupportSchema,
  faqs: [FAQSchema],
  prizes: [PrizeSchema],
  schedule: [ScheduleItemSchema],
  sponsors: [SponsorSchema],

  // Registration settings
  registration: {
    enabled: { type: Boolean, default: true },
    maxAttendees: { type: Number, required: true, min: 1 }, // Max humans allowed
    petCount: { type: Number, default: 0 }, // Total pets registered
  },

  // Attendance tracking
  attendance: {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }], // Users who attended
    pets: { type: Number, default: 0 }, // Number of pets that attended
    checkedInAt: { type: Date }, // Timestamp of check-in (optional)
  },

  // Meta fields
  status: { type: String, enum: ["draft", "live", "ended"], default: "draft" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for performance
PetEventSchema.index({ slug: 1 }, { unique: true });
PetEventSchema.index({ petCategory: 1, startDate: 1 });
PetEventSchema.index({ status: 1, startDate: 1 });

// Update timestamps on save
PetEventSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const PetEvent = models.PetEvent || model("PetEvent", PetEventSchema);
