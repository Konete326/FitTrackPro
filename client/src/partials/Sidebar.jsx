import AppSidebar from "./AppSidebar";

const sections = [
  {
    title: "Fitness",
    iconKey: "dashboard",
    isActive: true,
    items: [
      { title: "Dashboard", url: "/dashboard", exact: true },
      { title: "Workouts", url: "/workouts" },
      { title: "Nutrition", url: "/nutrition" },
      { title: "Water", url: "/water" },
      { title: "Progress", url: "/progress" },
      { title: "Sleep", url: "/sleep" },
      { title: "Goals", url: "/goals" },
    ],
  },
  {
    title: "Connect",
    iconKey: "trainers",
    items: [
      { title: "Browse Trainers", url: "/browse-trainers" },
      { title: "Achievements", url: "/achievements" },
    ],
  },
  {
    title: "Account",
    iconKey: "profile",
    items: [
      { title: "Profile", url: "/profile" },
      { title: "Settings", url: "/settings" },
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
