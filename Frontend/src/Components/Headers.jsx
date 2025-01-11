import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";

import { BsSearch } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { BsFillCloudMoonFill } from "react-icons/bs";
import { IoPartlySunny } from "react-icons/io5";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import { signoutSuccess } from "../redux/user/userSlice.js";
import { useEffect, useState } from "react";

export default function Headers() {
  const { currentUser } = useSelector((state) => state.user);
  // console.log('this console log is coming from Headers.jsx',currentUser);
  
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const location=useLocation();
  const navigate=useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm,setSearchTerm]=useState('');
  
  

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
  useEffect(()=>{
    const urlParams= new URLSearchParams(location.search);
    const searchTermFromUrl=urlParams.get('searchTerm')
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }

  },[location.search])
  
  const handleSubmit=(event)=>{
    event.preventDefault();
    const urlParams= new URLSearchParams(location.search)
    urlParams.set('searchTerm',searchTerm)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`)

  }
  return (
    <>
      <Navbar>
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl dark:text-white"
        >
          <span className="px-2 py-1">MERN</span>
          Blog
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Search.."
            rightIcon={BsSearch}
            className="hidden  lg:inline"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <IoIosSearch />
        </Button>
        <div className="flex gap-2 md:order-2 ">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <BsFillCloudMoonFill /> : <IoPartlySunny />}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="user" img={currentUser.profilePic} rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.email}</span>
                <span className="block text-sm font-medium truncate">
                  @{currentUser.username}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>signout</Dropdown.Item>
            </Dropdown>
          ) : (
            <>
              <Link to="/sign-in">
                <Button gradientMonochrome="success" outline>
                  SignIn
                </Button>
              </Link>
            </>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to="/projects">Project</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
