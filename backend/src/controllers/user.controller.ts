import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import becrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { email } from "zod";

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new ApiError(404, "User not found");

    const payLoadAccessToken = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(
      payLoadAccessToken,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      {
        expiresIn: "15m",
      }
    );

    const payLoadRefreshToken = {
      id: user.id,
    };

    const refreshToken = jwt.sign(
      payLoadRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      {
        expiresIn: "7d",
      }
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Token generation error:", error);
    throw new ApiError(500, "Error generating tokens");
  }
};

interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body as RegisterUser;

    if (!username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email, username },
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User with this email or username already exists"
      );
    }

    const hashedPassword = await becrypt.hash(password.trim(), 10);

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim(),
        password: hashedPassword,
      },
    });

    if (!user) {
      throw new ApiError(500, "Failed to create user");
    }

    res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  }
);

interface LoginUser {
  email: string;
  password: string;
}

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginUser;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await becrypt.compare(password.trim(), user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id
  );

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: refreshToken,
      refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { updateUser }, "User logged in successfully"));
});
