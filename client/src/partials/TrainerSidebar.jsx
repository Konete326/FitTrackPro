import AppSidebar from "./AppSidebar";

const sections = [
  {
    title: "Trainer",
    iconKey: "trainers",
    isActive: true,
    items: [
      { title: "Dashboard", url: "/trainer/dashboard", exact: true },
      { title: "My Clients", url: "/trainer/clients" },
      { title: "Templates", url: "/trainer/templates" },
    ],
  },
  {
    title: "Account",
    iconKey: "profile",
    items: [
      { title: "Profile", url: "/trainer/profile" },
      { title: "Edit Public Profile", url: "/trainer/profile/edit" },
      { title: "Settings", url: "/trainer/settings" },
    ],
  },
];

function TrainerSidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <AppSidebar
      sections={sections}
      homePath="/trainer/dashboard"
      title="FitTrack Pro"
      subtitle="Trainer Panel"
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
  );
}

export default TrainerSidebar;
