import mongoose from "mongoose";

const lostFoundSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      enum: [
        "Wallet",
        "Mobile",
        "Laptop",
        "Keys",
        "Bag",
        "Documents",
        "Jewellery",
        "Pet",
        "Vehicle",
        "Electronics",
        "Other",
      ],
      default: "Other",
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    reward: {
      type: Number,
      default: 0,
      min: 0,
    },

    contactMethod: {
      type: String,
      enum: ["chat", "phone","email","both"],
      default: "chat",
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    address: {
      type: String,
      required: true,
    },

    radius: {
      type: Number,
      default: 10000, // 10 KM
    },

    status: {
      type: String,
      enum: ["active", "found", "closed"],
      default: "active",
    },

    foundBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    foundAt: {
      type: Date,
    },

    views: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    bookmarkedLostFound: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LostFound",
      },
    ],
  },
  {
    timestamps: true,
  }
);

lostFoundSchema.index({ location: "2dsphere" });

lostFoundSchema.index({
  category: 1,
  status: 1,
  type: 1,
});

export const LostFound = mongoose.model("LostFound", lostFoundSchema);