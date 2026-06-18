import AppSidebar from "./AppSidebar";

const sections = [
  {
    title: "Management",
    iconKey: "layers",
    isActive: true,
    items: [
      { title: "Dashboard", url: "/admin/dashboard", exact: true },
      { title: "All Users", url: "/admin/users" },
      { title: "Trainers", url: "/admin/trainers" },
      { title: "Trainer Requests", url: "/admin/trainer-requests" },
      { title: "Assignments", url: "/admin/assigned-trainers" },
      { title: "Feedbacks", url: "/admin/feedbacks" },
    ],
  },
  {
    title: "Account",
    iconKey: "profile",
    items: [
      { title: "Profile", url: "/admin/profile" },
      { title: "Settings", url: "/admin/settings" },
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
