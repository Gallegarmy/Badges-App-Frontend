document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const termsChecked = document.getElementById("termsCheckbox").checked;
  const errorBox = document.getElementById("register-error");

  if (!termsChecked) {
    errorBox.textContent = "Debes aceptar los términos y condiciones para continuar.";
    errorBox.hidden = false;
    return; 
  }


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
