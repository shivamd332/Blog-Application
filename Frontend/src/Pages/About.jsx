export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
          Welcome to My Blog!
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
            Hello, and thank you for visiting! This blog was created with the passion to share knowledge, ideas, and personal experiences on topics that matter to me. Whether it's the latest trends in technology, insightful tutorials, or reflections on daily life, this space is where I bring my thoughts and creativity to life.
            </p>

            <p>
            As a developer with a deep interest in the MERN stack (MongoDB, Express, React, and Node.js), I often post content that blends both my technical knowledge and personal journey in the world of web development. You'll find a variety of topics here, ranging from coding tutorials to discussions about emerging technologies. I hope to inspire and assist fellow developers and tech enthusiasts as they embark on their own journeys.
            </p>

            <p>
            In addition to technical content, I love to explore topics related to creativity, innovation, and personal growth. This blog is a place for everyone—whether you're a fellow coder, someone looking for inspiration, or just here to read something new. Feel free to explore, comment, and share your own thoughts.
            </p>
          </div>
          <p className="text-md text-gray-300 flex flex-col gap-6 my-4 ">Thanks for stopping by, and I hope you enjoy reading as much as I enjoy writing!</p>
        </div>
      </div>
    </div>
  );
}