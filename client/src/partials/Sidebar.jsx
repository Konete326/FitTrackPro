import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const fitnessLinks = [
  { to: "/dashboard", label: "Dashboard", exact: true },
  { to: "/workouts", label: "Workouts" },
  { to: "/nutrition", label: "Nutrition" },
  { to: "/water", label: "Water" },
  { to: "/progress", label: "Progress" },
  { to: "/sleep", label: "Sleep" },
  { to: "/goals", label: "Goals" },
];

const connectLinks = [
  { to: "/browse-trainers", label: "Browse Trainers" },
  { to: "/achievements", label: "Achievements" },
];

const accountLinks = [
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

function SidebarIcon({ pathname, to, exact, children }) {
  const isActive = exact ? pathname === to : pathname.startsWith(to);
  return (
    <span
      className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-200 ${
        isActive
          ? "bg-violet-500/10 dark:bg-violet-500/20 text-violet-500"
          : "text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-700/40"
      }`}
    >
      {children}
    </span>
  );
}

function Sidebar({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const { user } = useAuth();
  const userName = user?.Profile?.Name || user?.Username || 'User';
  const userAvatar = user?.Profile?.ProfilePicture || '';
  const userInitial = userName.charAt(0).toUpperCase();

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? true : storedSidebarExpanded === "true"
  );

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    document.querySelector("body").classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  const linkClasses = (active) =>
    `group flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-violet-500/[0.08] dark:bg-violet-500/[0.15] text-violet-600 dark:text-violet-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/30 hover:text-gray-900 dark:hover:text-gray-200"
    }`;

  const labelClasses =
    "truncate lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200";

  return (
    <div className="min-w-fit">
      <div
        className={`fixed inset-0 bg-gray-900/30 backdrop-blur-xs z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-900 p-3 transition-all duration-200 ease-in-out no-scrollbar ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } ${
          variant === "v2"
            ? "border-r border-gray-200 dark:border-gray-700/60"
            : "rounded-r-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-950/30 border-r border-gray-100 dark:border-gray-800"
        }`}
      >
        <div className="mb-4 px-1">
          <div className="flex items-center justify-between">
            <button
              ref={trigger}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
              </svg>
            </button>

            <NavLink end to="/dashboard" className="flex items-center gap-3 py-1.5">
              <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center">
                <img src="/logo.svg" alt="FitTrack Pro" className="w-9 h-9" />
              </div>
              <div className="lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  FitTrack Pro
                </p>
                <p className="text-[11px] font-medium text-violet-500 dark:text-violet-400">
                  Fitness Tracker
                </p>
              </div>
            </NavLink>

            <button
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">
                {sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              </span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                {sidebarExpanded ? (
                  <path d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z" />
                ) : (
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700/60 mx-2 mb-4" />

        <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar px-1">
          <div>
            <h3 className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold px-3 mb-2 lg:text-center lg:sidebar-expanded:text-left lg:sidebar-expanded:px-3 2xl:text-left 2xl:px-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">•••</span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Fitness</span>
            </h3>
            <ul className="space-y-0.5">
              {fitnessLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    end={link.exact}
                    to={link.to}
                    className={({ isActive }) => linkClasses(isActive)}
                  >
                    <SidebarIcon pathname={pathname} to={link.to} exact={link.exact}>
                      {link.to === "/dashboard" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" />
                        </svg>
                      )}
                      {link.to === "/workouts" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6 2L6 22" /><path d="M18 2L18 22" /><path d="M2 6h4" /><path d="M2 18h4" /><path d="M18 6h4" /><path d="M18 18h4" />
                        </svg>
                      )}
                      {link.to === "/nutrition" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" /><path d="M12 6v6l4 2" />
                        </svg>
                      )}
                      {link.to === "/water" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l5.5 7.5a6.5 6.5 0 1 1-11 0L12 2Z" />
                        </svg>
                      )}
                      {link.to === "/progress" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 5-5" />
                        </svg>
                      )}
                      {link.to === "/sleep" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                        </svg>
                      )}
                      {link.to === "/goals" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                        </svg>
                      )}
                    </SidebarIcon>
                    <span className={labelClasses}>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold px-3 mb-2 lg:text-center lg:sidebar-expanded:text-left lg:sidebar-expanded:px-3 2xl:text-left 2xl:px-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">•••</span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Connect</span>
            </h3>
            <ul className="space-y-0.5">
              {connectLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => linkClasses(isActive)}
                  >
                    <SidebarIcon pathname={pathname} to={link.to}>
                      {link.to === "/browse-trainers" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                      {link.to === "/achievements" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      )}
                    </SidebarIcon>
                    <span className={labelClasses}>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold px-3 mb-2 lg:text-center lg:sidebar-expanded:text-left lg:sidebar-expanded:px-3 2xl:text-left 2xl:px-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">•••</span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Account</span>
            </h3>
            <ul className="space-y-0.5">
              {accountLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => linkClasses(isActive)}
                  >
                    <SidebarIcon pathname={pathname} to={link.to}>
                      {link.to === "/profile" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                      {link.to === "/settings" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </SidebarIcon>
                    <span className={labelClasses}>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto pt-4 px-1">
          <div className="h-px bg-gray-200 dark:bg-gray-700/60 mx-2 mb-3" />
          <div className="space-y-1 mb-3">
            <NavLink
              to="/trainer/dashboard"
              className={({ isActive }) =>
                `group flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive || pathname.startsWith('/trainer')
                    ? "bg-violet-500/[0.08] dark:bg-violet-500/[0.15] text-violet-600 dark:text-violet-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/30 hover:text-gray-900 dark:hover:text-gray-200"
                }`
              }
            >
              <SidebarIcon pathname={pathname} to="/trainer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" />
                </svg>
              </SidebarIcon>
              <span className={labelClasses}>Trainer Panel</span>
            </NavLink>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `group flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive || pathname.startsWith('/admin')
                    ? "bg-violet-500/[0.08] dark:bg-violet-500/[0.15] text-violet-600 dark:text-violet-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/30 hover:text-gray-900 dark:hover:text-gray-200"
                }`
              }
            >
              <SidebarIcon pathname={pathname} to="/admin">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </SidebarIcon>
              <span className={labelClasses}>Admin Panel</span>
            </NavLink>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700/60 mx-2 mb-3" />
          <div className="flex items-center gap-3 px-2 py-2">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="shrink-0 w-8 h-8 rounded-full object-cover shadow-sm" />
            ) : (
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {userInitial}
              </div>
            )}
            <div className="lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight truncate">
                {userName}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                {user?.Role || 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
