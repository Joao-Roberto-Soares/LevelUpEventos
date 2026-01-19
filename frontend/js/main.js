console.log("main.js carregado");

// ================= CONFIG =================
const API = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

// ================= UTIL =================
const el = id => document.getElementById(id);

// ================= ELEMENTOS =================
const modalOverlay = el("modal-overlay");
const modalBody = el("modal-body");
const btnLogout = el("btn-logout");

// ================= MODAL GLOBAL =================
function abrirModal(html) {
  modalBody.innerHTML = html;
  modalOverlay.classList.remove("hidden");
}

function fecharModal() {
  modalOverlay.classList.add("hidden");
  modalBody.innerHTML = "";
}

modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) fecharModal();
});

// ================= EVENTOS (MOCK) =================
const eventos = [
  {
    titulo: "Hackathon LevelUp 2025",
    descricao:
      "Um evento de 48 horas focado em inovação, tecnologia e trabalho em equipe. Ideal para desenvolvedores, designers e empreendedores.",
    data: "15/03/2025",
    horario: "09:00",
    local: "São Paulo, SP",
    imagem:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
  },
  {
    titulo: "Workshop de JavaScript",
    descricao:
      "Aprenda JavaScript moderno, boas práticas, async/await e integração com APIs REST.",
    data: "20/02/2025",
    horario: "19:00",
    local: "Online",
    imagem:
      "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    titulo: "Meetup Tech Community",
    descricao:
      "Networking, palestras e troca de experiências entre profissionais de tecnologia.",
    data: "10/02/2025",
    horario: "18:30",
    local: "Rio de Janeiro, RJ",
    imagem:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
  }
];

// ================= HOME =================
async function carregarHome() {
  const res = await fetch(`${API}/usuarios/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = await res.json();
  el("navbar-usuario").innerText = user.nome;

  renderizarEventos();
  renderizarComunidades(user.progresso || []);
  renderizarRankingGlobal();
}

// ================= EVENTOS =================
function renderizarEventos() {
  const container = el("lista-eventos");
  container.innerHTML = "";

  eventos.forEach(e => {
    container.innerHTML += `
      <div class="card">
        <img src="${e.imagem}">
        <div class="card-content">
          <h3>${e.titulo}</h3>
          <p>${e.descricao.substring(0, 70)}...</p>
          <small>${e.data} • ${e.local}</small>
          <button onclick="verDetalhesEvento('${e.titulo}')">
            Ver detalhes
          </button>
        </div>
      </div>
    `;
  });
}

function verDetalhesEvento(titulo) {
  const e = eventos.find(ev => ev.titulo === titulo);

  abrirModal(`
    <img src="${e.imagem}" style="width:100%;border-radius:16px;margin-bottom:20px">
    <h2>${e.titulo}</h2>
    <p>${e.descricao}</p>

    <p><strong>📅 Data:</strong> ${e.data}</p>
    <p><strong>⏰ Horário:</strong> ${e.horario}</p>
    <p><strong>📍 Local:</strong> ${e.local}</p>

    <div style="margin-top:30px;text-align:right">
      <button onclick="fecharModal()">Fechar</button>
    </div>
  `);
}

// ================= COMUNIDADES =================
function getImagemComunidade(nome) {
  const base = "assets/comunidades";

  const map = {
    "Harry Potter": `${base}/harry-potter.jpg`,
    "Star Wars": `${base}/star-wars.jpg`,
    "Marvel": `${base}/marvel.jpg`,
    "Naruto": `${base}/naruto.jpg`,
    "Dragon Ball": `${base}/dragon-ball.jpg`
  };

  return map[nome] || `${base}/default.jpg`;
}

function renderizarComunidades(progresso) {
  const container = el("lista-comunidades-usuario");
  container.innerHTML = "";

  progresso.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${getImagemComunidade(p.comunidade.nome)}">
        <div class="card-content">
          <h3>${p.comunidade.nome}</h3>
          <p>${p.pontos} pontos</p>

          <div style="display:flex;gap:10px">
            <button onclick="iniciarQuiz('${p.comunidade._id}')">
              Iniciar Quiz
            </button>

            <button class="btn-secondary"
              onclick="verRankingComunidade('${p.comunidade._id}', '${p.comunidade.nome}')">
              🏆 Ranking
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// ================= ADICIONAR COMUNIDADE =================
el("btn-adicionar-comunidade").onclick = async () => {
  const resUser = await fetch(`${API}/usuarios/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const user = await resUser.json();

  const res = await fetch(`${API}/comunidades`);
  const comunidades = await res.json();

  const idsQueUsuarioJaEntrou = user.progresso.map(p =>
    typeof p.comunidade === "object" ? p.comunidade._id : p.comunidade
  );

  const naoEntrou = comunidades.filter(
    c => !idsQueUsuarioJaEntrou.includes(c._id)
  );


  abrirModal(`
    <h2>➕ Entrar em comunidades</h2>
    ${naoEntrou.map(c => `
      <button
        style="display:block;width:100%;background:#fff;color:#000;margin-bottom:10px"
        onclick="entrarComunidade('${c._id}')">
        ${c.nome}
      </button>
    `).join("")}
  `);
};

async function entrarComunidade(id) {
  await fetch(`${API}/comunidades/${id}/entrar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });

  fecharModal();
  carregarHome();
}

// ================= QUIZ =================
async function iniciarQuiz(comunidadeId) {
  const res = await fetch(`${API}/comunidades/${comunidadeId}/quiz`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const quiz = await res.json();
  let index = 0;
  let acertos = 0;

  function renderPergunta() {
    const q = quiz[index];

    abrirModal(`
      <h2>${q.pergunta}</h2>
      <div id="quiz-alternativas">
        ${q.opcoes.map(op => `
          <button class="btn-alternativa"
            onclick="responderQuiz('${op}','${q.correta}')">
            ${op}
          </button>
        `).join("")}
      </div>
    `);
  }

  window.responderQuiz = async (resp, correta) => {
    const botoes = document.querySelectorAll(".btn-alternativa");

    botoes.forEach(b => {
      b.disabled = true;
      if (b.innerText === correta) b.classList.add("correta");
      else if (b.innerText === resp) b.classList.add("errada");
    });

    if (resp === correta) acertos++;

    setTimeout(() => {
      index++;
      index < quiz.length ? renderPergunta() : finalizarQuiz(comunidadeId, acertos);
    }, 800);
  };

  renderPergunta();
}

async function finalizarQuiz(comunidadeId, acertos) {
  await fetch(`${API}/comunidades/${comunidadeId}/pontuar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ pontos: acertos * 10 })
  });

  abrirModal(`
    <h2>🎉 Quiz finalizado</h2>
    <p>Você acertou ${acertos} de 10 perguntas</p>
    <p>+${acertos * 10} pontos adicionados</p>

    <div style="margin-top:30px;text-align:right">
      <button onclick="fecharModal()">Fechar</button>
    </div>
  `);

  carregarHome();
}

// ================= RANKING GLOBAL =================
async function renderizarRankingGlobal() {
  const res = await fetch(`${API}/usuarios/ranking`);
  const ranking = (await res.json()).filter(u => u.pontos > 0);

  const me = await fetch(`${API}/usuarios/me`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  const idx = ranking.findIndex(u => u.nome === me.nome);

  el("ranking-preview-card").innerHTML =
    idx === -1
      ? `<p>Você ainda não entrou no ranking global</p>`
      : `
        <h3>#${idx + 1}</h3>
        <p>${ranking[idx].pontos} pontos</p>
        <button onclick="verRankingGlobal()">Ver ranking completo</button>
      `;
}

function verRankingGlobal() {
  fetch(`${API}/usuarios/ranking`)
    .then(r => r.json())
    .then(ranking =>
      abrirModal(`
        <h2>🏆 Ranking Global</h2>
        ${ranking
          .filter(u => u.pontos > 0)
          .map(
            (u, i) =>
              `<div class="ranking-item">
                <strong>#${i + 1}</strong>
                <span>${u.nome}</span>
                <span>${u.pontos} pts</span>
              </div>`
          )
          .join("")}
      `)
    );
}

// ================= RANKING POR COMUNIDADE =================
async function verRankingComunidade(id, nome) {
  const res = await fetch(`${API}/comunidades/${id}/ranking`);
  const ranking = await res.json();

  abrirModal(`
    <h2>🏆 Ranking — ${nome}</h2>
    ${ranking.map(
    (u, i) => `
        <div class="ranking-item">
          <strong>#${i + 1}</strong>
          <span>${u.nome}</span>
          <span>${u.pontos} pts</span>
        </div>
      `
  ).join("")}
  `);
}

// ================= LOGOUT =================
btnLogout.onclick = () => {
  localStorage.removeItem("token");
  location.href = "login.html";
};

// ================= INIT =================
carregarHome();