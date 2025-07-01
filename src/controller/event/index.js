import { sendError, sendResponse } from "../../helpers/sendResponse.js";
import Event from "../../models/events/index.js";
import User from "../../models/user/index.js";
import moment from "moment";


const GetAllFromDB = async (req, res) => {
   const { search, filter } = req.query;
    const query = {};

    // Search 
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by createdAt date with UTC start/end
    if (filter) {
      let startDate, endDate;

      switch (filter) {
        case "today":
          startDate = moment().utc().startOf("day").toDate();
          endDate = moment().utc().endOf("day").toDate();
          break;
        case "current_week":
          startDate = moment().utc().startOf("week").toDate();
          endDate = moment().utc().endOf("week").toDate();
          break;
        case "last_week":
          startDate = moment().utc().subtract(1, "weeks").startOf("week").toDate();
          endDate = moment().utc().subtract(1, "weeks").endOf("week").toDate();
          break;
        case "current_month":
          startDate = moment().utc().startOf("month").toDate();
          endDate = moment().utc().endOf("month").toDate();
          break;
        case "last_month":
          startDate = moment().utc().subtract(1, "months").startOf("month").toDate();
          endDate = moment().utc().subtract(1, "months").endOf("month").toDate();
          break;
        default:
          startDate = null;
          endDate = null;
      }

      if (startDate && endDate) {
        query.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    
    const result = await Event.find(query)
      .populate("attendees", "name email photoUrl")
      .populate("user_id", "name email photoUrl")
      .sort({ createdAt: 1 }); 

    sendResponse(res, {
      statusCode: 200,
      message: "Events retrieved successfully",
      data: result,
    });
};

const InsertIntoDB = async (req, res) => {
  // const user_id = req.user?._id;
  const user_id = "6862b63cc3357bb2d170ec74";

  const isUserExists = await User.findById({ _id: user_id });
  if (!isUserExists) {
    return sendError(res, 409, "User not found");
  }

  // Check for duplicate event name
  const existing = await Event.findOne({ name: req.body.name });
  if (existing) {
    return sendError(res, 409, "Event with this name already exists");
  }

  // Create event
  const event = await Event.create({ ...req.body, user_id });

  await User.findByIdAndUpdate(user_id, {
    $addToSet: { event_id: event._id },
  });

  sendResponse(res, {
    statusCode: 201,
    message: "Event created and linked to user successfully",
    data: event,
  });
};

const GetSingleFromDB = async (req, res) => {
  const result = await Event.findById(req.params.id)
    .populate("user_id", "name")
    .populate("attendees", "name");

  if (!result) {
    return sendError(res, 409, "This id's user not found");
  }

  sendResponse(res, {
    statusCode: 200,
    message: "Event fetched successfully",
    data: result,
  });
};

const UpdateIntoDB = async (req, res) => {
  const { id } = req.params;
  const existing = await Event.findOne({ _id: id });
  if (!existing) {
    return sendError(res, 409, "This id's user not found");
  }

  const updateEvent = await Event.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  sendResponse(res, {
    statusCode: 200,
    message: "Event updated successfully",
    data: updateEvent,
  });
};

const DeleteFromDB = async (req, res) => {
  const { id } = req.params;

  const existing = await Event.findOne({ _id: id });

  if (!existing) {
    return sendError(res, 409, "This id's user not found");
  }
  const result = await Event.deleteOne({ _id: id });

  sendResponse(res, {
    statusCode: 200,
    message: "Event deleted successfully",
    data: result,
  });
};

const GetMyEvent = async (req, res) => {
  const { id } = req.params;

  const result = await Event.findOne({ _id: id });

  if (!result) {
    return sendError(res, 409, "This id's user not found");
  }

  sendResponse(res, {
    statusCode: 200,
    message: "My Event fetched successfully",
    data: result,
  });
};

const JoinEvent = async (req, res) => {
  const { event_id } = req.params;

  // const user_id = "686258b2526cfd7c11d0ebd0"
  const user_id = "6862b63cc3357bb2d170ec74";

  const event = await Event.findById(event_id);
  const user = await User.findById(user_id);
  console.log({ event, user });
  if (!event || !user) {
    return sendError(res, 404, "Event or User not found");
  }

  // Prevent duplicate join
  if (event.attendees.some((id) => id.toString() === user_id)) {
    return sendError(res, 400, "User already joined this event");
  }

  // Add user to event's attendees
  event.attendees.push(user_id);
  event.attendee_count = event.attendees.length;

  // Add event ID to user's event_id[] (optional for tracking participation)
  if (!user.event_id.includes(event._id)) {
    user.event_id.push(event._id);
  }

  await event.save();
  await user.save();

  sendResponse(res, {
    statusCode: 200,
    message: "User joined event successfully",
    data: {
      event_id: event._id,
      attendee_count: event.attendee_count,
    },
  });
};

export const EventController = {
  GetAllFromDB,
  InsertIntoDB,
  UpdateIntoDB,
  GetSingleFromDB,
  DeleteFromDB,
  GetMyEvent,
  JoinEvent,
};
