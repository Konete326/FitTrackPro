import AppSidebar from "./AppSidebar";

const sections = [
  {
    name: "Trainer",
    links: [
      { to: "/trainer/dashboard", label: "Dashboard", exact: true },
      { to: "/trainer/clients", label: "My Clients" },
      { to: "/trainer/templates", label: "Templates" },
    ],
  },
  {
    name: "Account",
    links: [
      { to: "/trainer/profile", label: "Profile" },
      { to: "/trainer/settings", label: "Settings" },
    ],
  },
];

const panelSwitcherLinks = [
  { to: "/dashboard", label: "User Panel", prefix: "/dashboard" },
];

function TrainerSidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <AppSidebar
      sections={sections}
      panelSwitcherLinks={panelSwitcherLinks}
      homePath="/trainer/dashboard"
      title="FitTrack Pro"
      subtitle="Trainer Panel"
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
  );
}

export default TrainerSidebar;
