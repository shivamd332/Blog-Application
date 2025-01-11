import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Modal, Textarea } from "flowbite-react";
import { BiMessageSquareError } from "react-icons/bi";
import { FaCommentDots } from "react-icons/fa6";
import EachComment from "./EachComment";
import { PiWarningCircleFill } from "react-icons/pi";

function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [comments, setComments] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (comment.length > 200) return;
      const res = await fetch("/api/comment/commentcreation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  // const handleLike = async (eachcommentId) => {
  //   // console.log(eachComment);

  //   try {
  //     if (!currentUser) {
  //       navigate("/sign-in");
  //       return;
  //     }
  //     const res = await fetch(`/api/comment/likeComment/${eachcommentId}`, {
  //       method: "PUT",
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       setComments(
  //         comments.map((cmmt) => {
  //           cmmt._id === eachcommentId
  //             ? {
  //                 ...cmmt,
  //                 likes: data.likes,
  //                 numberOfLikes: data.likes.length,
  //               }
  //             : cmmt;
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  const handleLike = async (eachcommentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${eachcommentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((cmmt) =>
            cmmt._id === eachcommentId
              ? {
                  ...cmmt,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : cmmt
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleEdit = (eachComment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === eachComment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (eachCommentId) => {
    setShowModel(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deletecomment/${eachCommentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.filter((comment) => comment._id !== eachCommentId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto w-full p-3 border-2 border-yellow-500">
        {currentUser ? (
          <div className="flex items-center gap-1  my-5 text-gray-500 text-sm">
            <p>Signed in as:</p>
            <img
              className="h-10 w-10 object-cover rounded-full mx-0.5"
              src={currentUser.profilePic}
            />
            <Link
              className="text-cyan-600 hover:underline "
              to={`/dashboard?tab=profile`}
            >
              @{currentUser.username}
            </Link>
          </div>
        ) : (
          <div className="text-sm text-teal-500 my-5 flex gap-1.5">
            You must be signed in to comment.
            <Link className="text-blue-600 hover:underline" to={`/sign-in`}>
              Sign in
            </Link>
          </div>
        )}
        {currentUser && (
          <form className="rounded-md p-3" onSubmit={handleSubmit}>
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              required
              rows={4}
              maxLength="200"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className=" flex gap-1 mt-2 justify-between items-center">
              <p className="text-gray-500 text-sm">
                {200 - comment.length} characters reamining
              </p>
              <Button type="submit" gradientDuoTone="tealToLime">
                Submit
              </Button>
            </div>
          </form>
        )}
        {commentError && (
          <>
            <Alert color="failure" icon={BiMessageSquareError}>
              <span className="font-medium">Info alert!</span>
              {commentError}
            </Alert>
          </>
        )}
        {comments.length === 0 ? (
          <p className="text-sm my-5">No Comment yet</p>
        ) : (
          <>
            <div className="border-2 border-red-600">
              <div className="flex flex-wrap gap-2 mx-4 my-1">
                <Badge color="indigo" size="sm" icon={FaCommentDots}>
                  {comments.length} comments
                </Badge>
              </div>
              {comments.map((commentsInPost) => {
                return (
                  <EachComment
                    eachComment={commentsInPost}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={(eachCommentId) => {
                      setShowModel(true);

                      setCommentToDelete(eachCommentId);
                    }}
                    key={commentsInPost._id}
                  />
                );
              })}
            </div>
          </>
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
              <PiWarningCircleFill className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this comment?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => handleDelete(commentToDelete)}
                >
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowModel(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default CommentSection;
