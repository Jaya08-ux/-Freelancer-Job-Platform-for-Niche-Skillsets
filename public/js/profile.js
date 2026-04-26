const renderRatingStars = (score) => "★".repeat(score) + "☆".repeat(5 - score);

const initProfilePage = async () => {
  const user = requireAuth(["freelancer", "client"]);
  if (!user) return;

  try {
    const profile = await apiRequest("/users/me");
    const mount = document.getElementById("profileMount");

    mount.innerHTML = `
      <section class="dashboard-grid grid gap-6">
        <div class="space-y-6">
          <article class="glass-panel rounded-[28px] p-8">
            <div class="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <img src="${profile.profilePicture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"}" alt="${profile.name}" class="h-24 w-24 rounded-3xl object-cover" />
              <div>
                <h1 class="display-font text-4xl font-bold">${profile.role === "client" ? profile.companyName || profile.name : profile.name}</h1>
                <p class="mt-2 text-slate-500">${profile.role === "client" ? "Client account" : `${profile.experienceLevel} freelancer • ${formatCurrency(profile.hourlyRate)}/hr`}</p>
              </div>
            </div>
            <p class="mb-5 text-base leading-7 text-slate-600 dark:text-slate-300">${profile.bio || profile.companyDescription || "Add a strong summary to stand out in your niche."}</p>
            <div class="flex flex-wrap gap-2">
              ${(profile.skills || []).map((skill) => `<span class="niche-chip rounded-full px-3 py-1 text-sm">${skill}</span>`).join("") || '<span class="text-sm text-slate-500">No skills added yet.</span>'}
            </div>
          </article>

          <article class="glass-panel rounded-[28px] p-8">
            <h2 class="display-font mb-5 text-2xl font-bold">Edit profile</h2>
            <form id="profileForm" class="grid gap-4 md:grid-cols-2">
              <input name="name" value="${profile.name || ""}" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Full name" />
              ${profile.role === "client"
                ? `<input name="companyName" value="${profile.companyName || ""}" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Company name" />`
                : `<input name="hourlyRate" type="number" value="${profile.hourlyRate || 0}" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Hourly rate" />`
              }
              ${profile.role === "freelancer"
                ? `<select name="experienceLevel" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50">
                    ${["Beginner", "Intermediate", "Expert"].map((level) => `<option value="${level}" ${profile.experienceLevel === level ? "selected" : ""}>${level}</option>`).join("")}
                  </select>`
                : `<input name="profilePicture" value="${profile.profilePicture || ""}" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50" placeholder="Logo or profile image URL" />`
              }
              <input name="skills" value="${(profile.skills || []).join(", ")}" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50 md:col-span-2 ${profile.role === "client" ? "hidden" : ""}" placeholder="Skills, comma separated" />
              <input name="portfolioLinks" value="${(profile.portfolioLinks || []).join(", ")}" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50 md:col-span-2 ${profile.role === "client" ? "hidden" : ""}" placeholder="Portfolio URLs, comma separated" />
              <textarea name="${profile.role === "client" ? "companyDescription" : "bio"}" rows="5" class="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-900/50 md:col-span-2" placeholder="${profile.role === "client" ? "Describe your company and the kind of specialists you hire." : "Share your niche strengths, process, and outcomes."}">${profile.role === "client" ? profile.companyDescription || "" : profile.bio || ""}</textarea>
              <button class="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2">Save profile</button>
            </form>
          </article>
        </div>

        <div class="space-y-6">
          <article class="glass-panel rounded-[28px] p-8">
            <h2 class="display-font mb-5 text-2xl font-bold">Quick stats</h2>
            <div class="space-y-3">
              <div class="dashboard-card rounded-3xl p-4">
                <p class="text-sm text-slate-500">Bookmarks</p>
                <p class="mt-2 text-2xl font-bold">${profile.bookmarkedJobs?.length || 0}</p>
              </div>
              <div class="dashboard-card rounded-3xl p-4">
                <p class="text-sm text-slate-500">Posted jobs</p>
                <p class="mt-2 text-2xl font-bold">${profile.postedJobs?.length || 0}</p>
              </div>
              <div class="dashboard-card rounded-3xl p-4">
                <p class="text-sm text-slate-500">Accepted jobs</p>
                <p class="mt-2 text-2xl font-bold">${profile.acceptedJobs?.length || 0}</p>
              </div>
            </div>
          </article>

          <article class="glass-panel rounded-[28px] p-8 ${profile.role === "client" ? "hidden" : ""}">
            <h2 class="display-font mb-5 text-2xl font-bold">Client ratings</h2>
            <div class="space-y-3">
              ${profile.ratings?.length ? profile.ratings.map((rating) => `
                <article class="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                  <p class="font-semibold text-amber-500">${renderRatingStars(rating.score)}</p>
                  <p class="mt-2 text-sm text-slate-500">${rating.comment || "No written feedback"}</p>
                </article>
              `).join("") : `<p class="text-sm text-slate-500">No ratings yet.</p>`}
            </div>
          </article>
        </div>
      </section>
    `;

    document.getElementById("profileForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const payload = Object.fromEntries(formData.entries());

      payload.skills = payload.skills ? payload.skills.split(",").map((item) => item.trim()).filter(Boolean) : [];
      payload.portfolioLinks = payload.portfolioLinks ? payload.portfolioLinks.split(",").map((item) => item.trim()).filter(Boolean) : [];
      payload.hourlyRate = payload.hourlyRate ? Number(payload.hourlyRate) : 0;

      try {
        const updated = await apiRequest("/users/me", {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        localStorage.setItem("skillniche_user", JSON.stringify({
          ...user,
          name: updated.name,
          companyName: updated.companyName
        }));
        showToast("Profile updated");
        window.location.reload();
      } catch (error) {
        showToast(error.message, true);
      }
    });
  } catch (error) {
    showToast(error.message, true);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "profile") initProfilePage();
});
