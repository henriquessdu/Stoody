import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import CourseCard from "../components/CourseCard.jsx";

function Home() {
  const navigate = useNavigate();
  const { search, setSearch } = useGame();

  const courses = [
    { 
      id: "japanese-anime",
      title: "Learn Japanese with Anime", 
      xp: 150, 
      coins: 50,
      description: "Master essential Japanese expressions from your favorite anime series!"
    },
    { 
      id: "english-pokemon",
      title: "English with Pokémon", 
      xp: 120, 
      coins: 40,
      description: "Learn English vocabulary through Pokémon battles and conversations."
    },
    { 
      id: "spanish-basics",
      title: "Spanish Basics", 
      xp: 100, 
      coins: 30,
      description: "Get started with essential Spanish phrases and grammar."
    }
  ];

  const query = (search ?? "").toLowerCase();
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(query)
  );

  const handleStartCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Recommended Courses
            </h2>
            <p className="text-gray-600">
              Choose a course and start learning today!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  xp={course.xp}
                  coins={course.coins}
                  onStart={() => handleStartCourse(course.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No courses found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;