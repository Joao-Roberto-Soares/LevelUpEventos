module.exports = (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({
      erro: "Acesso negado",
      mensagem: "Apenas administradores podem executar esta ação."
    });
  }

  next();
};
