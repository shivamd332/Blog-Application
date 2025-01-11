import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RiDeleteBin6Line } from "react-icons/ri";
import { ImCheckmark } from "react-icons/im";
import { FaTimes } from "react-icons/fa";

export default function DashComment() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModel, setShowModel] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState(null)
    // console.log("This consle is of dashPost",userPost);
    //   console.log(userPost);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                // console.log(data);
                if (res.ok) {
                    // Set the posts when the response is successful
                    setComments(data.comments);
                    if (data.comments.length < 9) setShowMore(false);
                } else {
                    console.log("Error fetching posts:", data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) fetchComments();
    }, [currentUser._id]);
    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(
                `/api/comment/getcomments?startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeleteComments = async () => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${deleteCommentId}`, {
                method: "DELETE",
            })
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== deleteCommentId))
                setShowModel(false)
            } else {
                console.log(data.message);

            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <>
            <section className="table-auto md:mx-auto p-4 md:p-6 max-w-full overflow-x-hidden">
                {currentUser.isAdmin && comments.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">

                            <Table hoverable className="shadow-md resize">
                                <Table.Head>
                                    <Table.HeadCell>Date Updated</Table.HeadCell>
                                    <Table.HeadCell>Comment Content</Table.HeadCell>
                                    <Table.HeadCell>Number of Likes</Table.HeadCell>
                                    <Table.HeadCell>Post id</Table.HeadCell>
                                    <Table.HeadCell>User id</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span>Delete</span>
                                    </Table.HeadCell>

                                </Table.Head>
                                {comments.map((comment) => {
                                    return (
                                        <Table.Body key={comment._id} className="divide-y">
                                            <Table.Row>
                                                <Table.Cell>
                                                    {new Date(comment.updatedAt).toLocaleDateString()}
                                                </Table.Cell>
                                                <Table.Cell>

                                                    {comment.content}

                                                </Table.Cell>
                                                <Table.Cell>

                                                    {comment.numberOfLikes}

                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span className="font-mono">{comment.postId}</span>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {comment.userId}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span className="text-red-500 font-medium hover:underline cursor-pointer" onClick={() => { setShowModel(true); setDeleteCommentId(comment._id) }} >
                                                        Delete
                                                    </span>
                                                </Table.Cell>

                                            </Table.Row>
                                        </Table.Body>
                                    );
                                })}
                            </Table>
                        </div>
                        {showMore && (
                            <button
                                onClick={handleShowMore}
                                className="w-full text-teal-500 self-center text-sm py-5 "
                            >
                                Show More
                            </button>
                        )}
                    </>
                ) : (
                    <p>You not having any comments yet!</p>
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
                                Are you sure you want to delete  this comment?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={handleDeleteComments}>
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
