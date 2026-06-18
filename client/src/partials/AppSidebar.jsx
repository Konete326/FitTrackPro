import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const S = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  dashboard: <svg {...S}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /></svg>,
  workouts: <svg {...S}><path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6 2L6 22" /><path d="M18 2L18 22" /><path d="M2 6h4" /><path d="M2 18h4" /><path d="M18 6h4" /><path d="M18 18h4" /></svg>,
  nutrition: <svg {...S}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  water: <svg {...S}><path d="M12 2l5.5 7.5a6.5 6.5 0 1 1-11 0L12 2Z" /></svg>,
  progress: <svg {...S}><path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 5-5" /></svg>,
  sleep: <svg {...S}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></svg>,
  goals: <svg {...S}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  trainers: <svg {...S}><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>,
  achievements: <svg {...S}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>,
  profile: <svg {...S}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  settings: <svg {...S}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
  users: <svg {...S}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  template: <svg {...S}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>,
  requests: <svg {...S}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="m9 14 2 2 4-4" /></svg>,
  assignments: <svg {...S}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>,
  feedbacks: <svg {...S}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>,
  layers: <svg {...S}><path d="M12 2L2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  logout: <svg {...S}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>,
};

const ICON_MAP = [
  ["/dashboard", "dashboard"], ["/workouts", "workouts"], ["/nutrition", "nutrition"],
  ["/water", "water"], ["/progress", "progress"], ["/sleep", "sleep"], ["/goals", "goals"],
  ["/achievements", "achievements"], ["/browse-trainers", "trainers"],
  ["/trainer/clients", "users"], ["/trainer/templates", "template"], ["/trainer/dashboard", "dashboard"],
  ["/trainer/profile/edit", "profile"], ["/trainer/profile", "profile"], ["/trainer/settings", "settings"],
  ["/admin/trainer-requests", "requests"], ["/admin/assigned-trainers", "assignments"],
  ["/admin/feedbacks", "feedbacks"], ["/admin/users", "users"], ["/admin/trainers", "trainers"],
  ["/admin/dashboard", "dashboard"], ["/admin/profile", "profile"], ["/admin/settings", "settings"],
  ["/profile", "profile"], ["/settings", "settings"], ["/trainer", "trainers"], ["/admin", "layers"],
];

const getIcon = (key) => {
  if (ICONS[key]) return ICONS[key];
  const m = ICON_MAP.find(([p]) => key === p || (key !== "/dashboard" && key.startsWith(p)));
  return ICONS[m?.[1]] || ICONS.dashboard;
};

const isActive = (pathname, to) => pathname === to || (to.length > 1 && pathname.startsWith(to + "/"));

function NavMain({ items, expanded }) {
  const { pathname } = useLocation();
  const [openSections, setOpenSections] = useState(() => {
    const init = {};
    items.forEach((item) => { if (item.isActive) init[item.title] = true; });
    return init;
  });

  const toggle = (title) => setOpenSections((p) => ({ ...p, [title]: !p[title] }));

  return (
    <div className="px-3 py-1">
      {items.map((item) => (
        <div key={item.title} className="mb-1">
          <button
            onClick={() => expanded && toggle(item.title)}
            className={`flex items-center w-full rounded-lg text-sm font-medium transition-colors mb-0.5 ${
              expanded ? "h-9 px-3 gap-3" : "h-9 justify-center"
            } ${
              item.items?.some((sub) => isActive(pathname, sub.url))
                ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title={!expanded ? item.title : undefined}
          >
            <span className="shrink-0">{getIcon(item.iconKey)}</span>
            {expanded && (
              <>
                <span className="flex-1 text-left truncate">{item.title}</span>
                <svg
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openSections[item.title] ? "rotate-90" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </>
            )}
          </button>
          {expanded && openSections[item.title] && item.items && (
            <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-200 dark:border-gray-700/60 pl-3">
              {item.items.map((sub) => (
                <NavLink
                  key={sub.url}
                  to={sub.url}
                  end={sub.exact}
                  className={`flex items-center h-8 px-3 rounded-lg text-sm transition-colors ${
                    isActive(pathname, sub.url)
                      ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 font-medium"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {sub.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NavUser({ expanded, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const name = user?.Profile?.Name || user?.Username || "User";
  const email = user?.Email || "";
  const avatar = user?.Profile?.ProfilePicture || "";
  const initial = name.charAt(0).toUpperCase();
  const role = user?.Role || "User";

  useEffect(() => {
    const handler = ({ target }) => {
      if (ref.current && !ref.current.contains(target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div ref={ref} className="relative px-3 py-2">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center w-full rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
          expanded ? "h-12 px-3 gap-3" : "h-10 justify-center"
        }`}
      >
        <div className="relative shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 text-sm font-semibold">
              {initial}
            </div>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
        </div>
        {expanded && (
          <>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{role}</p>
            </div>
            <svg className="w-4 h-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l4-4 4 4" /><path d="M8 15l4 4 4-4" /></svg>
          </>
        )}
      </button>
      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-1 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800 shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700/60">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
          <div className="p-1.5">
            <NavLink to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md">
              <span className="w-4 h-4 shrink-0">{getIcon("profile")}</span>
              Profile
            </NavLink>
            <NavLink to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md">
              <span className="w-4 h-4 shrink-0">{getIcon("settings")}</span>
              Settings
            </NavLink>
            <div className="h-px bg-gray-200 dark:bg-gray-700/60 my-1" />
            <button onClick={onLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md">
              <span className="w-4 h-4 shrink-0">{getIcon("logout")}</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AppSidebar({ sections, homePath, title, subtitle, sidebarOpen, setSidebarOpen }) {
  const { user, logoutUser } = useAuth();
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);
  const [expanded, setExpanded] = useState(
    (localStorage.getItem("sidebar-expanded") ?? "true") === "true"
  );

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", expanded);
    document.body.classList.toggle("sidebar-expanded", expanded);
  }, [expanded]);

  useEffect(() => {
    const handler = ({ target }) => {
      if (!sidebarRef.current || !triggerRef.current) return;
      if (!sidebarOpen || sidebarRef.current.contains(target) || triggerRef.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });

  useEffect(() => {
    const handler = ({ keyCode }) => {
      if (sidebarOpen && keyCode === 27) setSidebarOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  return (
    <div className="min-w-fit">
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />
      <aside
        ref={sidebarRef}
        className={`flex flex-col fixed lg:static z-40 h-[100dvh] shrink-0 overflow-hidden
          bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700/60
          w-64 lg:w-[68px] transition-all duration-300 ease-out
          ${expanded ? "lg:!w-64" : ""}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"}
          no-scrollbar
        `}
      >
        <div className="flex items-center h-14 px-4 shrink-0">
          {expanded ? (
            <NavLink to={homePath} className="flex items-center gap-3 min-w-0 flex-1">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                <img src="/logo.svg" alt="" className="w-5 h-5 brightness-0 invert" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight whitespace-nowrap">{title}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">{subtitle}</p>
              </div>
            </NavLink>
          ) : (
            <button onClick={() => setExpanded(true)} className="w-full flex items-center justify-center">
              <div className="w-9 h-9 rounded-lg bg-violet-500 flex items-center justify-center">
                <img src="/logo.svg" alt="" className="w-5 h-5 brightness-0 invert" />
              </div>
            </button>
          )}
          {expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <button
            ref={triggerRef}
            className="lg:hidden ml-2 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" /></svg>
          </button>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-800 mx-3" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          <NavMain items={sections} expanded={expanded} />
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-800 mx-3" />
        <NavUser expanded={expanded} user={user} onLogout={logoutUser} />
      </aside>
    </div>
  );
}

export default AppSidebar;
