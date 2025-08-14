import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data:
    localStorage.getItem("data") != undefined
      ? JSON.parse(localStorage.getItem("data"))
      : {},
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const res = axiosInstance.post("user/register", data);
    toast.promise(res, {
      loading: "Wait! creating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create account",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosInstance.post("user/login", data);
    toast.promise(res, {
      loading: "Wait! authentication in progress...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log in",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosInstance.post("user/logout");
    toast.promise(res, {
      loading: "Wait! logout in progress...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log out",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
      toast.promise(res, {
        loading: "Wait! profile update in progress...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update profile",
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = axiosInstance.get("user/me");
    return (await res).data;
  } catch (error) {
    toast.error(error.message);
  }
});

export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      let res = axiosInstance.post("/user/change-password", userPassword);

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to change password",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      console.log("Sending email:", email); // should be string

      const responsePromise = axiosInstance.post("/user/reset", {
        email,
      }); // ✅ correct

      const response = await toast.promise(responsePromise, {
        loading: "Sending reset email...",
        success: (res) =>
          res?.data?.message || "Reset email sent successfully!",
        error: (err) =>
          err?.response?.data?.message || "Failed to send reset email",
      });

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    const responsePromise = axiosInstance.post(
      `/user/reset/${data.resetToken}`,
      {
        password: data.password,
      }
    );

    const res = await toast.promise(responsePromise, {
      loading: "Resetting...",
      success: (data) => data?.data?.message || "Password reset successfully",
      error: (err) =>
        err?.response?.data?.message || "Failed to reset password",
    });

    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    throw error; // important so that rejected action in Redux can be handled
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (!action?.payload?.user) return;
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      });
  },
});

//export const {} = authSlice.actions;
export default authSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-hot-toast";
// import axiosInstance from "../../Helpers/axiosInstance";

// const initialState = {
//   isLoggedIn: localStorage.getItem("isLoggedIn") || false,
//   role: localStorage.getItem("role") || "",
//   data:
//     localStorage.getItem("data") != undefined
//       ? JSON.parse(localStorage.getItem("data"))
//       : {},
// };

// export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
//   try {
//     const res = axiosInstance.post("user/register", data);
//     toast.promise(res, {
//       loading: "Wait! creating your account",
//       success: (data) => {
//         return data?.data?.message;
//       },
//       error: "Failed to create account",
//     });
//     return (await res).data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
// });

// export const login = createAsyncThunk("/auth/login", async (data) => {
//   try {
//     const res = axiosInstance.post("user/login", data);
//     toast.promise(res, {
//       loading: "Wait! authentication in progress...",
//       success: (data) => {
//         return data?.data?.message;
//       },
//       error: "Failed to log in",
//     });
//     return (await res).data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
// });

// export const logout = createAsyncThunk("/auth/logout", async () => {
//   try {
//     const res = axiosInstance.post("user/logout");
//     toast.promise(res, {
//       loading: "Wait! logout in progress...",
//       success: (data) => {
//         return data?.data?.message;
//       },
//       error: "Failed to log out",
//     });
//     return (await res).data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
// });

// export const updateProfile = createAsyncThunk(
//   "/user/update/profile",
//   async (data) => {
//     try {
//       const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
//       toast.promise(res, {
//         loading: "Wait! profile update in progress...",
//         success: (data) => {
//           return data?.data?.message;
//         },
//         error: "Failed to update profile",
//       });
//       return (await res).data;
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//   }
// );

// export const getUserData = createAsyncThunk("/user/details", async () => {
//   try {
//     const res = axiosInstance.get("user/me");
//     return (await res).data;
//   } catch (error) {
//     toast.error(error.message);
//   }
// });

// export const changePassword = createAsyncThunk(
//   "/auth/changePassword",
//   async (userPassword) => {
//     try {
//       let res = axiosInstance.post("/user/change-password", userPassword);

//       await toast.promise(res, {
//         loading: "Loading...",
//         success: (data) => {
//           return data?.data?.message;
//         },
//         error: "Failed to change password",
//       });

//       // getting response resolved here
//       res = await res;
//       return res.data;
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//   }
// );

// export const forgetPassword = createAsyncThunk(
//   "auth/forgetPassword",
//   async ({ email }, { rejectWithValue }) => {
//     try {
//       console.log("Sending email:", email); // should be string

//       const responsePromise = axiosInstance.post("/user/reset", { email }); // ✅ correct

//       const response = await toast.promise(responsePromise, {
//         loading: "Sending reset email...",
//         success: (res) =>
//           res?.data?.message || "Reset email sent successfully!",
//         error: (err) =>
//           err?.response?.data?.message || "Failed to send reset email",
//       });

//       return response.data;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong");
//       return rejectWithValue(error?.response?.data);
//     }
//   }
// );

// export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
//   try {
//     const responsePromise = axiosInstance.post(
//       `/user/reset/${data.resetToken}`,
//       {
//         password: data.password,
//       }
//     );

//     const res = await toast.promise(responsePromise, {
//       loading: "Resetting...",
//       success: (data) => data?.data?.message || "Password reset successfully",
//       error: (err) =>
//         err?.response?.data?.message || "Failed to reset password",
//     });

//     return res.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Something went wrong");
//     throw error; // important so that rejected action in Redux can be handled
//   }
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.fulfilled, (state, action) => {
//         localStorage.setItem("data", JSON.stringify(action?.payload?.user));
//         localStorage.setItem("isLoggedIn", true);
//         localStorage.setItem("role", action?.payload?.user?.role);
//         state.isLoggedIn = true;
//         state.data = action?.payload?.user;
//         state.role = action?.payload?.user?.role;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         localStorage.clear();
//         state.data = {};
//         state.isLoggedIn = false;
//         state.role = "";
//       })
//       .addCase(getUserData.fulfilled, (state, action) => {
//         if (!action?.payload?.user) return;
//         localStorage.setItem("data", JSON.stringify(action?.payload?.user));
//         localStorage.setItem("isLoggedIn", true);
//         localStorage.setItem("role", action?.payload?.user?.role);
//         state.isLoggedIn = true;
//         state.data = action?.payload?.user;
//         state.role = action?.payload?.user?.role;
//       });
//   },
// });

// //export const {} = authSlice.actions;
// export default authSlice.reducer;
