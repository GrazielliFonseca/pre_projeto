import { app } from "../server";
import { AvaliacaoRepository } from "../repositories/AvaliacaoRepository";

export function AvaliacaoController() {
  const repository = new AvaliacaoRepository();

  // Listar todas as avaliações ou filtrar por produto
  app.get("/avaliacao", (req, res) => {
    const { id_produto } = req.query;

    if (id_produto) {
      const avaliacoes = repository.listarAvaliacaoPorProduto(Number(id_produto));
      return res.json(avaliacoes);
    }

    const todas = repository.listarAvaliacao();
    res.json(todas);
  });

  // Criar uma nova avaliação
  app.post("/avaliacao", (req, res) => {
    try {
      const { nomeDigitado, id_produto, nota, comentario } = req.body;

      if (!nomeDigitado) throw new Error("O nome do cliente é obrigatório.");
      if (!id_produto) throw new Error("O ID do produto é obrigatório.");
      if (!nota || nota < 1 || nota > 5) throw new Error("A nota deve estar entre 1 e 5.");

      const resultado = repository.criarAvaliacao(
        nomeDigitado,
        Number(id_produto),
        Number(nota),
        comentario
      );

      res.status(201).json(resultado);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno ao processar avaliação";
      
      res.status(400).json({ erro: mensagem });
    }
  });
}