document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  postForm(
    "/auth/register",
    {
      email: document.getElementById("email").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    },
    document.getElementById("register-error"),
    () => { location.href = "login.html"; }
  );
});
