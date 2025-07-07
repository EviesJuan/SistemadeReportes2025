document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error");

  if (username === "13739818" && password === "1277") {
    localStorage.setItem("loggedIn", "true");  // <<< Guardar estado de login
    window.location.href = "form7.html";
  } else {
    errorMsg.style.display = "block";
  }
});


