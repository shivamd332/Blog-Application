import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "flowbite-react";
import CommentSection from "../Components/CommentSection";
import PostCard from "../Components/PostCard";
export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState(null);
  console.log(recentPost);

  useEffect(() => {
    let fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setError(false);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPost(data.posts);
        }
      };
      fetchRecentPost();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <>
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </>
    );
  return (
    <>
      <main className=" border-2 border-red-500 p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className=" text-3xl mt-5 p-3 text-center font-serif  max-w-2xl mx-auto lg:text-4xl border-2 border-green-500">
          {post && post.title.toUpperCase()}
        </h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className=" self-center my-2"
        >
          <Button color="light" pill>
            {post && post.category}
          </Button>
        </Link>
        <img
          src={post && post.image}
          alt="post-image"
          className="mt-10 p-3 max-h-[500px] w-full object-cover"
        />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs ">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins to read
          </span>
        </div>
        <div
          className="p-3 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <CommentSection postId={post._id} />

        <div className="border-2 border-red-500 my-5 flex flex-col justify-center items-center">
          <h1 className="text-5xl my-2">Recents Articles</h1>
          {/* w-3/4 flex flex-col md:flex-row gap-2 py-2 px-1 */}
          
          <div className=" flex flex-wrap gap-5 my-5  justify-center">
            {recentPost &&
              recentPost.map((post) => (
                <>
                  <PostCard key={post._id} post={post} />
                </>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
