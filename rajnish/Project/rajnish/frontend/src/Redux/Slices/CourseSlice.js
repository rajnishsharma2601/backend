import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    courseData: []
}

export const getAllCourses = createAsyncThunk("/course/get", async (_, { rejectWithValue }) => {
    try {
        const response = await toast.promise(
            axiosInstance.get("/courses"),
            {
                loading: "loading course data...",
                success: "Courses loaded successfully",
                error: "Failed to get the courses",
            }
        );
        return response.data.courses;
    } catch(error) {
        return rejectWithValue(error?.response?.data?.message);
    }
}); 

export const deleteCourse = createAsyncThunk("/course/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await toast.promise(
            axiosInstance.delete(`/courses/${id}`),
            {
                loading: "deleting course ...",
                success: "Course deleted successfully",
                error: "Failed to delete the course",
            }
        );
        return response.data;
    } catch(error) {
        return rejectWithValue(error?.response?.data?.message);
    }
}); 

export const createNewCourse = createAsyncThunk("/course/create", async (data, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("createdBy", data?.createdBy);
        formData.append("thumbnail", data?.thumbnail);

        const response = await toast.promise(axiosInstance.post("/courses", formData), {
            loading: "Creating new course",
            success: "Course created successfully",
            error: "Failed to create course"
        });

        return response.data;

    } catch(error) {
        return rejectWithValue(error?.response?.data?.message);
    }
});

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCourses.fulfilled, (state, action) => {
                if(action.payload) {
                    state.courseData = action.payload;
                }
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                const deletedCourseId = action.meta.arg;
                state.courseData = state.courseData.filter((course) => course._id !== deletedCourseId);
            });
    }
});

export default courseSlice.reducer;