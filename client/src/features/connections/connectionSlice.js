import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: [],
}

export const fetchConnections = createAsyncThunk(' connections/fetchConnections', async (token) => {

    try {
        const { data } = await api.get('/api/user/connections', {
            headers: { Authorization: `Bearer ${token}` },
        })
        return data.success ? data : null;

    } catch (error) {
        console.log("Error in conn fetched", error)
    }

    return null;
}
)

const connnectionSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchConnections.fulfilled, (state, action) => {
            if (action.payload) {
                state.connections = action.payload.connections
                state.pendingConnections = action.payload.pendingConnections
                state.followers = action.payload.followers
                state.following = action.payload.following
            }
        })
    }
})

export default connnectionSlice.reducer