import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Dashsidebar from "../Components/Dashsidebar";
import Dashprofile from "../Components/Dashprofile";
import DashPost from "../Components/DashPost";
import DashUser from "../Components/DashUser";
import DashComment from "../Components/DashComment";
import DashboardComp from "../Components/DashboardComp";

export default function Dashboard() {
  // from here to
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search); //URLSearchParams() it is a constructor of js
    const tabFromUrl = urlParam.get("tab");
    // console.log(tabFromUrl);
    if(tabFromUrl){ // due to this code of line we are setting the tab state so that we can display the dashboard component based on url
      setTab(tabFromUrl)
    }

  }, [location.search]);
  // to here this code is simply capturing the url in dashboard and console logging it
  return (
    <>
      <section className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-56 my-2 mx-1.5">
          {/* sideBar */}
          <Dashsidebar />
        </div>

        {/* profile and etc */}
        {tab === "profile" && <Dashprofile />}
        {/* posts... */}
        {tab=='posts'&&<DashPost/>}
        {/* Users */}
        {tab=='users'&&<DashUser/>}
        {/* comment */}
        {tab=='comments'&&<DashComment/>}
        {/* dasboard */}
        {tab=='dashboard'&&<DashboardComp/>}

      </section>
    </>
  );
}
