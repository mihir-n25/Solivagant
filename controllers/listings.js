const Listing = require("../models/listing");
const Review = require('../models/review');
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    const allListings =  await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm =  (req ,res) => {
    res.render("listings/new.ejs");

};


module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('owner');
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
};

module.exports.createListing = async (req, res) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    // Access the file uploaded by multer
    if (req.file && req.file.path) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect(`/listings/${listing._id}`);
};


module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // Assign the logged-in user as the author
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'New review added!');
    res.redirect(`/listings/${listing._id}`);
};



module.exports.rendereditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file && req.file.path) {
                listing.image = {
                    url: req.file.path,
                    filename: req.file.filename
                };
            }
        
            await listing.save();
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}