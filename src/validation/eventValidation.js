import { z } from "zod";

const Create = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title cannot be empty"),

  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, "Name cannot be empty"),

  date_time: z
    .string({
      required_error: "Date and time is required",
      invalid_type_error: "Date and time must be a string in ISO format",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date-time format",
    }),

  location: z
    .string({
      required_error: "Location is required",
      invalid_type_error: "Location must be a string",
    })
    .min(1, "Location cannot be empty"),

  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),

  attendee_count: z
    .number({
      invalid_type_error: "Attendee count must be a number",
    })
    .int("Attendee count must be an integer")
    .nonnegative("Attendee count cannot be negative")
    .optional(),
});

const Update = z.object({
  title: z.string().optional(),
  name:z.string().optional(),
  date_time:z.string().optional(),
  location:z.string().optional(),
  description:z.string().optional(),
  attendee_count:z.string().optional(),
});

export const EventValidation = {
  Create,
  Update
};
