const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req,res,next)=>{
    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });
    
    res.status(201).json({
        success:true,
        order
    })
});

exports.getSingleOrder = catchAsyncErrors(async (req,res,next) => {

    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
    res.status(200).json({
        success:true,
        order
    });
});

// Get orders for users 
exports.myOrders = catchAsyncErrors(async (req,res,next) => {

    const order = await Order.find({user: req.user._id});

    res.status(200).json({
        success:true,
        order
    });
});

// Get All the orders.
exports.getAllOrders = catchAsyncErrors(async (req,res,next) => {

    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    });
});

// Update -- Order
exports.updateOrder = catchAsyncErrors(async (req,res,next) => {

    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.Product, order.quantity);
    });

    order.orderStatus = req.body.status;
    

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    
    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    });
});

// update the quantity of product
async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave: false});
}

// delete an order
exports.deleteOrder = catchAsyncErrors(async (req,res,next) => {

    const order = await Order.findById(req.params.id);
    
    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404))
    }

    await order.remove()

    res.status(200).json({
        success:true,
    });
});