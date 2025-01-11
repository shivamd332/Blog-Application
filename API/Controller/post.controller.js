import Post from "../Model/post.model.js";
import { errorHandler } from "../Utils/error.js";

export const createPost = async (req, res, next) => {
  console.log(req.user);

  if (!req.user.isAdmin) {
    return next(
      errorHandler(
        403,
        "You are not an admin,and hence not allowed to create post"
      )
    );
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all the required fileds"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-z0-9-]/g, "-"); // just google this code line you understand it's meaning
  // below code is using the Post model to create a new collection named post in our mongodb
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save(); // this line is simply saving the data in db
    res.status(201).json(savedPost); // send the response post that is saved in our db
  } catch (error) {
    next(error);
  }
};

// to get posts this function will handle that
//this api funciton can be reused im many area 
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0; // this startIndex is telling that from which index number api will start to fetch the post document from the databse(collection named posts)
    const limit = parseInt(req.query.limit) || 9; // this will limit the how much number of post should be fetch from the database
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
           { title: { $regex: req.query.searchTerm, $options: "i" } }, // Corrected here
          { content: { $regex: req.query.searchTerm, $options: "i" } }, // Corrected here
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPost = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )
    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    })

    res.status(200).json({ posts, totalPost, lastMonthPost })
  } catch (error) {
    next(error);
  }
};
//this function will delete the selected post
export const deletePost = async (req, res, next) => {
  // we are simple checking the user is admin or not and also checking the provided userId is valid or not
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(errorHandler(403, "You are not allowed to delete the post"))
  try {
    await Post.findByIdAndDelete(req.params.postId);// this will simply delete the post based on there id from the DB
    res.status(200).json('The post has been delete')
  } catch (error) {
    next(error)
  }
}

//update post 
export let updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(errorHandler(403, "You are not allowed to update the post"))
  try {
    const updatePost = await Post.findByIdAndUpdate(req.params.postId, { $set: { title: req.body.title, content: req.body.content, category: req.body.category, image: req.body.image } },{new:true})
    res.status(200).json(updatePost)
  } catch (error) {
    next(error)
  }
}