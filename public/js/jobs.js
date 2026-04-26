const renderJobs = (jobs, containerId = "jobsGrid") => {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  if (!jobs.length) {
    grid.innerHTML = `<div class="col-span-full rounded-3xl border border-dashed border-black/10 px-6 py-12 text-center text-slate-500 dark:border-white/10">No jobs found for this filter yet.</div>`;
    return;
  }

  grid.innerHTML = jobs
    .map(
      (job) => `
      <article class="job-card animated-entry rounded-3xl p-6">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <p class="mb-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">${job.nicheCategory}</p>
            <h3 class="display-font text-xl font-bold">${job.title}</h3>
          </div>
          <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">${job.status.replace("_", " ")}</span>
        </div>
        <p class="mb-5 text-sm text-slate-600 dark:text-slate-300">${job.description.slice(0, 150)}${job.description.length > 150 ? "..." : ""}</p>
        <div class="mb-5 flex flex-wrap gap-2">
          ${(job.requiredSkills || []).map((skill) => `<span class="niche-chip rounded-full px-3 py-1 text-xs font-medium">${skill}</span>`).join("")}
        </div>
        <div class="mb-6 flex items-center justify-between text-sm">
          <span class="font-semibold">${formatCurrency(job.budget)}</span>
          <span class="text-slate-500">${job.client?.companyName || job.client?.name || "Client"}</span>
        </div>
        <div class="flex gap-3">
          <a href="/job-details.html?id=${job._id}" class="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white">View details</a>
          <button data-id="${job._id}" class="bookmark-btn rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold dark:border-white/10">Save</button>
        </div>
      </article>
    `
    )
    .join("");

  document.querySelectorAll(".bookmark-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const user = getCurrentUser();
      if (!user || user.role !== "freelancer") {
        showToast("Login as a freelancer to bookmark jobs", true);
        return;
      }

      try {
        const data = await apiRequest(`/jobs/${button.dataset.id}/bookmark`, { method: "POST" });
        showToast(data.message);
      } catch (error) {
        showToast(error.message, true);
      }
    });
  });
};

const initJobsPage = async () => {
  renderCategoryOptions("#categoryFilter", true);

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  const loadJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchInput?.value) params.set("search", searchInput.value);
      if (categoryFilter?.value) params.set("category", categoryFilter.value);

      const jobs = await apiRequest(`/jobs?${params.toString()}`);
      renderJobs(jobs);
    } catch (error) {
      showToast(error.message, true);
    }
  };

  searchInput?.addEventListener("input", loadJobs);
  categoryFilter?.addEventListener("change", loadJobs);
  await loadJobs();
};

const initJobDetailsPage = async () => {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");
  if (!jobId) return;

  try {
    const job = await apiRequest(`/jobs/${jobId}`);
    const mount = document.getElementById("jobDetailMount");
    const user = getCurrentUser();

    const roomId = `job-${job._id}`;
    const isClientOwner = user?.role === "client" && user.id === job.client?._id;

    mount.innerHTML = `
      <section class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article class="glass-panel rounded-[28px] p-8">
          <div class="mb-4 flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">${job.nicheCategory}</span>
            <span class="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">${job.status.replace("_", " ")}</span>
          </div>
          <h1 class="display-font mb-3 text-4xl font-bold">${job.title}</h1>
          <p class="mb-6 text-base leading-7 text-slate-600 dark:text-slate-300">${job.description}</p>
          <div class="mb-6 flex flex-wrap gap-2">
            ${(job.requiredSkills || []).map((skill) => `<span class="niche-chip rounded-full px-3 py-1 text-sm">${skill}</span>`).join("")}
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <div class="dashboard-card rounded-3xl p-4">
              <p class="text-sm text-slate-500">Budget</p>
              <p class="mt-2 text-xl font-bold">${formatCurrency(job.budget)}</p>
            </div>
            <div class="dashboard-card rounded-3xl p-4">
              <p class="text-sm text-slate-500">Client</p>
              <p class="mt-2 text-xl font-bold">${job.client?.companyName || job.client?.name}</p>
            </div>
            <div class="dashboard-card rounded-3xl p-4">
              <p class="text-sm text-slate-500">Posted</p>
              <p class="mt-2 text-xl font-bold">${formatDate(job.createdAt)}</p>
            </div>
          </div>
        </article>

        <aside class="space-y-6">
          <section class="glass-panel rounded-[28px] p-6">
            <h2 class="display-font mb-4 text-2xl font-bold">Apply to this role</h2>
            ${
              user?.role === "freelancer"
                ? `
                <form id="proposalForm" class="space-y-4">
                  <textarea name="proposalText" rows="5" required class="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Explain why you're a strong fit for this niche project."></textarea>
                  <input type="number" name="bidAmount" min="1" required class="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Bid amount (USD)" />
                  <button class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">Submit proposal</button>
                </form>
              `
                : `<p class="text-sm text-slate-500">${user ? "Only freelancers can apply to jobs." : "Sign in as a freelancer to apply."}</p>`
            }
          </section>

          <section class="glass-panel rounded-[28px] p-6">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="display-font text-2xl font-bold">Applicants</h2>
              <span class="text-sm text-slate-500">${job.proposals.length} total</span>
            </div>
            <div class="space-y-3">
              ${job.proposals.length ? job.proposals.map((proposal) => `
                <article class="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                  <div class="mb-2 flex items-center justify-between gap-4">
                    <h3 class="font-semibold">${proposal.freelancer?.name || "Freelancer"}</h3>
                    <span class="text-sm font-semibold">${formatCurrency(proposal.bidAmount)}</span>
                  </div>
                  <p class="mb-3 text-sm text-slate-600 dark:text-slate-300">${proposal.proposalText}</p>
                  <p class="text-xs text-slate-500">${proposal.status} • ${proposal.freelancer?.experienceLevel || "N/A"}</p>
                  ${isClientOwner && proposal.status === "accepted" ? `
                    <form class="rating-form mt-3 space-y-2" data-proposal-id="${proposal._id}">
                      <div class="grid grid-cols-[110px_1fr] gap-2">
                        <input name="score" min="1" max="5" type="number" class="rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900/50" placeholder="1-5" />
                        <input name="comment" class="rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900/50" placeholder="Completion feedback" />
                      </div>
                      <button class="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Complete & rate</button>
                    </form>
                  ` : ""}
                </article>
              `).join("") : `<p class="text-sm text-slate-500">No proposals yet.</p>`}
            </div>
          </section>

          <section class="glass-panel rounded-[28px] p-6">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="display-font text-2xl font-bold">Project chat</h2>
              <span class="text-sm text-slate-500">${roomId}</span>
            </div>
            <div id="chatMessages" class="chat-box space-y-3 rounded-2xl border border-black/10 p-4 dark:border-white/10"></div>
            <form id="chatForm" class="mt-4 flex gap-3">
              <input id="chatInput" class="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Send a quick project update" />
              <button class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Send</button>
            </form>
          </section>
        </aside>
      </section>
    `;

    document.getElementById("proposalForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);

      try {
        await apiRequest("/proposals", {
          method: "POST",
          body: JSON.stringify({
            jobId,
            proposalText: formData.get("proposalText"),
            bidAmount: Number(formData.get("bidAmount"))
          })
        });
        showToast("Proposal submitted");
        window.location.reload();
      } catch (error) {
        showToast(error.message, true);
      }
    });

    document.querySelectorAll(".rating-form").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        try {
          await apiRequest("/proposals/complete", {
            method: "POST",
            body: JSON.stringify({
              proposalId: form.dataset.proposalId,
              score: Number(formData.get("score")),
              comment: formData.get("comment")
            })
          });
          showToast("Job completed and rated");
          window.location.reload();
        } catch (error) {
          showToast(error.message, true);
        }
      });
    });

    if (window.io) {
      const socket = window.io();
      const chatMessages = document.getElementById("chatMessages");
      const chatForm = document.getElementById("chatForm");
      const chatInput = document.getElementById("chatInput");

      const pushMessage = ({ sender, message, timestamp }) => {
        const item = document.createElement("article");
        item.className = "rounded-2xl border border-black/10 p-3 text-sm dark:border-white/10";
        item.innerHTML = `
          <div class="mb-1 flex items-center justify-between gap-3">
            <strong>${sender}</strong>
            <span class="text-xs text-slate-500">${formatDate(timestamp)}</span>
          </div>
          <p>${message}</p>
        `;
        chatMessages.appendChild(item);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      };

      socket.emit("join-room", roomId);
      socket.on("receive-message", pushMessage);

      chatForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        socket.emit("send-message", {
          roomId,
          message,
          sender: user?.name || "Guest"
        });

        chatInput.value = "";
      });
    }
  } catch (error) {
    showToast(error.message, true);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "jobs") initJobsPage();
  if (document.body.dataset.page === "job-details") initJobDetailsPage();
});
