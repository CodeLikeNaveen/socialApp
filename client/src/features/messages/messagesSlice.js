import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { useAuth } from "@clerk/react";

const initialState = {
    messages: []
}

export const fetchMesssages = createAsyncThunk('messageas/fetchMessages', async ({ token, userId }) => {
    const { getToken } = useAuth()
    const { data } = await api.post('/api/message/get', { to_user_id: userId }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
    })
    return data.success ? data : null;
})

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessages: (state, action) => {
            state.messages = [...state.messages, action.payload]
        },
        resetMessages: (state) => {
            state.messages = []
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMesssages.fulfilled, (state, action) => {
            if (action.payload) {
                state.messages = action.payload
            }
        })
    }
})


export const {
    setMessages,
    addMessages,
    resetMessages
} = messagesSlice.actions;

export default messagesSlice.reducer