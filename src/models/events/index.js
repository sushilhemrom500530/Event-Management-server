import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    date_time: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: false },
    attendee_count: { type: Number, required: false, default: 0 },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
