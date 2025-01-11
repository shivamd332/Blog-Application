import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unqiue: true,
  },
  image: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/blogging-fun-content-creation-online-streaming-video-blog-young-girl-making-selfie-social-network-sharing-feedback-self-promotion-strategy-vector-isolated-concept-metaphor-illustration_335657-855.jpg",
  },
  category: {
    type: String,
    default: "uncategorized",
  },
  slug: {
    type: String,
    required: true,
    unqiue: true,
  },
},{timestamps:true});
const Post = mongoose.model('Post', postSchema);
export default Post;
