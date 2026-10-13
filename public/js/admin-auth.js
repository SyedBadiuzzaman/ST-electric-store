const ADMIN_PASSWORD_HASH = "a29d34edc179b5bb45c5199d0bcde3e9ee6659d5d6cf8a287e6e0f7b5a3797ef";
const SESSION_KEY = "st-electric-admin-authorized";

const login = document.querySelector("#admin-login");
const loginForm = document.querySelector("#admin-login-form");
const passwordInput = document.querySelector("#admin-password");
const loginError = document.querySelector("#admin-login-error");
const adminArea = document.querySelector("#admin-area");

const hashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const unlock = () => {
  document.body.classList.remove("admin-locked");
  login.hidden = true;
  adminArea.hidden = false;
  document.querySelector("#main").focus({ preventScroll: true });
};

if (sessionStorage.getItem(SESSION_KEY) === "yes") unlock();

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submittedHash = await hashPassword(passwordInput.value);
  if (submittedHash !== ADMIN_PASSWORD_HASH) {
    loginError.hidden = false;
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }
  sessionStorage.setItem(SESSION_KEY, "yes");
  loginError.hidden = true;
  unlock();
});

document.querySelector("#admin-logout").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});
