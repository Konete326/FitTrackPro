import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/* ─── SVG Icon Set (stroke-based, consistent 14x14) ── */
const S = { w: 14, h: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  dashboard: <svg {...S}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /></svg>,
  workouts: <svg {...S}><path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6 2L6 22" /><path d="M18 2L18 22" /><path d="M2 6h4" /><path d="M2 18h4" /><path d="M18 6h4" /><path d="M18 18h4" /></svg>,
  nutrition: <svg {...S}><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" /><path d="M12 6v6l4 2" /></svg>,
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
};

const getIcon = (to) => {
  const k = [
    ["/dashboard", "dashboard"], ["/workouts", "workouts"], ["/nutrition", "nutrition"],
    ["/water", "water"], ["/progress", "progress"], ["/sleep", "sleep"], ["/goals", "goals"],
    ["/achievements", "achievements"], ["/browse-trainers", "trainers"],
    ["/trainer/clients", "users"], ["/trainer/templates", "template"], ["/trainer/dashboard", "dashboard"],
    ["/trainer/profile", "profile"], ["/trainer/settings", "settings"],
    ["/admin/trainer-requests", "requests"], ["/admin/assigned-trainers", "assignments"],
    ["/admin/feedbacks", "feedbacks"], ["/admin/users", "users"], ["/admin/trainers", "trainers"],
    ["/admin/dashboard", "dashboard"], ["/admin/profile", "profile"], ["/admin/settings", "settings"],
    ["/profile", "profile"], ["/settings", "settings"],
    ["/trainer", "trainers"], ["/admin", "layers"],
  ];
  const match = k.find(([p]) => to === p || (to !== "/dashboard" && to.startsWith(p)));
  return ICONS[match?.[1]] || ICONS.dashboard;
};

/* ─── Main AppSidebar Component ─── */
function AppSidebar({
  sections,
  panelSwitcherLinks = [],
  homePath,
  title,
  subtitle,
  sidebarOpen,
  setSidebarOpen,
}) {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useAuth();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const userName = user?.Profile?.Name || user?.Username || "User";
  const userAvatar = user?.Profile?.ProfilePicture || "";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = user?.Role || "User";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    (localStorage.getItem("sidebar-expanded") ?? "true") === "true"
  );
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [highlightTop, setHighlightTop] = useState(0);
  const navRefs = useRef([]);

  /* Track hover position for sliding highlight */
  const handleHover = useCallback((index) => {
    setHoveredIndex(index);
    if (index !== null && navRefs.current[index]) {
      setHighlightTop(navRefs.current[index].offsetTop);
    }
  }, []);

  /* Mobile close handlers */
  useEffect(() => {
    const handler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });

  useEffect(() => {
    const handler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  /* Link style helpers */
  const linkStyle = (active) =>
    `relative flex items-center h-10 mx-2 rounded-lg text-[13px] font-medium transition-all duration-300 ease-out ${
      active
        ? "text-white bg-violet-500/10"
        : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
    } ${sidebarExpanded ? "pl-3 pr-3 gap-3" : "justify-center px-0"}`;

  const labelCls = `truncate transition-all duration-300 ease-out ${
    sidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
  }`;

  const allLinks = sections.flatMap((s) => s.links);

  return (
    <div className="min-w-fit">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <div
        ref={sidebar}
        className={`flex flex-col fixed lg:static z-40 h-[100dvh] shrink-0 overflow-hidden
          transition-all duration-300 ease-out
          bg-[#0f1117] border-r border-white/5
          w-64 lg:w-[68px]
          ${sidebarExpanded ? "lg:!w-64" : ""}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"}
          lg:ml-3 lg:my-3 lg:h-[calc(100dvh-24px)] lg:border lg:border-white/[0.06]
          no-scrollbar
        `}
      >
        {/* ═══ Header ═══ */}
        <div className="relative shrink-0 flex items-center h-16 px-3">
          {/* Mobile close */}
          <button
            ref={trigger}
            className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>

          {/* Logo + title OR toggle button when collapsed */}
          {sidebarExpanded ? (
            <NavLink to={homePath} className="flex items-center gap-3 min-w-0 px-1">
              <img src="/logo.svg" alt="FitTrack Pro" className="shrink-0 w-8 h-8" />
              <div className="transition-all duration-300 ease-out overflow-hidden">
                <p className="text-sm font-semibold text-white leading-tight whitespace-nowrap">{title}</p>
                <p className="text-[10px] font-medium text-violet-400 whitespace-nowrap">{subtitle}</p>
              </div>
            </NavLink>
          ) : (
            <button
              onClick={() => setSidebarExpanded(true)}
              className="w-full flex items-center justify-center group"
              title="Open sidebar"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-all duration-300">
                <img src="/logo.svg" alt="FitTrack Pro" className="w-5 h-5" />
              </div>
            </button>
          )}

          {/* Desktop collapse toggle - only when expanded */}
          {sidebarExpanded && (
            <button
              className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setSidebarExpanded(false)}
              title="Collapse sidebar"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 19l-7-7 7-7" />
                <path d="M18 19l-7-7 7-7" opacity="0.4" />
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 h-px bg-white/[0.06]" />

        {/* ═══ Navigation ═══ */}
        <div className="sidebar-nav flex-1 overflow-y-auto overflow-x-hidden py-3 relative scroll-smooth">
          {/* Sliding highlight */}
          {hoveredIndex !== null && sidebarExpanded && (
            <div
              className="absolute left-2 right-2 h-10 bg-white/[0.03] rounded-lg pointer-events-none transition-all duration-300 ease-out z-0"
              style={{ top: highlightTop }}
            />
          )}

          {sections.map((section, sIdx) => (
            <div key={section.name} className={sIdx > 0 ? "mt-4" : ""}>
              {/* Section label */}
              {sidebarExpanded && (
                <div className="px-4 mb-2">
                  <h3 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-500">
                    {section.name}
                  </h3>
                </div>
              )}

              {/* Section divider when collapsed */}
              {!sidebarExpanded && sIdx > 0 && (
                <div className="mx-4 my-3 h-px bg-white/[0.06]" />
              )}

              {/* Nav items */}
              {section.links.map((link) => {
                const gIdx = allLinks.indexOf(link);
                return (
                  <NavLink
                    key={link.to}
                    end={link.exact}
                    to={link.to}
                    ref={(el) => { navRefs.current[gIdx] = el; }}
                    className={({ isActive }) => linkStyle(isActive)}
                    onMouseEnter={() => handleHover(gIdx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    title={!sidebarExpanded ? link.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Icon container */}
                        <span className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 ${
                          isActive ? "text-violet-400" : "text-gray-500"
                        }`}>
                          {getIcon(link.to)}
                        </span>
                        {/* Label */}
                        <span className={labelCls}>{link.label}</span>
                        {/* Active dot when collapsed */}
                        {isActive && !sidebarExpanded && (
                          <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-violet-400 rounded-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* ═══ Footer ═══ */}
        <div className="shrink-0">
          {/* Panel switcher */}
          {panelSwitcherLinks.length > 0 && (
            <>
              <div className="mx-3 h-px bg-white/[0.06]" />
              <div className="py-2">
                {panelSwitcherLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="relative flex items-center h-10 mx-2 rounded-lg text-[13px] font-medium transition-all duration-300 ease-out text-gray-400 hover:text-gray-100 hover:bg-white/5"
                    title={!sidebarExpanded ? link.label : undefined}
                  >
                    {({ isActive: a }) => (
                      <>
                        <span className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 ${
                          a || pathname.startsWith(link.prefix)
                            ? "text-violet-400"
                            : "text-gray-500"
                        }`}>
                          {getIcon(link.to)}
                        </span>
                        <span className={labelCls}>{link.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </>
          )}

          {/* Divider */}
          <div className="mx-3 h-px bg-white/[0.06]" />

          {/* User info */}
          <div className={`flex items-center transition-all duration-300 ease-out ${
            sidebarExpanded ? "h-14 px-3 gap-3" : "h-12 justify-center"
          }`}>
            <div className="relative shrink-0">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="rounded-full object-cover ring-2 ring-violet-500/20 transition-all duration-300 w-8 h-8"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-violet-500/20">
                  {userInitial}
                </div>
              )}
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0f1117] rounded-full" />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-out ${
              sidebarExpanded ? "opacity-100" : "opacity-0 w-0"
            }`}>
              <p className="text-sm font-medium text-gray-200 leading-tight truncate">{userName}</p>
              <p className="text-[10px] text-gray-500 truncate">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSidebar;
