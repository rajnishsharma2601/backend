

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../Layouts/HomeLayout";
import { resetPassword } from "../../Redux/Slices/AuthSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const [data, setData] = useState({
    password: "",
    cnfPassword: "",
  });

  // ✅ Handle input change
  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // ✅ Optional console to verify token
  useEffect(() => {
    console.log("Reset Token from URL:", resetToken);
  }, [resetToken]);

  // ✅ Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { password, cnfPassword } = data;

    if (!password || !cnfPassword) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error("Password must have 8+ characters including uppercase, lowercase and number");
      return;
    }

    if (password !== cnfPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // ✅ Dispatch to backend with token
    const res = await dispatch(resetPassword({ resetToken, password }));

    if (res?.payload?.success) {
      toast.success("Password reset successful!");
      navigate("/login");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Reset Password</h1>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="password">
              New Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="Enter new password"
              className="bg-transparent px-2 py-1 border"
              value={data.password}
              onChange={handleUserInput}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="cnfPassword">
              Confirm Password
            </label>
            <input
              required
              type="password"
              name="cnfPassword"
              id="cnfPassword"
              placeholder="Confirm password"
              className="bg-transparent px-2 py-1 border"
              value={data.cnfPassword}
              onChange={handleUserInput}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPassword;
