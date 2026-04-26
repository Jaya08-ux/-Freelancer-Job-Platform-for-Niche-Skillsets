const nicheCategories = [
  "AI/ML",
  "Blockchain",
  "Cybersecurity",
  "UI/UX Micro Design",
  "DevOps",
  "Technical Writing"
];

// Shared helpers used across multiple pages.
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount || 0);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

const showToast = (message, isError = false) => {
  const toast = document.getElementById("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.className = `fixed bottom-5 right-5 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg transition ${
    isError ? "bg-red-500 text-white" : "bg-slate-900 text-white"
  }`;
  toast.classList.remove("hidden");

  setTimeout(() => toast.classList.add("hidden"), 2600);
};

const applyTheme = () => {
  const theme = localStorage.getItem("skillniche_theme") || "light";
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const toggleTheme = () => {
  const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("skillniche_theme", nextTheme);
  applyTheme();
};

const injectNavbar = () => {
  const mount = document.getElementById("navbar");
  if (!mount) return;

  const user = getCurrentUser();

  mount.innerHTML = `
    <div class="page-shell mx-auto flex items-center justify-between py-5">
      <a href="/index.html" class="display-font text-2xl font-bold tracking-tight">SkillNiche</a>
      <div class="flex items-center gap-3">
        <a href="/jobs.html" class="hidden rounded-full px-4 py-2 text-sm font-semibold md:inline-block">Browse Jobs</a>
        ${user ? `<a href="${user.role === "client" ? "/client-dashboard.html" : "/freelancer-dashboard.html"}" class="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:inline-block">Dashboard</a>` : `<a href="/login.html" class="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:inline-block">Sign In</a>`}
        <button id="themeToggle" class="rounded-full border border-black/10 px-3 py-2 text-sm font-semibold dark:border-white/10">Theme</button>
        ${user ? `<button id="logoutBtn" class="rounded-full border border-black/10 px-3 py-2 text-sm font-semibold dark:border-white/10">Logout</button>` : ""}
      </div>
    </div>
  `;

  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    clearSession();
    window.location.href = "/login.html";
  });
};

// Redirect visitors away from protected pages when the role does not match.
const requireAuth = (allowedRoles = []) => {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "/login.html";
    return null;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    window.location.href = user.role === "client" ? "/client-dashboard.html" : "/freelancer-dashboard.html";
    return null;
  }

  return user;
};

const renderCategoryOptions = (selector, includeAll = false) => {
  const select = document.querySelector(selector);
  if (!select) return;

  select.innerHTML = `${includeAll ? '<option value="">All Niches</option>' : '<option value="">Select niche</option>'}${
    nicheCategories.map((category) => `<option value="${category}">${category}</option>`).join("")
  }`;
};

applyTheme();
document.addEventListener("DOMContentLoaded", injectNavbar);
