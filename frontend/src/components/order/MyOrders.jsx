import react, { useEffect, useState } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";

const MyOrders = () => {
  const { data, isLoading, error } = useMyOrdersQuery();

  const [searchParams] = useSearchParams();

  const orderSuccess = searchParams.get("order_success");
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (orderSuccess) {
      dispatch(clearCart());
      Navigate("/me/orders");
    }
  }, [error]);

  const setOrders = () => {};

  if (isLoading) {
    return <Loader />;
  }

  const cellStyle = { padding: "12px", borderBottom: "1px solid #eee" };

  return (
    <>
      <div>
        <h1 className="my-5">
          {data?.orders?.length > 0
            ? `You have ${data.orders.length} orders`
            : "You have no orders"}
        </h1>
      </div>
      {/* <div style={{ padding: "20px" }}>
        <input
          type="text"
          placeholder="Search orders..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginBottom: "15px", padding: "8px", width: "100%" }}
        />

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
              <th style={cellStyle}>Order ID</th>
              <th style={cellStyle}>Customer</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={cellStyle}>{order.id}</td>
                <td style={cellStyle}>{order.customer}</td>
                <td style={cellStyle}>
                  <span style={getStatusStyle(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td style={cellStyle}>${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      {data?.orders?.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                <th style={cellStyle}>Order ID</th>
                <th style={cellStyle}>Amount</th>
                <th style={cellStyle}>Payment Status</th>
                <th style={cellStyle}>Order Status</th>
                <th style={cellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr key={order?._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={cellStyle}>{order?._id}</td>
                  <td style={cellStyle}>${order?.totalAmount}</td>
                  <td style={cellStyle}>
                    {order?.paymentInfo?.status?.toUpperCase()}
                  </td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        color: order?.orderStatus?.includes("Delivered")
                          ? "green"
                          : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {order?.orderStatus}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <Link
                      to={`/me/order/${order?._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/invoice/order/${order?._id}`}
                      className="btn btn-success btn-sm ms-2"
                    >
                      Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MyOrders;
