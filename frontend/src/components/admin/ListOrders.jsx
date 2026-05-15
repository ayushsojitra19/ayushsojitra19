import react, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import { useDeleteProductMutation } from "../../redux/api/productsApi";
import AdminLayout from "../layout/AdminLayout";
import { useDeleteOrderMutation, useGetAdminOrdersQuery } from "../../redux/api/orderApi";

const ListOrders = () => {
  const { data, isLoading, error } = useGetAdminOrdersQuery();

  const [deleteOrder, { isLoading: isDeleteLoading, error: deleteError, isSuccess: isDeleteSuccess }] = useDeleteOrderMutation();

  //   const [deleteProduct, { isLoading: isDeleteLoading,error: deleteError , isSuccess: isDeleteSuccess}] = useDeleteProductMutation();
  console.log(data);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isDeleteSuccess) {
      toast.success("Product deleted successfully");
    }
  }, [error, deleteError, isDeleteSuccess]);

    const deleteOrderHandler = (id) => {
      if (window.confirm("Are you sure you want to delete this order?")) {
        deleteOrder(id);
      }}

  const setProducts = () => {};

  if (isLoading) {
    return <Loader />;
  }

  const cellStyle = { padding: "12px", borderBottom: "1px solid #eee" };

  return (
    <>
      <AdminLayout>
        <div>
          <h1 className="my-5">
            {data?.orders?.length > 0
              ? `You have ${data.orders.length} Orders`
              : "You have no orders"}
          </h1>
        </div>

        {data?.orders?.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                  <th style={cellStyle}>Product ID</th>
                  <th style={cellStyle}>Payment Status</th>
                  <th style={cellStyle}>Order Status</th>
                  <th style={cellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order) => (
                  <tr
                    key={order?._id}
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
                    <td style={cellStyle}>{order?._id}</td>
                    <td style={cellStyle}>
                      {order?.paymentInfo?.status === "paid" ? (
                        <span className="badge bg-success">Paid</span>
                      ) : (
                        <span className="badge bg-danger">NOT PAID</span>
                      )}
                    </td>
                    <td style={cellStyle}>
                      {order?.orderStatus}
                    </td>
                    <td style={cellStyle}></td>
                    <td style={cellStyle}>
                      <Link
                        to={`/admin/orders/${order?._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View Details
                      </Link>
                      
                      <button
                        className="btn btn-outline-danger btn-sm ms-2"
                          onClick={() => deleteOrderHandler(order?._id)}
                          disabled={isDeleteLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default ListOrders;
