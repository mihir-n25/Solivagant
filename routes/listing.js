const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

router
    .route("/")
    .get((listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        upload.single('listing[image][url]'),wrapAsync(listingController.createListing)
    );


//new route
router.get('/new', listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing ))
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        upload.single('listing[image][url]'),
        wrapAsync(listingController.updateListing))
    .delete(wrapAsync(listingController.deleteListing));
    
//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync( listingController.rendereditForm ));
     
module.exports = router;
