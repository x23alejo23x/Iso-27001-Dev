import Home_component from "@/Components/home_component";
import Header from "@/Components/Header";

function Dashboard() {
  return <div className="h-screen flex flex-col">
    <div className="flex-shrink-0">
      <Header />
    </div>
    <div className="flex-1 overflow-hidden">
      <Home_component />
    </div>
  </div>;
}

export default Dashboard;
