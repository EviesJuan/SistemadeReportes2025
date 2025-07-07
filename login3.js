document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error");

  if (username === "10475974" && password === "0571") {
    localStorage.setItem("loggedIn3", "true"); // protección de sesión
    window.location.href = "form3.html";
  } else {
    errorMsg.style.display = "block";
  }
});

