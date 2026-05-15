import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router";
import {
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../redux/api/orderApi";

const ProcessOrder = () => {
  const [status, setStatus] = useState("");
  const params = useParams();

  const { data, isLoading: isDataLoading } = useOrderDetailsQuery(params?.id);
  const [updateOrder, { isSuccess, error, isLoading: isUpdating }] =
    useUpdateOrderMutation();

  const order = data?.order;

  // Sync dropdown with current order status from database
  useEffect(() => {
    if (order?.orderStatus) {
      setStatus(order?.orderStatus);
    }
  }, [order]);

  // Handle Success/Error messages
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Update failed");
    }
    if (isSuccess) {
      toast.success("Order updated successfully");
    }
  }, [error, isSuccess]);

  const updateOrderHandler = (id) => {
  // Change 'status' to 'orderStatus'
  const updateData = { orderStatus: status }; 
  updateOrder({ id, body: updateData });
};

  if (isDataLoading) return <AdminLayout><p className="text-center mt-5">Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="container container-fluid">
        <div className="row d-flex justify-content-around">
          <div className="col-12 col-lg-8 order-details">
            <h3 className="mt-5 mb-4">Order Details</h3>

            <table className="table table-striped table-bordered">
              <tbody>
                <tr><th scope="row">ID</th><td>{order?._id}</td></tr>
                <tr>
                  <th scope="row">Order Status</th>
                  <td className={order?.orderStatus === "Delivered" ? "greenColor" : "redColor"}>
                    <b>{order?.orderStatus}</b>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 className="mt-5 mb-4">Shipping Info</h3>
            <table className="table table-striped table-bordered">
              <tbody>
                <tr><th scope="row">Name</th><td>{order?.user?.name}</td></tr>
                <tr><th scope="row">Phone No</th><td>{order?.shippingInfo?.phoneNo}</td></tr>
                <tr>
                  <th scope="row">Address</th>
                  <td>{order?.shippingInfo?.address}, {order?.shippingInfo?.city}, {order?.shippingInfo?.postalCode}</td>
                </tr>
              </tbody>
            </table>

            <h3 className="mt-5 mb-4">Payment Info</h3>
            <table className="table table-striped table-bordered">
              <tbody>
                <tr><th scope="row">Status</th><td className="greenColor"><b>{order?.paymentInfo?.status}</b></td></tr>
                <tr><th scope="row">Method</th><td>{order?.paymentMethod}</td></tr>
                <tr><th scope="row">Stripe ID</th><td>{order?.paymentInfo?.stripeId || "N/A"}</td></tr>
                <tr><th scope="row">Amount</th><td>${order?.totalAmount?.toFixed(2)}</td></tr>
              </tbody>
            </table>

            <h3 className="mt-5 my-4">Order Items:</h3>
            <hr />
            <div className="cart-item my-1">
              {order?.orderItems?.map((item) => (
                <div className="row my-5" key={item?.product}>
                  <div className="col-4 col-lg-2">
                    <img src={item?.image} alt={item?.name} height="45" width="65" />
                  </div>
                  <div className="col-5 col-lg-5">
                    <Link to={`/product/${item?.product}`}>{item?.name}</Link>
                  </div>
                  <div className="col-4 col-lg-2 mt-4 mt-lg-0"><p>${item?.price?.toFixed(2)}</p></div>
                  <div className="col-4 col-lg-3 mt-4 mt-lg-0"><p>{item?.quantity} Piece(s)</p></div>
                </div>
              ))}
            </div>
            <hr />
          </div>

          <div className="col-12 col-lg-3 mt-5">
            <h4 className="my-4">Status</h4>
            <div className="mb-3">
              <select
                className="form-select"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={() => updateOrderHandler(order?._id)}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </button>

            <h4 className="mt-5 mb-3">Order Invoice</h4>
            <Link to={`/invoice/order/${order?._id}`} className="btn btn-success w-100">
              <i className="fa fa-print"></i> Generate Invoice
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ⚠️ THIS LINE IS CRITICAL TO FIX THE ERROR
export default ProcessOrder;
