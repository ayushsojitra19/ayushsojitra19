import React, { use, useEffect } from 'react'
import { useResetPasswordMutation } from '../../redux/api/userApi';
import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const ResetPassword = () => {

    const[password, setPassword] = React.useState("");
    const[confirmPassword, setConfirmPassword] = React.useState("");

    const navigate = useNavigate();
    const params = useParams();

    const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();

    const { isAuthenticated } = useSelector((state) => state.auth);
    
      useEffect(() => {
        if (isAuthenticated) {
          navigate("/");
        }
        if (error) {
            toast.error(error?.data?.message || "Something went wrong");
            console.log(error);
        }
        if (isSuccess) {
            toast.success("Password reset successful");
            navigate("/login");
        }
      }, [error, isAuthenticated,isSuccess]);
    
      const submitHandler = (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }

        const data = {
            password,
            confirmPassword
        }
    
        
        resetPassword({token: params.token, body:data});
      };


  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">New Password</h2>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_password_field" className="form-label"
              >Confirm Password</label
            >
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button id="new_password_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
            {isLoading ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
