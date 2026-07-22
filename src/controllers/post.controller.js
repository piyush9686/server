import Post from "../models/post.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";



// =====================================
// Create Post
// =====================================

export const createPost = asyncHandler(async (req, res) => {

    const {
        content,
        category,
        visibilityRadius,
    } = req.body;

    if (
        !req.user.location ||
        !req.user.location.coordinates ||
        req.user.location.coordinates.length !== 2
    ) {

        throw new ApiError(
            400,
            "Please update your location before creating a post"
        );

    }

    // =====================================
    // Handle uploaded images
    // =====================================

    let imageUrls = [];

    if (req.files && req.files.length > 0) {

        imageUrls = req.files.map((file) => {

            // Temporary solution
            // Later replace with Cloudinary upload

            return `data:${file.mimetype};base64,${file.buffer.toString(
                "base64"
            )}`;

        });

    }

    const post = await Post.create({

        author: req.user._id,

        content,

        images: imageUrls,

        category: category || "general",

        visibilityRadius:
            visibilityRadius ||
            req.user.radius,

        location:
            req.user.location,

    });

    const createdPost =
        await Post.findById(post._id)
            .populate(
                "author",
                "name avatar trustLevel"
            );

    return res.status(201).json(

        new ApiResponse(
            201,
            createdPost,
            "Post created successfully"
        )

    );

});

// =====================================
// Get Hyperlocal Feed
// =====================================

export const getFeed = asyncHandler(async (req, res) => {

    const radius = Math.min(
        Number(req.query.radius) || req.user.radius || 50,
        60
    );

    const category = req.query.category;

    const maxDistance = radius * 1000;

    const filter = {
        isDeleted: false,

        location: {
            $near: {
                $geometry: req.user.location,
                $maxDistance: maxDistance,
            },
        },
    };

    if (category) {
        filter.category = category;
    }

    const posts = await Post.find(filter)
        .populate(
            "author",
            "name avatar trustLevel"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            posts,
            `Feed within ${radius} km fetched successfully`
        )
    );

});

// =====================================
// Like / Unlike Post
// =====================================

export const toggleLikePost = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post || post.isDeleted) {
        throw new ApiError(404, "Post not found");
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some(
        like => like.toString() === userId
    );

    let message = "";

    if (alreadyLiked) {

        post.likes = post.likes.filter(
            like => like.toString() !== userId
        );

        message = "Post unliked successfully";

    } else {

        post.likes.push(req.user._id);

        message = "Post liked successfully";

    }

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalLikes: post.likes.length,
                liked: !alreadyLiked,
            },
            message
        )
    );

});


// =====================================
// Update Post
// =====================================

export const updatePost = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post || post.isDeleted) {
        throw new ApiError(404, "Post not found");
    }

    // Ownership check
    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You can only edit your own posts"
        );
    }

    const { content, category } = req.body;

    if (content) {
        post.content = content;
    }

    if (category) {
        post.category = category;
    }

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post updated successfully"
        )
    );

});

// =====================================
// Delete Post
// =====================================

export const deletePost = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post || post.isDeleted) {
        throw new ApiError(404, "Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You can only delete your own posts"
        );
    }

    post.isDeleted = true;

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Post deleted successfully"
        )
    );

});