import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Layouts/HomeLayout";
import {forgetPassword} from './../../Redux/Slices/AuthSlice';

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate emailR
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      const res = await dispatch(forgetPassword({ email })).unwrap();

      if (res.success) {
        toast.success(res.message || "Reset link sent to your email");
        setEmail("");
        navigate("/login");
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Forget password error:", error);
      toast.error(error?.message || "Server error");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Forget Password</h1>

          <p>
            Enter your registered email. We will send you a verification link
            to reset your password.
          </p>

          <div className="flex flex-col gap-1">
            <input
              required
              type="email"
              name="email"
              id="email"
              placeholder="Enter your registered email"
              className="bg-transparent px-2 py-1 border"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <button
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            Get Verification Link
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="link text-accent cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default ForgetPassword;
