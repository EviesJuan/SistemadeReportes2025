document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar que el formulario se envíe de forma convencional

    // Obtener los valores ingresados por el usuario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aquí pones tus credenciales de inicio de sesión (de forma segura, en un servidor real)
    const validUser = 'Reporte';  // Usuario válido de ejemplo
    const validPass = 'corpoelec2025';  // Contraseña válida de ejemplo

    // Verificar si las credenciales son correctas
    if (username === validUser && password === validPass) {
        // Si las credenciales son correctas, redirigir al usuario
        window.location.href = 'index1.html' ;  // Redirige al archivo principal
        
    } else {
        // Si las credenciales son incorrectas, mostrar mensaje de error
        document.getElementById('errorMessage').style.display = 'block';
    }
});
