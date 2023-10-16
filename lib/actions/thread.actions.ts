"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();
    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create Thought: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have no parents (top-level threads...)
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id, name, parentId, image",
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch Thought: ${error.message}`);
  }
}

export async function fetchPostById(id: string) {
  connectToDB();
  try {
    //TODO: Populate Community
    const post = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id, name, parentId, image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId, image",
            },
          },
        ],
      }).exec();
      return post;
  } catch (error : any) {
    throw new Error(`Failed to fetch Thought: ${error.message}`);
  }
}

export async function addCommentToPost(
  postId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();
  try {
    // find the origninal post
    const originalPost = await Thread.findById(postId);
    if(!originalPost){
      throw new Error("Post not found!");
    }
    // create a new post with the comment text
    const commentPost = new  Thread({
      text : commentText,
      author : userId,
      parentId: postId,
    });
    // Save the new thread
    const savedCommentPost = await commentPost.save();
    originalPost.children.push(savedCommentPost._id);

    //save the original thread
    await originalPost.save();
    revalidatePath(path);
  } catch (error : any) {
    throw new Error(`Error adding comment to post: ${error.message}`);
  }
}