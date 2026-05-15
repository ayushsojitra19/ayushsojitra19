import react, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import { useDeleteProductMutation, useGetAdminProductsQuery } from "../../redux/api/productsApi";
import AdminLayout from "../layout/AdminLayout";

const ListProducts = () => {
  const { data, isLoading, error } = useGetAdminProductsQuery();

  const [deleteProduct, { isLoading: isDeleteLoading,error: deleteError , isSuccess: isDeleteSuccess}] = useDeleteProductMutation();



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
    
  }, [error, deleteError]);

  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
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
          {data?.products?.length > 0
            ? `You have ${data.products.length} Products`
            : "You have no products"}
        </h1>
      </div>
      
      {data?.products?.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                {/* <th style={cellStyle}>Product ID</th> */}
                <th style={cellStyle}>Name</th>
                <th style={cellStyle}>Stock</th>
                <th style={cellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product?._id} style={{ borderBottom: "1px solid #ddd" }}>
                  {/* <td style={cellStyle}>{product?._id}</td> */}
                  <td style={cellStyle}>${product?.name?.toString().substring(0, 20)}...</td>
                  <td style={cellStyle}>
                    {product?.stock}
                  </td>
                  <td style={cellStyle}>
                    
                  </td>
                  <td style={cellStyle}>
                    <Link
                      to={`/admin/products/${product?._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/admin/products/${product?._id}/upload_images`}
                      className="btn btn-outline-success btn-sm ms-2"
                    >
                      Upload Images
                    </Link>
                    <button
                      
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => deleteProductHandler(product?._id)}
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

export default ListProducts;
