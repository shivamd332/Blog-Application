import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { PiUsersThreeFill } from "react-icons/pi";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa";
import { current } from "@reduxjs/toolkit";

export default function Dashsidebar() {
  // from here to
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search); //URLSearchParams() it is a constructor of js
    const tabFromUrl = urlParam.get("tab");
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      // due to this code of line we are setting the tab state so that we can display the dashboard component based on url
      setTab(tabFromUrl);
    }
  }, [location.search]);
  // to here this code is simply capturing the url in dashboard and console logging it
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-2">
          {
            currentUser&&currentUser.isAdmin&&(
              <Link to={`/dashboard?tab=dashboard`}>
                <Sidebar.Item
                active={tab=='dashboard'||!tab}
                icon={FaChartPie}
                as='div'
                >
                  DashBoard
                </Sidebar.Item>
              </Link>
            )
          }
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                icon={FaUserCircle}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            {currentUser.isAdmin && (<>

                <Link to="/dashboard?tab=posts">
                  <Sidebar.Item
                    active={tab === 'posts'}
                    as="div"
                    icon={BsFileEarmarkPostFill}
                  >
                    Post
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=comments">
                  <Sidebar.Item
                    active={tab === 'comments'}
                    as="div"
                    icon={AiOutlineComment}
                  >
                    Comment
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=users">
                  <Sidebar.Item
                    active={tab === 'users'}
                    as="div"
                    icon={PiUsersThreeFill}
                  >
                    Users
                  </Sidebar.Item>
                </Link>
            </>
              )}
            <Sidebar.Item
              icon={FaSignOutAlt}
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              Sign-out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
}
