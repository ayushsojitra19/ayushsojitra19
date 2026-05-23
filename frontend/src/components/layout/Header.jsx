import React from "react";
import Search from "./Search";
import { useGetMeQuery } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useLazyLogoutQuery } from "../../redux/api/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const navigate = useNavigate();

  const { isLoading } = useGetMeQuery();
  const [logout, { data }] = useLazyLogoutQuery();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = async () => {
    navigate("/");
    logout();
    navigate(0);
    logout();
    navigate(0);
  };

  return (
    <>
      {/*
      <nav className="navbar row navbar-logo">
        <div className="col-12 col-md-3 ps-5 ">
          <div className="navbar-brand">
            <a href="/">
              <img src="/images/shopit_logo.png" alt="ShopIT Logo" />
            </a>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Search />
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <a href="/cart" style={{ textDecoration: "none" }}>
            <span id="cart" className="ms-3">
              {" "}
              Cart{" "}
            </span>
            <span className="ms-1" id="cart_count">
              {cartItems.length}
            </span>
          </a>
          {user ? (
            <div className="ms-4 dropdown">
              <button
                className="btn dropdown-toggle text-white"
                type="button"
                id="dropDownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={
                      user?.avatar
                        ? user?.avatar?.url
                        : "../images/default_avatar.jpg"
                    }
                    alt="User Avatar"
                    className="rounded-circle"
                  />
                </figure>
                <span>{user.name}</span>
              </button>
              <div
                className="dropdown-menu w-100"
                aria-labelledby="dropDownMenuButton"
              >
                {user.role === "admin" && (
                  <Link className="dropdown-item" to="/admin/dashboard">
                    Dashboard
                  </Link>
                )}

                <Link className="dropdown-item" to="/me/orders">
                  Orders
                </Link>

                <Link className="dropdown-item" to="/me/profile">
                  Profile
                </Link>

                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !isLoading && (
              <Link to="/login" className="btn ms-4" id="login_btn">
                {" "}
                Login{" "}
              </Link>
            )
          )}
        </div>
      </nav>
      */}

      {/* laptop nav */}
      <nav className="navbar py-2 px-3 sticky-top" id="laptop-nav">
        <div className="container-fluid">
          <div className="row w-100 align-items-center">
            {/* 1. Logo: Left-aligned for both */}
            <div className="col-6 col-md-3 text-start ps-md-5">
              <Link to="/">
                <img
                  src="/images/shopit_logo.png"
                  alt="Logo"
                  className="header-logo"
                />
              </Link>
            </div>

            {/* 2. Search: LAPTOP ONLY (Middle) */}
            <div className="d-none d-md-block col-md-6">
              <Search />
            </div>

            {/* 3. Cart & Profile: Right-aligned */}
            <div className="col-6 col-md-3 d-flex justify-content-end align-items-center pe-md-5">
              <Link
                to="/cart"
                className="text-decoration-none d-flex align-items-center me-3"
              >
                <span id="cart" className="d-none d-sm-inline text-white">
                </span>
                <span id="cart_count" className="ms-1">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  {" "}
                  {cartItems.length}
                </span>
              </Link>

              {user ? (
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle text-white p-0 border-0 d-flex align-items-center"
                    type="button"
                    id="dropDownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <figure className="avatar avatar-nav mb-0 me-1">
                      <img
                        src={
                          user?.avatar
                            ? user?.avatar?.url
                            : "../images/default_avatar.jpg"
                        }
                        alt="User"
                        className="rounded-circle"
                      />
                    </figure>
                    <span className="d-none d-lg-inline small">
                      {user.name}
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow"
                    aria-labelledby="dropDownMenuButton"
                  >
                    {user.role === "admin" && (
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link className="dropdown-item" to="/me/orders">
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/me/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={logoutHandler}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                !isLoading && (
                  <Link to="/login" className="btn btn-sm px-3" id="login_btn">
                    Login
                  </Link>
                )
              )}
            </div>

            {/* 4. Search: MOBILE ONLY (Below) */}
            <div className="d-block d-md-none col-12 mt-2">
              <Search />
            </div>
          </div>
        </div>
      </nav>

      {/* mobile nav */}
      <nav className="navbar py-2 px-3 sticky-top" id="laptop-mob">
        <div className="container-fluid">
          <div className="row w-100 align-items-center" id="margin-0">
            {/* 1. Logo: Left-aligned for both */}
            <div className="col-6 col-md-3 text-start ps-md-5">
              <Link to="/">
                <img
                  src="/images/shopit_logo.png"
                  alt="Logo"
                  className="header-logo"
                />
              </Link>
            </div>

            {/* 3. Cart & Profile: Right-aligned */}
            <div
              className="col-6 col-md-3 d-flex justify-content-end align-items-center pe-md-5"
              id="margin-0"
            >
              <Link
                to="/cart"
                className="text-decoration-none d-flex align-items-center me-3"
              >
                <span
                  id="cart"
                  className="d-none d-sm-inline text-white"
                ></span>
                <span id="cart_count" className="ms-1">
                  <FontAwesomeIcon icon={faShoppingCart} /> {cartItems.length}
                </span>
              </Link>

              {user ? (
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle text-white p-0 border-0 d-flex align-items-center"
                    type="button"
                    id="dropDownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <figure className="avatar avatar-nav mb-0 me-1">
                      <img
                        src={
                          user?.avatar
                            ? user?.avatar?.url
                            : "../images/default_avatar.jpg"
                        }
                        alt="User"
                        className="rounded-circle"
                      />
                    </figure>
                    <span className="d-none d-lg-inline small">
                      {user.name}
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow"
                    aria-labelledby="dropDownMenuButton"
                  >
                    {user.role === "admin" && (
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link className="dropdown-item" to="/me/orders">
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/me/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={logoutHandler}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                !isLoading && (
                  <Link to="/login" className="btn btn-sm px-3" id="login_btn">
                    Login
                  </Link>
                )
              )}
            </div>

            {/* 4. Search: MOBILE ONLY (Below) */}
            <div className="d-block d-md-none col-12 mt-2" id="search-margin-0">
              <Search />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
