import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import errorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";
import { log } from "console";
import { upload_file, delete_file } from "../utils/cloudinary.js";

// create new product --> api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {

    const resPerPage = 4;
    const apiFeatures = new APIFilters(Product, req.query).search().filter();


    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    })

});


// create new product --> api/v1/admin/products
export const newProducts = catchAsyncErrors(async (req, res) => {
    req.body.user = req.user._id;

    const product = await Product.create(req.body);

    res.status(200).json({
        product
    })

});


// Get single product details with :id --> api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    res.status(200).json({
        product
    })

});


// Get products Admin --> api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find()

   

    res.status(200).json({
        products
    })

});


// Update product details --> api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        // runValidators: true
    });

    res.status(200).json({
        product
    })

});




// Upload product images --> api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    const uploader = async (image) => upload_file(image, "shopit/products");

    // 1. Map the image strings into an array of upload promises
    const uploadPromises = req.body.images.map(uploader);

    // 2. Resolve all upload promises simultaneously
    const urls = await Promise.all(uploadPromises);

    // 3. Push results to product images array and save
    product?.images?.push(...urls);
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        product
    });
});


// delete product images --> api/v1/admin/products/:id/delete_images
export const deleteProductImages = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    const isDeleted = await delete_file(req.body.imgId);

    if (isDeleted) {
        product.images = product.images.filter((img) => img.public_id !== req.body.imgId);
        await product.save({ validateBeforeSave: false });
    }

    res.status(200).json({
        product
    });
});



// Delete product details --> api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.params.id);



    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    //deleting images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await delete_file(product.images[i].public_id);
    }



    await product.deleteOne();



    res.status(200).json({
        message: "Product deleted successfully"
    })

});


// Create/Update product review --> api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        // name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {

        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.rating = rating;
                review.comment = comment;
            }
        });


    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });



    res.status(200).json({
        success: true,
    })

});


// Get product reviews --> api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    res.status(200).json({
        reviews: product.reviews,
    })
});


// Delete product review --> api/v1/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
        numOfReviews === 0 ? 0 : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            numOfReviews;



    product =await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
    });
    await product.save({ validateBeforeSave: false });



    res.status(200).json({
        success: true,
        product
    })

});
