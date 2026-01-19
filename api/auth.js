const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token não enviado
  if (!authHeader) {
    return res.status(401).json({
      erro: "Acesso negado. Token não fornecido."
    });
  }

  // Formato esperado: "Bearer TOKEN"
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({
      erro: "Token mal formatado."
    });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      erro: "Token mal formatado."
    });
  }

  // Verificação do token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔐 DADOS DO USUÁRIO
    req.usuarioId = decoded.id;
    req.role = decoded.role; // 👑 ESSENCIAL PARA ADMIN

    console.log("🔐 Usuário autenticado:", req.usuarioId, "| role:", req.role);

    next();
  } catch (error) {
    return res.status(401).json({
      erro: "Token inválido ou expirado."
    });
  }
};
