import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null)
  // console.log("This consle is of dashPost",userPost);
  console.log(userPost);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
        const data = await res.json();
        // console.log(data);
        if (res.ok) {
          // Set the posts when the response is successful
          setUserPost(data.posts);
          if (data.posts.length < 9) setShowMore(false);
        } else {
          console.log("Error fetching posts:", data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = userPost.length;
    try {
      const res = await fetch(
        `/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPost((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/post/deletepost/${deletePostId}/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = res.json()
      if (!res.ok)
        console.log(data.message);
      else {
        //see the setuserpost.Inside you will learn how hold the previous value of an array by arrow function and params will prev
        //prev.filter we are simply filter the content of array
        setUserPost((prev) => prev.filter((post) => post._id !== deletePostId))
      }
    } catch (error) {
      console.log(error);

    }
  }
  return (
    <>

      <section className=" table-auto md:mx-auto p-4 md:p-6 max-w-full overflow-x-hidden">
        {currentUser.isAdmin && userPost.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table hoverable className="shadow-md w-full">
                <Table.Head>
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Post Image</Table.HeadCell>
                  <Table.HeadCell>Post Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Delete</span>
                  </Table.HeadCell>
                  <Table.HeadCell>
                    <span>Update</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {userPost.map((post) => (
                    <Table.Row key={post._id}>
                      <Table.Cell>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.image}
                            alt="post-image"
                            className="w-20 h-10 object-cover bg-gray-500"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="font-medium text-slate-950 dark:text-slate-200"
                          to={`/post/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-mono">{post.category}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-500 font-medium hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModel(true);
                            setDeletePostId(post._id);
                          }}
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="text-teal-500 hover:underline"
                          to={`/update-post/${post._id}`}
                        >
                          <span>Update</span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 text-sm py-3 mt-4"
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p>You don't have any posts yet!</p>
        )}
        <Modal
          show={showModel}
          size="md"
          onClose={() => setShowModel(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <RiDeleteBin6Line className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this post?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeletePost}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowModel(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </section>

    </>
  );
}
