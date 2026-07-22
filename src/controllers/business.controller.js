import Business from "../models/business.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

//import BusinessView from "../models/businessView.model.js";

// =====================================
// Create Business
// =====================================

export const createBusiness = asyncHandler(

    async (req, res) => {

        console.log("🔥 CREATE BUSINESS HIT");
        console.log("BODY:", req.body);
        console.log("USER:", req.user);

        const {

            name,
            description,
            category,
            phone,
            address,

            businessImage,
            openingTime,
            closingTime,

            gallery,
            products,
            offers,

            visibilityRadius,

        } = req.body;

        // =====================================
        // Check existing business
        // =====================================

        const existingBusiness =
            await Business.findOne({
                owner: req.user._id,
            });

        if (existingBusiness) {

            throw new ApiError(
                400,
                "You already own a business profile"
            );

        }

        // =====================================
        // Check location
        // =====================================

        if (

            !req.user.location ||

            !req.user.location.coordinates ||

            req.user.location.coordinates.length !== 2

        ) {

            throw new ApiError(

                400,

                "Please update your location first"

            );

        }

        // =====================================
        // Create business
        // =====================================

        const business = await Business.create({

            owner: req.user._id,

            name,

            description,

            category,

            phone,

            address,

            businessImage:
                businessImage || "",

            openingTime:
                openingTime || "09:00",

            closingTime:
                closingTime || "21:00",

            gallery:
                gallery || [],

            products:
                products || [],

            offers:
                offers || [],

            visibilityRadius:
                visibilityRadius || 10,

            location:
                req.user.location,

        });

        return res.status(201).json(

            new ApiResponse(

                201,

                business,

                "Business created successfully"

            )

        );

    }

);

// =====================================
// Get Nearby Businesses
// =====================================

export const getNearbyBusinesses = asyncHandler(

    async (req, res) => {

        const radius =
            req.user.radius || 50;

        const [longitude, latitude] =
            req.user.location.coordinates;

        const businesses =
            await Business.find({

                location: {

                    $near: {

                        $geometry: {
                            type: "Point",
                            coordinates: [
                                longitude,
                                latitude,
                            ],
                        },

                        $maxDistance:
                            radius * 1000,

                    },

                },

            })

                .populate(
                    "owner",
                    "name avatar"
                )

                .sort({
                    createdAt: -1,
                });

        return res.status(200).json(

            new ApiResponse(
                200,
                businesses,
                "Nearby businesses fetched successfully"
            )

        );

    }

);


// =====================================
// Get Business By ID
// =====================================

export const getBusinessById = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const business = await Business.findById(
            businessId
        ).populate(
            "owner",
            "name avatar"
        );

        if (!business) {
            throw new ApiError(
                404,
                "Business not found"
            );
        }

        return res.status(200).json(

            new ApiResponse(
                200,
                business,
                "Business fetched successfully"
            )

        );

    }

);


// =====================================
// Update Business
// =====================================

export const updateBusiness = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const business = await Business.findById(
            businessId
        );

        if (!business) {
            throw new ApiError(
                404,
                "Business not found"
            );
        }

        if (
            business.owner.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Unauthorized"
            );
        }

        const updatedBusiness =
            await Business.findByIdAndUpdate(

                businessId,

                req.body,

                {
                    new: true,
                    runValidators: true,
                }

            );

        return res.status(200).json(

            new ApiResponse(
                200,
                updatedBusiness,
                "Business updated successfully"
            )

        );

    }

);


// =====================================
// Delete Business
// =====================================

export const deleteBusiness = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const business = await Business.findById(
            businessId
        );

        if (!business) {
            throw new ApiError(
                404,
                "Business not found"
            );
        }

        if (
            business.owner.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Unauthorized"
            );
        }

        await business.deleteOne();

        return res.status(200).json(

            new ApiResponse(
                200,
                null,
                "Business deleted successfully"
            )

        );

    }

);

// =====================================
// Add Product
// =====================================

export const addProduct = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const business =
            await Business.findById(businessId);

        if (!business) {
            throw new ApiError(
                404,
                "Business not found"
            );
        }

        if (
            business.owner.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Unauthorized"
            );
        }

        business.products.push({

            name: req.body.name,

            description:
                req.body.description || "",

            price: req.body.price,

            image:
                req.body.image || "",

            available:
                req.body.available ?? true,

        });

        await business.save();

        return res.status(200).json(

            new ApiResponse(
                200,
                business.products,
                "Product added successfully"
            )

        );

    }

);


// =====================================
// Delete Product
// =====================================

export const deleteProduct = asyncHandler(

    async (req, res) => {

        const {
            businessId,
            productId,
        } = req.params;

        const business =
            await Business.findById(businessId);

        if (!business) {
            throw new ApiError(
                404,
                "Business not found"
            );
        }

        if (
            business.owner.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Unauthorized"
            );
        }

        business.products =
            business.products.filter(

                (product) =>

                    product._id.toString() !==
                    productId

            );

        await business.save();

        return res.status(200).json(

            new ApiResponse(
                200,
                business.products,
                "Product deleted successfully"
            )

        );

    }

);


// =====================================
// Add Offer
// =====================================

export const addOffer = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const business =
            await Business.findById(businessId);

        if (!business) {
            throw new ApiError(
                404,
                "Business not found"
            );
        }

        if (
            business.owner.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Unauthorized"
            );
        }

        business.offers.push({

            title:
                req.body.title,

            description:
                req.body.description || "",

            validTill:
                req.body.validTill,

        });

        await business.save();

        return res.status(200).json(

            new ApiResponse(
                200,
                business.offers,
                "Offer added successfully"
            )

        );

    }

);


// =====================================
// Delete Offer
// =====================================

export const deleteOffer = asyncHandler(

    async (req, res) => {

        const {
            businessId,
            offerId,
        } = req.params;

        const business =
            await Business.findById(businessId);

        if (!business) {
            throw new ApiError(
                404,
                "Business not found"
            );
        }

        if (
            business.owner.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Unauthorized"
            );
        }

        business.offers =
            business.offers.filter(

                (offer) =>

                    offer._id.toString() !==
                    offerId

            );

        await business.save();

        return res.status(200).json(

            new ApiResponse(
                200,
                business.offers,
                "Offer deleted successfully"
            )

        );

    }

);




// =====================================
// Add Gallery Image
// =====================================

export const addGalleryImage = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const { imageUrl } = req.body;

        const business =
            await Business.findById(businessId);

        if (!business) {

            throw new ApiError(
                404,
                "Business not found"
            );

        }

        if (

            business.owner.toString() !==
            req.user._id.toString()

        ) {

            throw new ApiError(
                403,
                "Unauthorized"
            );

        }

        business.gallery.push(imageUrl);

        await business.save();

        return res.status(200).json(

            new ApiResponse(

                200,

                business.gallery,

                "Gallery image added successfully"

            )

        );

    }

);


// =====================================
// Delete Gallery Image
// =====================================

export const deleteGalleryImage = asyncHandler(

    async (req, res) => {

        const {
            businessId,
            imageIndex,
        } = req.params;

        const business =
            await Business.findById(businessId);

        if (!business) {

            throw new ApiError(
                404,
                "Business not found"
            );

        }

        if (
            business.owner.toString() !==
            req.user._id.toString()
        ) {

            throw new ApiError(
                403,
                "Unauthorized"
            );

        }

        business.gallery.splice(
            Number(imageIndex),
            1
        );

        await business.save();

        return res.status(200).json(

            new ApiResponse(
                200,
                business.gallery,
                "Image deleted"
            )

        );

    }

);

// =====================================
// Add Review
// =====================================

export const addReview = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const { rating, comment } = req.body;

        const business = await Business.findById(
            businessId
        );

        if (!business) {

            throw new ApiError(
                404,
                "Business not found"
            );

        }

        // ==========================
        // Check if already reviewed
        // ==========================

        const alreadyReviewed =
            business.reviews.find(

                (review) =>

                    review.user.toString() ===
                    req.user._id.toString()

            );

        if (alreadyReviewed) {

            throw new ApiError(
                400,
                "You already reviewed this business"
            );

        }

        // ==========================
        // Add Review
        // ==========================

        business.reviews.push({

            user: req.user._id,

            rating,

            comment,

        });

        // ==========================
        // Update Rating
        // ==========================

        business.totalReviews =
            business.reviews.length;

        business.rating =

            business.reviews.reduce(

                (sum, review) =>

                    sum + review.rating,

                0

            ) /

            business.totalReviews;

        await business.save();

        return res.status(201).json(

            new ApiResponse(

                201,

                business,

                "Review added successfully"

            )

        );

    }

);


// =====================================
// Update Review
// =====================================

export const updateReview = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const { rating, comment } = req.body;

        const business = await Business.findById(
            businessId
        );

        if (!business) {

            throw new ApiError(
                404,
                "Business not found"
            );

        }

        const review = business.reviews.find(

            (review) =>

                review.user.toString() ===
                req.user._id.toString()

        );

        if (!review) {

            throw new ApiError(
                404,
                "Review not found"
            );

        }

        review.rating = rating;
        review.comment = comment;

        // ==========================
        // Recalculate Rating
        // ==========================

        business.totalReviews =
            business.reviews.length;

        business.rating =

            business.reviews.reduce(

                (sum, review) =>

                    sum + review.rating,

                0

            ) /

            business.totalReviews;

        await business.save();

        return res.status(200).json(

            new ApiResponse(

                200,

                business,

                "Review updated successfully"

            )

        );

    }

);



// =====================================
// Delete Review
// =====================================

export const deleteReview = asyncHandler(

    async (req, res) => {

        const { businessId } = req.params;

        const business = await Business.findById(
            businessId
        );

        if (!business) {

            throw new ApiError(
                404,
                "Business not found"
            );

        }

        const reviewIndex =
            business.reviews.findIndex(

                (review) =>

                    review.user.toString() ===
                    req.user._id.toString()

            );

        if (reviewIndex === -1) {

            throw new ApiError(
                404,
                "Review not found"
            );

        }

        business.reviews.splice(
            reviewIndex,
            1
        );

        // ==========================
        // Update Rating
        // ==========================

        business.totalReviews =
            business.reviews.length;

        if (business.totalReviews === 0) {

            business.rating = 0;

        } else {

            business.rating =

                business.reviews.reduce(

                    (sum, review) =>

                        sum + review.rating,

                    0

                ) /

                business.totalReviews;

        }

        await business.save();

        return res.status(200).json(

            new ApiResponse(

                200,

                business,

                "Review deleted successfully"

            )

        );

    }

);


// =====================================
// Edit Product
// =====================================

export const updateProduct = asyncHandler(

    async (req, res) => {

        const {
            businessId,
            productId,
        } = req.params;

        const business =
            await Business.findById(businessId);

        if (!business) {

            throw new ApiError(
                404,
                "Business not found"
            );

        }

        if (

            business.owner.toString() !==
            req.user._id.toString()

        ) {

            throw new ApiError(
                403,
                "Unauthorized"
            );

        }

        const product =
            business.products.id(productId);

        if (!product) {

            throw new ApiError(
                404,
                "Product not found"
            );

        }

        product.name =
            req.body.name;

        product.description =
            req.body.description;

        product.price =
            req.body.price;

        product.image =
            req.body.image;

        product.available =
            req.body.available;

        await business.save();

        return res.status(200).json(

            new ApiResponse(

                200,

                product,

                "Product updated successfully"

            )

        );

    }

);


// =====================================
// Edit Offer
// =====================================

export const updateOffer = asyncHandler(

    async (req, res) => {

        const {
            businessId,
            offerId,
        } = req.params;

        const business =
            await Business.findById(businessId);

        if (!business) {

            throw new ApiError(
                404,
                "Business not found"
            );

        }

        if (

            business.owner.toString() !==
            req.user._id.toString()

        ) {

            throw new ApiError(
                403,
                "Unauthorized"
            );

        }

        const offer =
            business.offers.id(offerId);

        if (!offer) {

            throw new ApiError(
                404,
                "Offer not found"
            );

        }

        offer.title =
            req.body.title;

        offer.description =
            req.body.description;

        offer.validTill =
            req.body.validTill;

        await business.save();

        return res.status(200).json(

            new ApiResponse(

                200,

                offer,

                "Offer updated successfully"

            )

        );

    }

);



// =====================================
// Get My Business
// =====================================

export const getMyBusiness = asyncHandler(

    async (req, res) => {

        const business = await Business.findOne({

            owner: req.user._id,

        }).populate(

            "owner",

            "name email avatar"

        );

        if (!business) {

            throw new ApiError(

                404,

                "You don't own any business"

            );

        }

        return res.status(200).json(

            new ApiResponse(

                200,

                business,

                "Business fetched successfully"

            )

        );

    }

);


// =====================================
// Record Business View
// =====================================

// export const recordBusinessView = asyncHandler(

//     async (req, res) => {

//         const { id } = req.params;

//         const business = await Business.findById(id);

//         if (!business) {

//             throw new ApiError(
//                 404,
//                 "Business not found"
//             );

//         }

//         business.totalViews += 1;

//         business.views.push({

//             user: req.user._id,

//             viewedAt: new Date(),

//         });

//         await business.save();

//         return res.status(200).json(

//             new ApiResponse(

//                 200,

//                 business,

//                 "View recorded successfully"

//             )

//         );

//     }

// );


export const recordBusinessView = asyncHandler(async (req, res) => {

    const { businessId } = req.params;

    const business = await Business.findById(businessId);

    if (!business) {

        throw new ApiError(
            404,
            "Business not found"
        );

    }

    // Don't count owner's own visits
    if (business.owner.toString() === req.user._id.toString()) {

        return res.status(200).json(

            new ApiResponse(
                200,
                null,
                "Owner visit ignored"
            )

        );

    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const alreadyViewedToday = business.views.find(

        (view) =>

            view.user.toString() === req.user._id.toString() &&

            view.viewedAt >= today

    );

    if (!alreadyViewedToday) {

        business.views.push({

            user: req.user._id,

            viewedAt: new Date(),

        });

        business.totalViews += 1;

        await business.save();

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            null,

            "Business view recorded successfully"

        )

    );

});



export const getBusinessAnalytics = asyncHandler(async (req, res) => {

    const { businessId } = req.params;

    const business = await Business.findById(businessId);

    if (!business) {

        throw new ApiError(
            404,
            "Business not found"
        );

    }

    // ===========================
    // Dates
    // ===========================

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    sevenDaysAgo.setHours(0, 0, 0, 0);

    // ===========================
    // Today's Views
    // ===========================

    const todayViews = business.views.filter(

        (view) => view.viewedAt >= today

    ).length;

    // ===========================
    // Weekly Views
    // ===========================

    const weeklyViews = business.views.filter(

        (view) => view.viewedAt >= sevenDaysAgo

    ).length;

    // ===========================
    // Unique Visitors
    // ===========================

    const uniqueVisitors = new Set(

        business.views.map(

            (view) => view.user.toString()

        )

    ).size;

    // ===========================
    // Weekly Visitors Chart Data
    // ===========================

    const weekDays = [

        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",

    ];

    const weeklyVisitors = [

        { day: "Mon", visitors: 0 },
        { day: "Tue", visitors: 0 },
        { day: "Wed", visitors: 0 },
        { day: "Thu", visitors: 0 },
        { day: "Fri", visitors: 0 },
        { day: "Sat", visitors: 0 },
        { day: "Sun", visitors: 0 },

    ];

    business.views.forEach((view) => {

        const dayName = weekDays[
            new Date(view.viewedAt).getDay()
        ];

        const day = weeklyVisitors.find(

            (item) => item.day === dayName

        );

        if (day) {

            day.visitors += 1;

        }

    });

    // ===========================
    // Rating Distribution
    // ===========================

    const ratingDistribution = [

        { stars: "5★", count: 0 },
        { stars: "4★", count: 0 },
        { stars: "3★", count: 0 },
        { stars: "2★", count: 0 },
        { stars: "1★", count: 0 },

    ];

    business.reviews.forEach((review) => {

        switch (review.rating) {

            case 5:
                ratingDistribution[0].count++;
                break;

            case 4:
                ratingDistribution[1].count++;
                break;

            case 3:
                ratingDistribution[2].count++;
                break;

            case 2:
                ratingDistribution[3].count++;
                break;

            case 1:
                ratingDistribution[4].count++;
                break;

            default:
                break;

        }

    });

    // ===========================
    // Analytics Response
    // ===========================

    const analytics = {

        totalViews: business.totalViews,

        todayViews,

        weeklyViews,

        uniqueVisitors,

        totalProducts: business.products.length,

        totalOffers: business.offers.length,

        totalReviews: business.reviews.length,

        averageRating: business.rating,

        weeklyVisitors,

        ratingDistribution,

    };

    return res.status(200).json(

        new ApiResponse(

            200,

            analytics,

            "Business analytics fetched successfully"

        )

    );

});