import express from "express";

import {

    createBusiness,
    getNearbyBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,

    addProduct,
    updateProduct,
    deleteProduct,

    addOffer,
    updateOffer,
    deleteOffer,

    addGalleryImage,
    deleteGalleryImage,

    addReview,
    updateReview,
    deleteReview,

    getMyBusiness,

    recordBusinessView,
    getBusinessAnalytics,

} from "../controllers/business.controller.js";

import { verifyJWT }
from "../middleware/auth.middleware.js";

import { validate }
from "../middleware/validation.middleware.js";

import { createBusinessValidation }
from "../validations/business.validation.js";

const router = express.Router();


// =====================================
// Business CRUD
// =====================================

router.post(
    "/",
    verifyJWT,
    createBusinessValidation,
    validate,
    createBusiness
);

router.get(
    "/nearby",
    verifyJWT,
    getNearbyBusinesses
);

// IMPORTANT:
// This route MUST come before "/:businessId"

router.get(
    "/my-business",
    verifyJWT,
    getMyBusiness
);


router.get(
    "/:businessId/analytics",
    verifyJWT,
    getBusinessAnalytics
);


router.get(
    "/:businessId",
    verifyJWT,
    getBusinessById
);

router.put(
    "/:businessId",
    verifyJWT,
    updateBusiness
);

router.delete(
    "/:businessId",
    verifyJWT,
    deleteBusiness
);


// =====================================
// Products
// =====================================

router.post(
    "/:businessId/products",
    verifyJWT,
    addProduct
);

router.patch(
    "/:businessId/products/:productId",
    verifyJWT,
    updateProduct
);

router.delete(
    "/:businessId/products/:productId",
    verifyJWT,
    deleteProduct
);


// =====================================
// Offers
// =====================================

router.post(
    "/:businessId/offers",
    verifyJWT,
    addOffer
);

router.patch(
    "/:businessId/offers/:offerId",
    verifyJWT,
    updateOffer
);

router.delete(
    "/:businessId/offers/:offerId",
    verifyJWT,
    deleteOffer
);


// =====================================
// Gallery
// =====================================

router.post(
    "/:businessId/gallery",
    verifyJWT,
    addGalleryImage
);

router.delete(
    "/:businessId/gallery/:imageIndex",
    verifyJWT,
    deleteGalleryImage
);


// =====================================
// Reviews
// =====================================

router.post(
    "/:businessId/reviews",
    verifyJWT,
    addReview
);

router.put(
    "/:businessId/reviews",
    verifyJWT,
    updateReview
);

router.delete(
    "/:businessId/reviews",
    verifyJWT,
    deleteReview
);


// =====================================
// Record Business View
// =====================================

router.post(
    "/:id/view",
    verifyJWT,
    recordBusinessView
);

export default router;