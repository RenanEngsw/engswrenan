// Usuário e senha definidos em variáveis
const usuarioValido = "admin";
const senhaValida = "123456";

// Função de login
function login(event) {
    event.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const error = document.getElementById("error-message");

    if (user === usuarioValido && pass === senhaValida) {
        window.location.href = "dashboard.html";
    } else {
        error.textContent = "Usuário ou senha incorretos.";
    }
}