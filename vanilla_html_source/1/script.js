const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

  const type =
    password.getAttribute("type") === "password"
      ? "text"
      : "password";

  password.setAttribute("type", type);

  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");

});