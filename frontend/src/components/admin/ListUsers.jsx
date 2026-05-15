import react, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import { useDeleteProductMutation } from "../../redux/api/productsApi";
import AdminLayout from "../layout/AdminLayout";
import { useDeleteOrderMutation,  } from "../../redux/api/orderApi";
import { useDeleteUserMutation, useGetAdminUsersQuery } from "../../redux/api/userApi";

const ListUsers = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();

  const [deleteUser, { isLoading: isDeleteLoading, error: deleteError, isSuccess: isDeleteSuccess }] = useDeleteUserMutation();

  

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isDeleteSuccess) {
      toast.success("User deleted successfully");
    }
  }, [error, deleteError, isDeleteSuccess]);

    const deleteUserHandler = (id) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        deleteUser(id);
      }}

  
  if (isLoading) {
    return <Loader />;
  }

  const cellStyle = { padding: "12px", borderBottom: "1px solid #eee" };

  return (
    <>
      <AdminLayout>
        <div>
          <h1 className="my-5">
            {data?.users?.length > 0
              ? `You have ${data.users.length} Users`
              : "You have no Users"}
          </h1>
        </div>

        {data?.users?.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                  <th style={cellStyle}>User ID</th>
                  <th style={cellStyle}>Name</th>
                  <th style={cellStyle}>Email</th>
                  <th style={cellStyle}>Role</th>
                  <th style={cellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr
                    key={user?._id}
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
                    <td style={cellStyle}>{user?._id}</td>
                    <td style={cellStyle}>
                      {user?.name}
                    </td>
                    <td style={cellStyle}>
                      {user?.email}
                    </td>
                    <td style={cellStyle}>
                      {user?.role}
                    </td>
                    <td style={cellStyle}>
                      <Link
                        to={`/admin/users/${user?._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View Details
                      </Link>
                      
                      <button
                        className="btn btn-outline-danger btn-sm ms-2"
                          onClick={() => deleteUserHandler(user?._id)}
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

export default ListUsers;
