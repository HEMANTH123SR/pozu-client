import { connectToDatabase } from "@/db/connect.db";
import { User } from "@/db/models/user.model";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { userId, ...updateData } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the existing user
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify Clerk ID matches
    if (existingUser.clerkId !== clerkUserId) {
      return NextResponse.json(
        { error: "You are not authorized to update this user profile" },
        { status: 403 }
      );
    }

    // Validate that there's data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    // Validate array fields specific to your model
    const arrayFields = [
      "pets",
      "socialLinks",
      "following",
      "followers",
      "posts",
      "bookmarks",
      "groups",
    ];
    for (const field of arrayFields) {
      if (updateData[field] && !Array.isArray(updateData[field])) {
        return NextResponse.json(
          { error: `${field} must be an array` },
          { status: 400 }
        );
      }
    }

    // Additional validation for nested objects (e.g., pets, socialLinks)
    if (updateData.pets) {
      for (const pet of updateData.pets) {
        if (!pet.name || !pet.species) {
          return NextResponse.json(
            { error: "Each pet must have a name and species" },
            { status: 400 }
          );
        }
      }
    }

    if (updateData.socialLinks) {
      for (const link of updateData.socialLinks) {
        if (!link.platformName || !link.link) {
          return NextResponse.json(
            { error: "Each social link must have a platformName and link" },
            { status: 400 }
          );
        }
      }
    }

    // Prevent updating immutable fields (e.g., clerkId, createdAt)
    const immutableFields = ["clerkId", "createdAt"];
    immutableFields.forEach((field) => {
      if (updateData[field]) {
        delete updateData[field]; // Silently remove or throw an error
      }
    });

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
