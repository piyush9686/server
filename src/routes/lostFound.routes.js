// import { Router } from "express";
// import { verifyJWT } from "../middleware/auth.middleware.js";
// import upload  from "../middleware/upload.middleware.js";
// import { validate } from "../middleware/validation.middleware.js";

// import {
//   createLostFound,
//   getAllLostFound,
//   getLostFoundById,
//   updateLostFound,
//   deleteLostFound,
//   getTrendingItems,
//   getSimilarItems,
//   increaseViewCount,
//   markAsFound,
//   getNearbyItems,
//   bookmarkLostFound,
//   getBookmarks,
//   contactOwner,
  

// } from "../controllers/lostFound.controllers.js";

// import { createLostFoundValidation } from "../validations/lostFound.validation.js";


// const router = Router();

// // Public Routes
// router.get("/", getAllLostFound);
// router.get("/nearby", getNearbyItems);
// router.get("/:id", getLostFoundById);


// // Protected Routes
// router.post(
//   "/",
//   verifyJWT,
//   upload.array("images", 5),
//   createLostFoundValidation,
//   validate,
//   createLostFound
// );

// router.put("/:id", verifyJWT, updateLostFound);
// router.delete("/:id", verifyJWT, deleteLostFound);
// router.patch("/:id/mark-found", verifyJWT, markAsFound);


// router.get("/trending", getTrendingItems);

// router.get("/:id/similar", getSimilarItems);

// router.patch("/:id/view", increaseViewCount);

// router.post("/:id/bookmark", verifyJWT, bookmarkLostFound);
// router.get("/bookmarks", verifyJWT, getBookmarks);
// router.post("/:id/contact", verifyJWT, contactOwner);


// export default router;

import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import {
  createLostFound,
  getAllLostFound,
  getLostFoundById,
  updateLostFound,
  deleteLostFound,
  getTrendingItems,
  getSimilarItems,
  increaseViewCount,
  markAsFound,
  getNearbyItems,
  bookmarkLostFound,
  getBookmarks,
  contactOwner,
  getMyLostFound,
} from "../controllers/lostFound.controllers.js";

import { createLostFoundValidation } from "../validations/lostFound.validation.js";

const router = Router();

/* ===========================
   Public Routes
=========================== */

router.get("/", getAllLostFound);

router.get("/nearby", getNearbyItems);

router.get("/trending", getTrendingItems);

/* ===========================
   Protected Routes
=========================== */

router.post(
  "/",
  verifyJWT,
  upload.array("images", 5),
  createLostFoundValidation,
  validate,
  createLostFound
);

router.get("/my-items", verifyJWT, getMyLostFound);

router.get("/bookmarks", verifyJWT, getBookmarks);

router.post("/:id/bookmark", verifyJWT, bookmarkLostFound);

router.post("/:id/contact", verifyJWT, contactOwner);

router.put(
  "/:id",
  verifyJWT,
  upload.array("images", 5),
  updateLostFound
);

router.delete("/:id", verifyJWT, deleteLostFound);

router.patch("/:id/mark-found", verifyJWT, markAsFound);

router.patch("/:id/view", increaseViewCount);

/* ===========================
   Dynamic Routes (Keep Last)
=========================== */

router.get("/:id/similar", getSimilarItems);

router.get("/:id", getLostFoundById);

export default router;