import { z } from "zod";

const SignUpSchema = z.object({
  name: z.string({
    required_error:"Name is required"
  }).min(2),
  email: z.string({
    required_error:"Email is required"
  }).email(),
  password: z.string({
    required_error:"Password must be at least 6 characters"
  }),
  photoUrl: z.string({
    required_error:"Photo is required"
  })
});


const SignInSchema = z.object({
  email: z.string({
    required_error:"Email is required"
  }),
  password: z.string({
    required_error:"Password must be at least 6 characters"
  }),
});

export const AuthValidation = {
  SignUpSchema,
  SignInSchema
};
