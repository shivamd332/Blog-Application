import { Footer } from "flowbite-react";
import { BsGithub } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";
export default function FooterOfPage() {
  return <>
    <Footer container>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Link to="/" className=" dark:text-white text-4xl font-bold">
              <span className="px-2 py-1">MERN</span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Link to={'/about'}>
                <Footer.Title title="about" />
              </Link>
            </div>
            <div>
              <Footer.Title title="Follow us" />
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="https://www.linkedin.com/in/aniket-kumar-a255b6246/" target="_black" icon={FaLinkedin} />
          </div>
        </div>
      </div>
    </Footer>
  </>
}
