document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const roleSelect = document.getElementById("role");
  const companyField = document.getElementById("companyField");

  roleSelect?.addEventListener("change", () => {
    companyField?.classList.toggle("hidden", roleSelect.value !== "client");
  });

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setSession(data.token, data.user);
      showToast("Registration successful");
      window.location.href = data.user.role === "client" ? "/client-dashboard.html" : "/freelancer-dashboard.html";
    } catch (error) {
      showToast(error.message, true);
    }
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setSession(data.token, data.user);
      showToast("Welcome back");
      window.location.href = data.user.role === "client" ? "/client-dashboard.html" : "/freelancer-dashboard.html";
    } catch (error) {
      showToast(error.message, true);
    }
  });
});
