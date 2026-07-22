import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// =====================================
// Create Comment
// =====================================

export const createComment = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);

    if (!post || post.isDeleted) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({

        post: id,

        author: req.user._id,

        content,

    });

    // Increase comment count
    post.commentsCount += 1;

    await post.save();

    const createdComment = await Comment.findById(
        comment._id
    ).populate(
        "author",
        "name avatar"
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            createdComment,
            "Comment added successfully"
        )
    );

});