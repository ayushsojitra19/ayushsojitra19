import React, { Children } from "react";
import SideMenu from "./SideMenu";

const UserLayout = ({ children }) => {

    const menuItems = [
    { name: "Dashboard", url: "/admin/dashboard"},
    {
      name: "New Product",
      url: "/admin/products/new",
      icon: "fa-solid fa-box",
    },
    {
      name: "Product List",
      url: "/admin/products",
      icon: "fa-solid fa-boxes",
    },
    { 
      name: "Orders",
      url: "/admin/orders",
      icon: "fa-solid fa-shopping-cart",
    },
    { 
      name: "Users",
      url: "/admin/users",
      icon: "fa-solid fa-users",
    },
    { 
      name: "Reviews",
      url: "/admin/reviews",
      icon: "fa-solid fa-star",
    },
  ];


  return (
    <div>
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center fw-bolder">User Setting</h2>
      </div>
      <div className="container">
        <div className="row justify-content-around">
          <div className="col-12 col-lg-3">
            <SideMenu menuItems={menuItems} />
          </div>
          <div className="col-12 col-lg-8 user-dashboard">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
