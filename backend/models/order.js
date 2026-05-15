import mongoose from "mongoose";
// import user from "./user";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        // state: {
        //     type: String,
        //     required: true,
        // },
        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        phoneNo: {
            type: String, 
            required: true,
        }, 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            name: {
                type: String,   
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ], 
    paymentMethod: {
        type: String,
        required: [true,"Please select payment method"],
        enum: { 
            values: ["COD", "Card"],
            message: "Please select : COD or Card",    
    },
    },
    paymentInfo: {
        id: String, 
        status: String,
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    taxAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        enum: {
            values: ["Processing", "Shipped", "Delivered"],
            message: "Please select : Processing, Shipped or Delivered",
        },
        default: "Processing",
    },
    deliveredAt: Date,

},{timestamps: true});

export default mongoose.model('Order', orderSchema);