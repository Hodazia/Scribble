
import { Request, Response } from "express";
import { prismaclient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";
import { SigninSchema, CreateUserSchema } from "@repo/common-zod/types";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export const handleRegisterUser = async (req:Request,res:Response) => {
    try {
        const { name, email, password } = req.body;
        const parsed = CreateUserSchema.safeParse({name, email,password});
        if (!parsed.success) {
            return res.status(400).json({
              success: false,
              message: "Validation Failed",
              errors: parsed.error,
            });
          }

          const userExisted = await prismaclient.user.findFirst({
            where: { email },
          });
          if (userExisted) {
            return res.status(400).json({
              success: false,
              message: "User Already Existed!",
            });
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prismaclient.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
            },
          });
          const token = jwt.sign({ id: newUser.id }, JWT_SECRET as string);
      
          return res.status(201).json({
            success: true,
            message: "User Created Successfully!",
            data: newUser,
            token,
          });
    }
    catch(error)
    {
        console.error("Registration error:", error);
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
        });
    }
}


export const handleLoginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const parsed = SigninSchema.safeParse({ email, password });
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation Failed",
          errors: parsed.error,
        });
      }
      const user = await prismaclient.user.findFirst({
        where: { email },
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not exist!",
        });
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        user?.password as string
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: "false", message: "Invalid Password " });
      }
      const token = jwt.sign({ id: user.id }, JWT_SECRET as string);

      return res.json({
        success: true,
        message: "Login successful",
        data: { id: user.id, name: user.name, email: user.email },
        token,
      });
    } catch (error) {
      console.error("Sign In error:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };