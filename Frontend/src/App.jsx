import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Project from "./Pages/Project";
import Headers from "./Components/Headers";
import FooterOfPage from "./Components/Footer";
import PrivateRoute from "./Components/PrivateRoute";
import AdminOnlyRoute from "./Components/AdminOnlyRoute";
import CreatePost from "./Pages/CreatePost";
import UpdatePost from "./Pages/UpdatePost";
import PostPage from "./Pages/PostPage";
import ScrollToTop from "./Components/ScrollToTop";
import Search from "./Pages/Search";
function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Headers />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<AdminOnlyRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/projects" element={<Project />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
        </Routes>
        <FooterOfPage />
      </BrowserRouter>
    </>
  );
}

export default App;
