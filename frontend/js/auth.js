const API_URL = "http://localhost:3000";

/* ==========================
   LOGIN
========================== */
async function login(email, senha) {
  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.erro || "Email ou senha inválidos");
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "home.html";
  } catch (err) {
    alert("Erro de conexão com o servidor");
  }
}

/* ==========================
   CADASTRO
========================== */
async function cadastro(nome, email, senha) {
  try {
    const response = await fetch(`${API_URL}/usuarios/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.erro || "Erro ao cadastrar usuário");
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "home.html";
  } catch (err) {
    alert("Erro de conexão com o servidor");
  }
}

/* ==========================
   LISTENERS
========================== */

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    login(email, senha);
  });
}

// CADASTRO
const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    cadastro(nome, email, senha);
  });
}

/* ==========================
   PROTEÇÃO DE PÁGINA
========================== */
function protegerPagina() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
}