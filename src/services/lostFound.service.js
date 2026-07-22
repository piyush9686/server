import { LostFound } from "../models/lostFound.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";


class LostFoundService {

  // Create Lost & Found Post
  async createLostFound(data) {
    const item = await LostFound.create(data);

    if (!item) {
      throw new ApiError(500, "Failed to create Lost & Found post");
    }

    return item;
  }

  // Get All Lost & Found Items
  async getAllItems(query) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      type,
      status,
      sort = "newest",
    } = query;

    const filter = {
      isDeleted: false,
    };

    // Search by title or description
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category Filter
    if (category) {
      filter.category = category;
    }

    // Type Filter
    if (type) {
      filter.type = type;
    }

    // Status Filter
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "views":
        sortOption = {
          views: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const items = await LostFound.find(filter)
      .populate("owner", "fullName username avatar trustScore")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await LostFound.countDocuments(filter);

    return {
      items,

      pagination: {
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    };
  }


  // Get Single Item
async getItemById(id) {
  const item = await LostFound.findOne({
    _id: id,
    isDeleted: false,
  }).populate("owner", "fullName username avatar trustScore");

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  return item;
}

// Update Item (Owner Only)
async updateItem(id, updateData, userId) {
  const item = await LostFound.findById(id);

  if (!item || item.isDeleted) {
    throw new ApiError(404, "Item not found");
  }

  if (item.owner.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this item"
    );
  }

  Object.assign(item, updateData);

  await item.save();

  return item;
}

// Soft Delete (Owner Only)
async deleteItem(id, userId) {
  const item = await LostFound.findById(id);

  if (!item || item.isDeleted) {
    throw new ApiError(404, "Item not found");
  }

  if (item.owner.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this item"
    );
  }

  item.isDeleted = true;

  await item.save();

  return item;
}

// Mark Item as Found (Owner Only)
async markAsFound(id, userId) {
  const item = await LostFound.findById(id);

  if (!item || item.isDeleted) {
    throw new ApiError(404, "Item not found");
  }

  if (item.owner.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "Only the owner can mark this item as found"
    );
  }

  item.status = "found";
  item.foundAt = new Date();

  await item.save();

  return item;
}



// Get Nearby Items
async getNearbyItems(longitude, latitude, radius = 10000) {

    const items = await LostFound.find({
        isDeleted: false,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                $maxDistance: radius,
            },
        },
    })
    .populate("owner", "fullName username avatar trustScore")
    .limit(20);

    return items;
}

// Increase View Count
async increaseViews(id) {

    const item = await LostFound.findByIdAndUpdate(
        id,
        {
            $inc: {
                views: 1,
            },
        },
        {
            new: true,
        }
    );

    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    return item;
}

// Similar Items
async getSimilarItems(id) {

    const currentItem = await LostFound.findById(id);

    if (!currentItem) {
        throw new ApiError(404, "Item not found");
    }

    const items = await LostFound.find({
        _id: {
            $ne: id,
        },

        category: currentItem.category,

        type: currentItem.type,

        isDeleted: false,

        status: "active",
    })
    .limit(5)
    .sort({
        createdAt: -1,
    });

    return items;
}

// Trending Items
async getTrendingItems() {

    const items = await LostFound.find({
        isDeleted: false,
        status: "active",
    })
    .sort({
        views: -1,
        createdAt: -1,
    })
    .limit(10);

    return items;
}

// Bookmark / Unbookmark
async bookmarkItem(itemId, userId) {

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const item = await LostFound.findById(itemId);

    if (!item || item.isDeleted) {
        throw new ApiError(404, "Item not found");
    }

    const alreadyBookmarked =
        user.bookmarks.some(
            id => id.toString() === itemId.toString()
        );

    if (alreadyBookmarked) {
        user.bookmarks.pull(itemId);
    } else {
        user.bookmarks.push(itemId);
    }

    await user.save();

    return user.bookmarks;
}


// Get Bookmarks
async getBookmarks(userId){

    const user = await User.findById(userId)
        .populate({
            path: "bookmarks",
            populate: {
                path: "owner",
                select: "fullName avatar"
            }
        });

    return user.bookmarks;
}

// Get My Lost & Found Posts
async getMyItems(userId) {
  const items = await LostFound.find({
    owner: userId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .populate(
      "owner",
      "fullName username avatar trustScore"
    );

  return items;
}

}

export default new LostFoundService();