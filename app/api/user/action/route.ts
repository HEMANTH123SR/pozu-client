import { connectToDatabase } from "@/db/connect.db";
import { User } from "@/db/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(request: NextRequest) {
  try {
    const { userId, action } = await request.json();
    const { userId: clerkUserId } = getAuth(request);

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing userId or action" },
        { status: 400 }
      );
    }

    if (!["follow", "unfollow"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'follow' or 'unfollow'" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const currentUser = await User.findOne({ clerkId: clerkUserId }).session(
        session
      );
      const targetUser = await User.findById(userId).session(session);

      if (!currentUser || !targetUser) {
        await session.abortTransaction();
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (currentUser._id.toString() === targetUser._id.toString()) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: "Cannot follow/unfollow yourself" },
          { status: 400 }
        );
      }

      if (action === "follow") {
        if (currentUser.following.includes(targetUser._id)) {
          await session.abortTransaction();
          return NextResponse.json(
            { error: "Already following this user" },
            { status: 400 }
          );
        }
        currentUser.following.push(targetUser._id);
        targetUser.followers.push(currentUser._id);
      } else {
        if (!currentUser.following.includes(targetUser._id)) {
          await session.abortTransaction();
          return NextResponse.json(
            { error: "Not following this user" },
            { status: 400 }
          );
        }
        currentUser.following = currentUser.following.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (id: any) => id.toString() !== targetUser._id.toString()
        );
        targetUser.followers = targetUser.followers.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (id: any) => id.toString() !== currentUser._id.toString()
        );
      }

      await currentUser.save({ session });
      await targetUser.save({ session });
      await session.commitTransaction();

      return NextResponse.json(
        {
          message: `User ${action}ed successfully`,
          data: {
            followingCount: currentUser.following.length,
            followersCount: targetUser.followers.length,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error(`Error in  operation:`, error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
