export const templatePages = [
  {
    id: "landing",
    title: "Landing Page",
    path: "/landing",
    templateFile: "routepulse_landing_page.html",
    group: "Public",
  },
  {
    id: "login",
    title: "Login",
    path: "/login",
    templateFile: "routepulse_login_1.html",
    group: "Public",
  },
  {
    id: "login-alt",
    title: "Login Alt",
    path: "/login-alt",
    templateFile: "routepulse_login_2.html",
    group: "Public",
  },
  {
    id: "register",
    title: "Register",
    path: "/register",
    templateFile: "routepulse_register_1.html",
    group: "Public",
  },
  {
    id: "register-alt",
    title: "Register Alt",
    path: "/register-alt",
    templateFile: "routepulse_register_2.html",
    group: "Public",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    templateFile: "routepulse_dashboard.html",
    group: "Operations",
  },
  {
    id: "dashboard-redesign",
    title: "Dashboard Redesign",
    path: "/dashboard-redesign",
    templateFile: "routepulse_dashboard_redesign.html",
    group: "Operations",
  },
  {
    id: "shipments",
    title: "Shipment Tracking",
    path: "/shipments",
    templateFile: "shipment_tracking.html",
    group: "Operations",
  },
  {
    id: "fleet",
    title: "Fleet Monitor",
    path: "/fleet",
    templateFile: "fleet_monitor.html",
    group: "Operations",
  },
  {
    id: "analytics",
    title: "Analytics",
    path: "/analytics",
    templateFile: "routepulse_analytics.html",
    group: "Operations",
  },
  {
    id: "reporting",
    title: "Reporting",
    path: "/reporting",
    templateFile: "reporting.html",
    group: "Operations",
  },
  {
    id: "settings",
    title: "Settings",
    path: "/settings",
    templateFile: "settings.html",
    group: "Operations",
  },
  {
    id: "loading-state",
    title: "Loading State",
    path: "/state/loading",
    templateFile: "loading_state.html",
    group: "States",
  },
  {
    id: "empty-state",
    title: "Empty State",
    path: "/state/empty",
    templateFile: "empty_state.html",
    group: "States",
  },
  {
    id: "empty-dashboard-state",
    title: "Empty Dashboard",
    path: "/state/empty-dashboard",
    templateFile: "empty_state_dashboard.html",
    group: "States",
  },
  {
    id: "error-state",
    title: "Error State",
    path: "/state/error",
    templateFile: "error_state.html",
    group: "States",
  },
  {
    id: "error-dashboard-state",
    title: "Error Dashboard",
    path: "/state/error-dashboard",
    templateFile: "error_state_dashboard.html",
    group: "States",
  },
];

export const groupedTemplatePages = templatePages.reduce((acc, page) => {
  if (!acc[page.group]) {
    acc[page.group] = [];
  }
  acc[page.group].push(page);
  return acc;
}, {});
