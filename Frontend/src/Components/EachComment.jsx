import React, { useEffect, useState } from "react";
import moment from "moment";
import { TiThumbsUp } from "react-icons/ti";
import { useSelector } from "react-redux";
import { Textarea, Button } from "flowbite-react";

function EachComment(props) {
  const { eachComment, onLike, onEdit,onDelete } = props;
  const { currentUser } = useSelector((state) => state.user);
  let [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(eachComment.content);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(eachComment.content);
  };
  useEffect(() => {
    let getUser = async () => {
      try {
        const res = await fetch(`/api/user/${eachComment.userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [eachComment]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${eachComment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(eachComment, editedContent);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex p-4 border-b dark:border-gray-600 text-sm">
        <div className="flex-shrink-0 mr-3">
          <img
            className="w-10 h-10 rounded-full bg-gray-200"
            src={user.profilePic}
            alt="UserProfile"
          />
        </div>
        <div className="flex-1 border-2 border-pink-500">
          <div className="flex items-center mb-2">
            <span className="font-bold mx-3 text-xs truncate">
              {user ? `@${user.email}` : `Anonymous User`}
            </span>
            <span className="text-gray-400 text-xs">
              {moment(eachComment.createdAt).fromNow()}
            </span>
          </div>
          {isEditing ? (
            <>
              <div className="max-w-md">
                <Textarea
                  value={editedContent}
                  onChange={(e) => {
                    setEditedContent(e.target.value);
                  }}
                  id="comment"
                  className="my-2 mx-4"
                  placeholder="Leave a comment..."
                />
              </div>
              <div className="flex justify-end">
                <div className="flex gap-4 ">
                  <Button color="success" size="xs" pill onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    color="failure"
                    pill
                    size="xs"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="px-4 py-1">{eachComment.content}</p>
              <div className=" mx-4 flex pt-2 items-center text-sm  max-w-fit  gap-2">
                <button
                  type="button"
                  onClick={() => onLike(eachComment._id)}
                  className={`text-gray-500 hover:text-blue-500 ${
                    currentUser &&
                    eachComment.likes.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <TiThumbsUp className="w-5 h-5" />
                </button>
                <p className="text-gray-500">
                  {eachComment.numberOfLikes > 0 &&
                    eachComment.numberOfLikes +
                      " " +
                      (eachComment.numberOfLikes === 1 ? "Like" : "Likes")}
                </p>
                {currentUser &&
                  (currentUser._id === eachComment.userId ||
                    currentUser.isAdmin) && (
                    <>
                      <button
                        type="button "
                        onClick={handleEdit}
                        className=" text-gray-500 hover:text-amber-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button "
                        onClick={() => onDelete(eachComment._id)}
                        className=" text-gray-500 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default EachComment;
