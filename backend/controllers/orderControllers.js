import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/product.js";

// Create new order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(
      new ErrorHandler(`No order found with id: ${req.params.id}`, 404),
    );
  }
  res.status(201).json({
    success: true,
    order,
  });
});

// Get current user orders => /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(
      new ErrorHandler(`No order found with id: ${req.params.id}`, 404),
    );
  }
  res.status(201).json({
    success: true,
    orders,
  });
});

// Get all orders - ADMIN => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  // if (!orders) {
  //     return next(new ErrorHandler(`No order found with id: ${req.params.id}`, 404));
  // }
  res.status(201).json({
    success: true,
    orders,
  });
});

// Update orders - ADMIN => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorHandler(`No order found with id: ${req.params.id}`, 404),
    );
  }
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler(
        `Order with id: ${req.params.id} is already delivered`,
        400,
      ),
    );
  }

  order.orderItems.forEach(async (item) => {
    const product = await Product.findById(item.product.toString());
    if (!product) {
      return next(
        new ErrorHandler(`No product found with id: ${item.product}`, 404),
      );
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });

  const totalorders = await Order.countDocuments();

  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();

  await order.save();

  // console.log("updaed");
  res.status(201).json({
    totalorders,
    success: true,
    order,
  });
});

// Delete Order => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorHandler(`No order found with id: ${req.params.id}`, 404),
    );
  }
  await order.deleteOne();

  res.status(201).json({
    success: true,
  });
});

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      //stage 1: Filter results
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      //stage 2: Group Data
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrders: { $sum: 1 },
      },
    },
  ]);

  // create a map of date to sales and orders
  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;
  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });
  // generate an array of dates between start and end date
  const datesBetween = getDatesBetween(startDate, endDate);

  // create final sales data array with 0  for dates with no data
  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    const formatedDate = currentDate.toISOString().split("T")[0];
    dates.push(formatedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

// Get Sales Data => /api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const { salesData, totalSales, totalNumOrders } = await getSalesData(
    startDate,
    endDate,
  );

  res.status(201).json({
    success: true,
    totalSales,
    totalNumOrders,
    sales:salesData,
  });
});
