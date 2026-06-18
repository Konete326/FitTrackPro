import AppSidebar from "./AppSidebar";

const sections = [
  {
    name: "Fitness",
    links: [
      { to: "/dashboard", label: "Dashboard", exact: true },
      { to: "/workouts", label: "Workouts" },
      { to: "/nutrition", label: "Nutrition" },
      { to: "/water", label: "Water" },
      { to: "/progress", label: "Progress" },
      { to: "/sleep", label: "Sleep" },
      { to: "/goals", label: "Goals" },
    ],
  },
  {
    name: "Connect",
    links: [
      { to: "/browse-trainers", label: "Browse Trainers" },
      { to: "/achievements", label: "Achievements" },
    ],
  },
  {
    name: "Account",
    links: [
      { to: "/profile", label: "Profile" },
      { to: "/settings", label: "Settings" },
    ],
  },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <AppSidebar
      sections={sections}
      homePath="/dashboard"
      title="FitTrack Pro"
      subtitle="Fitness Tracker"
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
  );
}

export default Sidebar;
