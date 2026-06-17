import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

function TrainerSidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? true : storedSidebarExpanded === "true");

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
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const linkClasses = (active) =>
    "block transition duration-150 truncate " + (active ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200");

  const iconClasses = (active) =>
    `shrink-0 fill-current ${active ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`;

  return (
    <div className="min-w-fit">
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-gray-50 dark:bg-gray-900 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'}`}
      >
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <NavLink end to="/trainer/dashboard" className="block">
              <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
                <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
              </svg>
            </NavLink>
            <button
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">{sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {sidebarExpanded ? (
                  <path d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z" />
                ) : (
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">•••</span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Trainer</span>
            </h3>
            <ul className="mt-3">
              <li className="mb-0.5">
                <NavLink end to="/trainer/dashboard" className={({ isActive }) => linkClasses(isActive)}>
                  <div className="flex items-center">
                    <svg className={iconClasses(pathname === '/trainer/dashboard')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                      <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                    </svg>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Dashboard</span>
                  </div>
                </NavLink>
              </li>

              <li className="mb-0.5">
                <NavLink to="/trainer/clients" className={({ isActive }) => linkClasses(isActive)}>
                  <div className="flex items-center">
                    <svg className={iconClasses(pathname.includes('/trainer/clients'))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M8 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1c-4 0-7 2-7 4.5V15h14v-1.5c0-2.5-3-4.5-7-4.5Z" />
                    </svg>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">My Clients</span>
                  </div>
                </NavLink>
              </li>

              <li className="mb-0.5">
                <NavLink to="/trainer/templates" className={({ isActive }) => linkClasses(isActive)}>
                  <div className="flex items-center">
                    <svg className={iconClasses(pathname.includes('/trainer/templates'))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2Zm2 0v12h8V2H4Z" />
                    </svg>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Templates</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">•••</span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Account</span>
            </h3>
            <ul className="mt-3">
              <li className="mb-0.5">
                <NavLink to="/trainer/profile" className={({ isActive }) => linkClasses(isActive)}>
                  <div className="flex items-center">
                    <svg className={iconClasses(pathname.includes('/trainer/profile'))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M8 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1c-4 0-7 2-7 4.5V15h14v-1.5c0-2.5-3-4.5-7-4.5Z" />
                    </svg>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Profile</span>
                  </div>
                </NavLink>
              </li>

              <li className="mb-0.5">
                <NavLink to="/trainer/settings" className={({ isActive }) => linkClasses(isActive)}>
                  <div className="flex items-center">
                    <svg className={iconClasses(pathname.includes('/trainer/settings'))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M13.6 9.352a4.97 4.97 0 0 0 0-2.704l1.44-1.124a.342.342 0 0 0 .082-.442l-1.36-2.358a.342.342 0 0 0-.424-.146l-1.696.684a4.97 4.97 0 0 0-2.344-1.356L8.968.362a.342.342 0 0 0-.336 0L6.942.906a4.97 4.97 0 0 0-2.344 1.356l-1.696-.684a.342.342 0 0 0-.424.146L1.118 4.082a.342.342 0 0 0 .082.442l1.44 1.124a4.97 4.97 0 0 0 0 2.704L1.2 9.476a.342.342 0 0 0-.082.442l1.36 2.358c.1.172.304.238.424.146l1.696-.684a4.97 4.97 0 0 0 2.344 1.356l.33 1.544a.342.342 0 0 0 .336 0l1.69-.544a4.97 4.97 0 0 0 2.344-1.356l1.696.684a.342.342 0 0 0 .424-.146l1.36-2.358a.342.342 0 0 0-.082-.442l-1.44-1.124ZM8 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
                    </svg>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Settings</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-auto">
          <div className="pt-3 pb-4 border-t border-gray-200 dark:border-gray-700/60">
            <NavLink to="/dashboard" className={({ isActive }) => linkClasses(isActive)}>
              <div className="flex items-center">
                <svg className={iconClasses(false)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                </svg>
                <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">User Panel</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainerSidebar;
