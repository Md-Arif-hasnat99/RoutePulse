const routeRules = [
  { keyword: "login", route: "/login" },
  { keyword: "register", route: "/register" },
  { keyword: "authenticate", route: "/dashboard" },
  { keyword: "get started", route: "/register" },
  { keyword: "start free trial", route: "/register" },
  { keyword: "dashboard", route: "/dashboard" },
  { keyword: "overview", route: "/dashboard" },
  { keyword: "shipments", route: "/shipments" },
  { keyword: "active shipments", route: "/shipments" },
  { keyword: "new shipment", route: "/shipments" },
  { keyword: "add shipment", route: "/shipments" },
  { keyword: "fleet monitor", route: "/fleet" },
  { keyword: "fleet", route: "/fleet" },
  { keyword: "analytics", route: "/analytics" },
  { keyword: "route analytics", route: "/analytics" },
  { keyword: "reporting", route: "/reporting" },
  { keyword: "reports", route: "/reporting" },
  { keyword: "settings", route: "/settings" },
  { keyword: "risk center", route: "/dashboard-redesign" },
  { keyword: "risk analysis", route: "/dashboard-redesign" },
  { keyword: "risk monitor", route: "/dashboard-redesign" },
  { keyword: "retry connection", route: "/dashboard" },
  { keyword: "retry", route: "/dashboard" },
  { keyword: "support", route: "/settings" },
  { keyword: "documentation", route: "/settings" },
  { keyword: "sign out", route: "/login" },
  { keyword: "history", route: "/state/loading" },
];

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function findRoute(text) {
  const normalized = normalizeText(text);
  if (!normalized) {
    return null;
  }

  const matchedRule = routeRules.find((rule) => normalized.includes(rule.keyword));
  return matchedRule ? matchedRule.route : null;
}

function setAnchorRoutes(documentRoot) {
  const anchors = documentRoot.querySelectorAll('a[href="#"]');

  anchors.forEach((anchor) => {
    const route = findRoute(anchor.textContent || "");
    if (!route) {
      return;
    }

    anchor.setAttribute("href", route);
    anchor.setAttribute("target", "_parent");
  });
}

function setButtonRoutes(documentRoot) {
  const buttons = documentRoot.querySelectorAll("button");

  buttons.forEach((button) => {
    const route = findRoute(button.textContent || "");
    if (!route) {
      return;
    }

    button.setAttribute("data-route", route);

    if (!button.hasAttribute("type")) {
      button.setAttribute("type", "button");
    }
  });
}

function setFormTargets(documentRoot) {
  const forms = documentRoot.querySelectorAll("form");

  forms.forEach((form) => {
    form.setAttribute("method", "get");
    form.setAttribute("action", "/dashboard");
    form.setAttribute("target", "_parent");
  });
}

function addParentNavigationBridge(documentRoot) {
  const bridgeScript = documentRoot.createElement("script");
  bridgeScript.textContent = `
    document.addEventListener('click', function (event) {
      const button = event.target.closest('button[data-route]');
      if (!button) {
        return;
      }
      event.preventDefault();
      const nextRoute = button.getAttribute('data-route');
      if (nextRoute) {
        window.parent.location.assign(nextRoute);
      }
    });
  `;

  documentRoot.body.appendChild(bridgeScript);
}

export function wireTemplateHtml(rawHtml) {
  const parser = new DOMParser();
  const documentRoot = parser.parseFromString(rawHtml, "text/html");

  if (!documentRoot.head.querySelector("base")) {
    const baseElement = documentRoot.createElement("base");
    baseElement.setAttribute("target", "_parent");
    documentRoot.head.prepend(baseElement);
  }

  setAnchorRoutes(documentRoot);
  setButtonRoutes(documentRoot);
  setFormTargets(documentRoot);
  addParentNavigationBridge(documentRoot);

  return `<!DOCTYPE html>\n${documentRoot.documentElement.outerHTML}`;
}
