import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLoginMutation } from "../../redux/api/authApi";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; // Use Link for faster navigation

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  }, [error, isAuthenticated, navigate]);

  const submitHandler = (e) => {
    e.preventDefault(); // FIXED: Prevents page reload
    const loginData = { email, password };
    login(loginData);
  };

  return (
    // 'wrapper' centers content; 'px-3' adds padding on mobile
    <div className="row wrapper d-flex justify-content-center align-items-center px-3">
      {/* col-11 for tiny phones, col-md-6 for tablets, col-lg-4 for laptop */}
      <div className="col-11 col-md-6 col-lg-4">
        <form className="shadow rounded bg-body p-4 p-md-5" onSubmit={submitHandler}>
          <h2 className="mb-4 text-center">Login</h2>

          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 overflow-hidden">
            <Link to="/password/forgot" className="float-end small text-decoration-none">
              Forgot Password?
            </Link>
          </div>

          <button
            id="login_button"
            type="submit"
            className="btn btn-warning w-100 py-2 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "LOGIN"}
          </button>

          <div className="mt-4 text-center">
            <span className="small">New User? </span>
            <Link to="/register" className="small text-decoration-none">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
