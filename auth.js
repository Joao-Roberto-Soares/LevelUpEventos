const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ mensagem: "Acesso negado! Token não fornecido." });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // PADRONIZAÇÃO:
        // Se o seu login gerou { id: '...' }, pegamos o .id
        // Se gerou apenas a string, usamos o verificado direto
        req.usuarioId = verificado.id || verificado;
        
        // Log para te ajudar a debugar no Render (pode remover depois)
        console.log("🔐 Usuário Autenticado ID:", req.usuarioId);
        
        next();
    } catch (err) {
        res.status(400).json({ mensagem: "Token inválido ou expirado!" });
    }
};