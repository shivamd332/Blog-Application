import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RiDeleteBin6Line } from "react-icons/ri";
import { ImCheckmark } from "react-icons/im";
import { FaTimes } from "react-icons/fa";

export default function DashUser() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModel, setShowModel] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null)
    // console.log("This consle is of dashPost",userPost);
    //   console.log(userPost);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                // console.log(data);
                if (res.ok) {
                    // Set the posts when the response is successful
                    setUsers(data.users);
                    if (data.users.length < 9) setShowMore(false);
                } else {
                    console.log("Error fetching posts:", data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) fetchUsers();
    }, [currentUser._id]);
    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(
                `/api/user/getusers?startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeleteUser = async () => {
        try {
            const res=await fetch(`/api/user/delete/${deleteUserId}`,{
                method:"DELETE",
            })
            const data= await res.json();
            if(res.ok){
                setUsers((prev)=>prev.filter((user)=>user._id!==deleteUserId))
                setShowModel(false)
            }else{
                console.log(data.message);
                
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <>
            <section className="table-auto md:mx-auto p-4 md:p-6 max-w-full overflow-x-hidden">
                {currentUser.isAdmin && users.length > 0 ? (
                    <>
                    <div className="overflow-x-auto">

                        <Table hoverable className="shadow-md resize">
                            <Table.Head>
                                <Table.HeadCell>Date Created</Table.HeadCell>
                                <Table.HeadCell>User Image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>User Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>
                                    <span>Delete</span>
                                </Table.HeadCell>

                            </Table.Head>
                            {users.map((user) => {
                                return (
                                    <Table.Body key={user._id} className="divide-y">
                                        <Table.Row>
                                            <Table.Cell>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </Table.Cell>
                                            <Table.Cell>

                                                <img
                                                    src={user.profilePic}
                                                    alt={user.username}
                                                    className="w-10 h-10 object-cover bg-gray-500 rounded-full "
                                                />

                                            </Table.Cell>
                                            <Table.Cell>

                                                {user.username}

                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-mono">{user.email}</span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-mono">{user.isAdmin ? (<ImCheckmark className="text-green-500" />) : (<FaTimes className="text-red-600" />)}</span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-red-500 font-medium hover:underline cursor-pointer" onClick={() => { setShowModel(true); setDeleteUserId(user._id) }} >
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
                    <p>You not having any user yet!!</p>
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
                                Are you sure you want to delete  this user?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={handleDeleteUser}>
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
