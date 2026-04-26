const buildSidebar = (role) => `
  <nav class="sidebar-card rounded-[28px] p-4">
    <a href="${role === "client" ? "/client-dashboard.html" : "/freelancer-dashboard.html"}" class="sidebar-link mb-2 block rounded-2xl px-4 py-3 font-semibold active">Overview</a>
    <a href="/jobs.html" class="sidebar-link mb-2 block rounded-2xl px-4 py-3 font-semibold">Jobs</a>
    <a href="/profile.html" class="sidebar-link mb-2 block rounded-2xl px-4 py-3 font-semibold">Profile</a>
    <a href="/job-details.html" class="sidebar-link block rounded-2xl px-4 py-3 font-semibold">Hiring</a>
  </nav>
`;

// Freelancer dashboard focuses on proposals, accepted work, and recommendations.
const renderFreelancerDashboard = (data, user) => {
  document.getElementById("sidebarMount").innerHTML = buildSidebar("freelancer");
  document.getElementById("dashboardContent").innerHTML = `
    <section class="dashboard-grid grid gap-6">
      <div class="space-y-6">
        <section class="glass-panel rounded-[28px] p-7">
          <p class="mb-3 text-sm uppercase tracking-wide text-slate-500">Freelancer command center</p>
          <h1 class="display-font mb-4 text-4xl font-bold">Welcome back, ${user.name.split(" ")[0]}</h1>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="dashboard-card rounded-3xl p-5">
              <p class="text-sm text-slate-500">Applications</p>
              <p class="metric-number mt-3 font-bold">${data.proposals.length}</p>
            </div>
            <div class="dashboard-card rounded-3xl p-5">
              <p class="text-sm text-slate-500">Accepted jobs</p>
              <p class="metric-number mt-3 font-bold">${data.acceptedJobs.length}</p>
            </div>
            <div class="dashboard-card rounded-3xl p-5">
              <p class="text-sm text-slate-500">Recommendations</p>
              <p class="metric-number mt-3 font-bold">${data.recommendations.length}</p>
            </div>
          </div>
        </section>

        <section class="glass-panel rounded-[28px] p-7">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="display-font text-2xl font-bold">Applied jobs</h2>
            <a href="/jobs.html" class="text-sm font-semibold text-emerald-700">Explore more</a>
          </div>
          <div class="space-y-3">
            ${data.proposals.length ? data.proposals.map((proposal) => `
              <article class="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <h3 class="font-semibold">${proposal.job?.title || "Job removed"}</h3>
                  <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">${proposal.status}</span>
                </div>
                <p class="text-sm text-slate-500">${proposal.job?.nicheCategory || "Unknown niche"} • ${formatCurrency(proposal.bidAmount)}</p>
              </article>
            `).join("") : `<p class="text-sm text-slate-500">You have not applied to any jobs yet.</p>`}
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section class="glass-panel rounded-[28px] p-7">
          <h2 class="display-font mb-5 text-2xl font-bold">Accepted jobs</h2>
          <div class="space-y-3">
            ${data.acceptedJobs.length ? data.acceptedJobs.map((job) => `
              <article class="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <h3 class="font-semibold">${job.title}</h3>
                <p class="mt-2 text-sm text-slate-500">${job.client?.companyName || job.client?.name} • ${formatCurrency(job.budget)}</p>
              </article>
            `).join("") : `<p class="text-sm text-slate-500">No accepted jobs yet.</p>`}
          </div>
        </section>

        <section class="glass-panel rounded-[28px] p-7">
          <h2 class="display-font mb-5 text-2xl font-bold">Recommended for your skills</h2>
          <div class="space-y-3">
            ${data.recommendations.length ? data.recommendations.map((job) => `
              <a href="/job-details.html?id=${job._id}" class="block rounded-2xl border border-black/10 p-4 transition hover:-translate-y-1 dark:border-white/10">
                <h3 class="font-semibold">${job.title}</h3>
                <p class="mt-2 text-sm text-slate-500">${job.nicheCategory} • ${formatCurrency(job.budget)}</p>
              </a>
            `).join("") : `<p class="text-sm text-slate-500">Add more skills to your profile to improve recommendations.</p>`}
          </div>
        </section>
      </div>
    </section>
  `;
};

// Client dashboard combines hiring metrics, job posting, and proposal actions.
const renderClientDashboard = (data, user) => {
  document.getElementById("sidebarMount").innerHTML = buildSidebar("client");
  document.getElementById("dashboardContent").innerHTML = `
    <section class="dashboard-grid grid gap-6">
      <div class="space-y-6">
        <section class="glass-panel rounded-[28px] p-7">
          <p class="mb-3 text-sm uppercase tracking-wide text-slate-500">Client hiring cockpit</p>
          <h1 class="display-font mb-4 text-4xl font-bold">${user.companyName || user.name}</h1>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="dashboard-card rounded-3xl p-5">
              <p class="text-sm text-slate-500">Posted jobs</p>
              <p class="metric-number mt-3 font-bold">${data.jobs.length}</p>
            </div>
            <div class="dashboard-card rounded-3xl p-5">
              <p class="text-sm text-slate-500">Applicants</p>
              <p class="metric-number mt-3 font-bold">${data.applicants.length}</p>
            </div>
            <div class="dashboard-card rounded-3xl p-5">
              <p class="text-sm text-slate-500">Active roles</p>
              <p class="metric-number mt-3 font-bold">${data.jobs.filter((job) => job.status !== "completed").length}</p>
            </div>
          </div>
        </section>

        <section class="glass-panel rounded-[28px] p-7">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="display-font text-2xl font-bold">Post a new niche job</h2>
          </div>
          <form id="postJobForm" class="grid gap-4 md:grid-cols-2">
            <input name="title" required class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Job title" />
            <input name="budget" type="number" min="1" required class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Budget in USD" />
            <select name="nicheCategory" id="nicheCategory" required class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50 md:col-span-2"></select>
            <input name="requiredSkills" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50 md:col-span-2" placeholder="Required skills, comma separated" />
            <textarea name="description" rows="5" required class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50 md:col-span-2" placeholder="Describe the project, outcomes, timeline, and ideal freelancer profile."></textarea>
            <button class="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2">Publish job</button>
          </form>
        </section>
      </div>

      <div class="space-y-6">
        <section class="glass-panel rounded-[28px] p-7">
          <h2 class="display-font mb-5 text-2xl font-bold">Recent jobs</h2>
          <div class="space-y-3">
            ${data.jobs.length ? data.jobs.map((job) => `
              <a href="/job-details.html?id=${job._id}" class="block rounded-2xl border border-black/10 p-4 transition hover:-translate-y-1 dark:border-white/10">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="font-semibold">${job.title}</h3>
                  <span class="text-xs font-semibold uppercase text-slate-500">${job.status}</span>
                </div>
                <p class="mt-2 text-sm text-slate-500">${job.nicheCategory} • ${formatCurrency(job.budget)}</p>
              </a>
            `).join("") : `<p class="text-sm text-slate-500">No jobs posted yet.</p>`}
          </div>
        </section>

        <section class="glass-panel rounded-[28px] p-7">
          <h2 class="display-font mb-5 text-2xl font-bold">Latest applicants</h2>
          <div class="space-y-3">
            ${data.applicants.length ? data.applicants.map((proposal) => `
              <article class="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <h3 class="font-semibold">${proposal.freelancer?.name || "Freelancer"}</h3>
                  <span class="text-sm font-semibold">${formatCurrency(proposal.bidAmount)}</span>
                </div>
                <p class="text-sm text-slate-500">${proposal.job?.title || "Unknown job"} • ${proposal.status}</p>
                <div class="mt-3 flex gap-2">
                  <button data-id="${proposal._id}" data-status="accepted" class="proposal-action rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Accept</button>
                  <button data-id="${proposal._id}" data-status="rejected" class="proposal-action rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold dark:border-white/10">Reject</button>
                </div>
              </article>
            `).join("") : `<p class="text-sm text-slate-500">Applicants will appear here when freelancers apply.</p>`}
          </div>
        </section>
      </div>
    </section>
  `;

  renderCategoryOptions("#nicheCategory");

  document.getElementById("postJobForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      await apiRequest("/jobs", {
        method: "POST",
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          budget: Number(formData.get("budget")),
          nicheCategory: formData.get("nicheCategory"),
          requiredSkills: String(formData.get("requiredSkills"))
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        })
      });
      showToast("Job published");
      window.location.reload();
    } catch (error) {
      showToast(error.message, true);
    }
  });

  document.querySelectorAll(".proposal-action").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await apiRequest(`/proposals/${button.dataset.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: button.dataset.status })
        });
        showToast(`Proposal ${button.dataset.status}`);
        window.location.reload();
      } catch (error) {
        showToast(error.message, true);
      }
    });
  });
};

const initDashboard = async () => {
  const page = document.body.dataset.page;
  const expectedRole = page === "client-dashboard" ? "client" : "freelancer";
  const user = requireAuth([expectedRole]);
  if (!user) return;

  try {
    const data = await apiRequest("/users/dashboard");
    if (expectedRole === "client") {
      renderClientDashboard(data, user);
    } else {
      renderFreelancerDashboard(data, user);
    }
  } catch (error) {
    showToast(error.message, true);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (["freelancer-dashboard", "client-dashboard"].includes(document.body.dataset.page)) {
    initDashboard();
  }
});
