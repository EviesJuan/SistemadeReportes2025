document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error");

  if (username === "7177066" && password === "0960") {
    localStorage.setItem("loggedIn4", "true"); // Guardar estado de sesión
    window.location.href = "form4.html";
  } else {
    errorMsg.style.display = "block";
  }
});
