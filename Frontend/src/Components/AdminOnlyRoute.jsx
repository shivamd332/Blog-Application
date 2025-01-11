import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminOnlyRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser&&currentUser.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />;
  // this outlet is the child of this component.
  //in our case its the createPost.jsx page is the child of AdminOnlyRoute.jsx
}
