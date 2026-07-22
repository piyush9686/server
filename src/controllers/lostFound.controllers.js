import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import  uploadOnCloudinary  from "../utils/uploadToCloudinary.js";
import lostFoundService from "../services/lostFound.service.js";

import notificationService from "../services/notification.service.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

import { LostFound } from "../models/lostFound.model.js";

// Create Lost & Found Post
export const createLostFound = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation Error", errors.array());
  }

  console.log("===== CREATE LOST FOUND =====");
  console.log("Body:", req.body);
  console.log("Files:", req.files?.length);



  const {
    type,
    title,
    description,
    category,
    reward,
    contactMethod,
    phoneNumber,
    address,
    longitude,
    latitude,
    radius,
  } = req.body;

  const uploadedImages = [];

  //add
  console.log("Starting Cloudinary upload...")

  if (req.files?.length > 0) {
    for (const file of req.files) {

      try{
        console.log("before upload");
      const uploaded = await uploadOnCloudinary(file.buffer);

    console.log("after upload")

      if (!uploaded) {
        throw new ApiError(500, "Image upload failed");
      }

      uploadedImages.push({
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      });
      
    }
    catch(err){
      console.error("cloudinary Error:",err);
      throw err;


    }





    }
  }

  const item = await lostFoundService.createLostFound({

    
    owner: req.user._id,
    type,
    title,
    description,
    category,
    reward: reward || 0,
    contactMethod: contactMethod || "chat",
    phoneNumber: phoneNumber || "",
    address,

    location: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    },

    radius: Number(radius) || 10000,

    images: uploadedImages,

  });
//new 
// Find nearby users

const maxDistance=Number(radius) || 10000;
const nearbyUsers = await User.find({
    _id: { $ne: req.user._id },

    location: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance:maxDistance ,
        },
    },
}).select("_id");

for (const user of nearbyUsers) {
    await notificationService.createNotification({
        recipient: user._id,
        sender: req.user._id,
        type: "lostFound",
        title: "Lost & Found Alert",
        message: `${req.user.name} posted a ${type} item near you.`,
        referenceId: item._id,
    });
}










  return res.status(201).json(
    new ApiResponse(
      201,
      item,
      "Lost & Found post created successfully"
    )
  );
});

// Get All Lost & Found Items
export const getAllLostFound = asyncHandler(async (req, res) => {
  const result = await lostFoundService.getAllItems(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Lost & Found items fetched successfully"
    )
  );
});

// Get Single Item
export const getLostFoundById = asyncHandler(async (req, res) => {
  const item = await lostFoundService.getItemById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      item,
      "Item fetched successfully"
    )
  );
});

// Update Item
export const updateLostFound = asyncHandler(async (req, res) => {
  const item = await lostFoundService.updateItem(
    req.params.id,
    req.body,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      item,
      "Item updated successfully"
    )
  );
});

// Delete Item
export const deleteLostFound = asyncHandler(async (req, res) => {
  await lostFoundService.deleteItem(
    req.params.id,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Item deleted successfully"
    )
  );
});

// Mark Item as Found
export const markAsFound = asyncHandler(async (req, res) => {
  const item = await lostFoundService.markAsFound(
    req.params.id,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      item,
      "Item marked as found successfully"
    )
  );
});

// Get Nearby Items
export const getNearbyItems = asyncHandler(async (req, res) => {
  const { longitude, latitude, radius = 10000 } = req.query;

  if (!longitude || !latitude) {
    throw new ApiError(
      400,
      "Longitude and Latitude are required"
    );
  }

  const items = await lostFoundService.getNearbyItems(
    Number(longitude),
    Number(latitude),
    Number(radius)
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      items,
      "Nearby items fetched successfully"
    )
  );
});

// Increase View Count
export const increaseViewCount = asyncHandler(async (req, res) => {
  const item = await lostFoundService.increaseViews(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      item,
      "View count updated"
    )
  );
});



export const getSimilarItems = asyncHandler(async (req, res) => {

    const items = await lostFoundService.getSimilarItems(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            items,
            "Similar items fetched successfully"
        )
    );
});

export const getTrendingItems = asyncHandler(async (req, res) => {

    const items = await lostFoundService.getTrendingItems();

    return res.status(200).json(
        new ApiResponse(
            200,
            items,
            "Trending items fetched successfully"
        )
    );
});

// export const increaseViewCount = asyncHandler(async (req, res) => {

//     const item = await lostFoundService.increaseViews(req.params.id);

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             item,
//             "View count updated"
//         )
//     );
// });

export const bookmarkLostFound = asyncHandler(async(req,res)=>{

    const bookmarks =
        await lostFoundService.bookmarkItem(
            req.params.id,
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            bookmarks,
            "Bookmark updated successfully"
        )
    );
});

export const getBookmarks = asyncHandler(async(req,res)=>{

    const bookmarks =
        await lostFoundService.getBookmarks(
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            bookmarks,
            "Bookmarks fetched successfully"
        )
    );
});



// export const contactOwner = asyncHandler(async (req, res) => {

//     const item = await LostFound.findById(req.params.id);

//     if (!item) {
//         throw new ApiError(404, "Item not found");
//     }

//     if (item.user.toString() === req.user._id.toString()) {
//         throw new ApiError(400, "You cannot contact yourself");
//     }

//     let conversation = await Conversation.findOne({
//         participants: {
//             $all: [req.user._id, item.user],
//         },
//         isGroup: false,
//     });

//     if (!conversation) {
//         conversation = await Conversation.create({
//             participants: [req.user._id, item.user],
//         });
//     }

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             conversation,
//             "Conversation ready"
//         )
//     );

// });




export const contactOwner = asyncHandler(async (req, res) => {

    const item = await LostFound.findById(req.params.id);

    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    // Don't allow the owner to contact themselves
    if (item.owner.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot contact yourself");
    }

    let conversation = await Conversation.findOne({
        participants: {
            $all: [req.user._id, item.owner],
        },
        isGroup: false,
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user._id, item.owner],
            isGroup: false,
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Conversation ready"
        )
    );

});


export const getMyLostFound = asyncHandler(async (req, res) => {
  const items = await lostFoundService.getMyItems(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      items,
      "My Lost & Found posts fetched successfully"
    )
  );
});


