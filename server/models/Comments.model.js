import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: String, ref: "Post", required: true, index: true,},

    user: { type: String, ref: "User", required: true, },

    content: { type: String, required: true, trim: true,},
  },
  { timestamps: true,}
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;