document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error");

  if (username === "15308972" && password === "0283") {
    localStorage.setItem("loggedIn1", "true"); // ← clave única por perfil
    window.location.href = "form1.html";
  } else {
    errorMsg.style.display = "block";
  }
});
