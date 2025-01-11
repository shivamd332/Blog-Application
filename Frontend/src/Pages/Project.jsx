import { List, Tabs } from "flowbite-react";
import { ImBlogger2 } from "react-icons/im";
import { IoFastFoodSharp } from "react-icons/io5";
import { GiNewspaper } from "react-icons/gi";
import { FaDrum } from "react-icons/fa";
import { GiRattlesnake } from "react-icons/gi";
export default function Projects() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">Pojects List</h1>

      <Tabs aria-label="Default tabs" variant="default" className="gap-4">
        <Tabs.Item active title="Blog Posting Website" icon={ImBlogger2}>
          My latest project is a full-stack blog posting website built using the
          MERN stack (MongoDB, Express.js, React, and Node.js). This platform
          allows users to create, edit, and manage blog posts with an intuitive
          interface. It also includes features like user authentication, dynamic
          content filtering, and a fully functional comment section. The blog is
          designed to be responsive, ensuring a seamless experience across
          devices.
          <List className="my-2">
            <span className="text-lg text-slate-100">Key Features:</span>
            <List.Item>Secure login and user authentication.</List.Item>
            <List.Item>Create, edit, and delete blog posts.</List.Item>
            <List.Item>Real-time content filtering and pagination.</List.Item>
            <List.Item>Commenting system for user interaction.</List.Item>
            <List.Item>
              Responsive design for both desktop and mobile users.
            </List.Item>
          </List>
        </Tabs.Item>
        <Tabs.Item title=" Food Ordering Web App" icon={IoFastFoodSharp}>
          Developed a food ordering app using the MERN stack, where users can
          browse a dynamic menu, add items to their cart, and place orders
          securely. The app is equipped with user authentication for a
          personalized experience and provides a smooth, efficient ordering
          system.
          <List className="my-2">
            <span className="text-lg text-slate-100">Key Features:</span>
            <List.Item>
              User authentication and secure ordering process.
            </List.Item>
            <List.Item>Dynamic menu and cart functionality.</List.Item>
            <List.Item>
              Smooth navigation for a better user experience.
            </List.Item>
          </List>
        </Tabs.Item>
        <Tabs.Item title="News Web App " icon={GiNewspaper}>
          This responsive web application, built with React and Tailwind CSS,
          allows users to stay updated with the latest news from various
          sources. The user-friendly interface makes it easy to browse and
          discover news stories.
          <List className="my-2">
            <span className="text-lg text-slate-100">Key Features:</span>
            <List.Item>Real-time news updates.</List.Item>
            <List.Item>Responsive and intuitive user interface.</List.Item>
          </List>
        </Tabs.Item>
        <Tabs.Item title=" Drum Kit Website" icon={FaDrum}>
          This fun, dynamic web application lets users play a virtual drum kit
          using their keyboard. Built with HTML, CSS, and JavaScript, it’s a
          simple yet entertaining project that showcases interactive web
          functionality.
          <List className="my-2">
            <span className="text-lg text-slate-100">Key Features:</span>
            <List.Item>Interactive drum kit simulation.</List.Item>
            <List.Item>Keyboard controls for user interaction.</List.Item>
            <List.Item>
              Smooth navigation for a better user experience.
            </List.Item>
          </List>
        </Tabs.Item>
        <Tabs.Item title="Retro Snake Game " icon={GiRattlesnake}>
          A faithful recreation of the classic Nokia Snake game, built using
          HTML, CSS, and JavaScript. It provides a nostalgic gaming experience
          with simple yet addictive gameplay.
          <List className="my-2">
            <span className="text-lg text-slate-100">Key Features:</span>
            <List.Item>Classic retro design.</List.Item>
            <List.Item>Engaging gameplay mechanics.</List.Item>
          </List>
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
