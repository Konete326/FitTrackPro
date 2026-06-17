import AppSidebar from "./AppSidebar";

const sections = [
  {
    name: "Management",
    links: [
      { to: "/admin/dashboard", label: "Dashboard", exact: true },
      { to: "/admin/users", label: "All Users" },
      { to: "/admin/trainers", label: "Trainers" },
      { to: "/admin/trainer-requests", label: "Trainer Requests" },
      { to: "/admin/assigned-trainers", label: "Assignments" },
      { to: "/admin/feedbacks", label: "Feedbacks" },
    ],
  },
  {
    name: "Account",
    links: [
      { to: "/admin/profile", label: "Profile" },
      { to: "/admin/settings", label: "Settings" },
    ],
  },
];

function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <AppSidebar
      sections={sections}
      homePath="/admin/dashboard"
      title="FitTrack Pro"
      subtitle="Admin Panel"
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
  );
}

export default AdminSidebar;
