import Home_component from "@/Components/home_component";

function Dashboard() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Home_component />
      </div>
    </div>
  );
}

export default Dashboard;
