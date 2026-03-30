import { app } from "../server";
import { MovimentoEstoqueRepository } from "../repositories/MovimentoEstoqueRepository";

export function MovimentoEstoqueController() {
  const repository = new MovimentoEstoqueRepository();

  app.get("/estoque/movimentacoes", (req, res) => {
    try {
      const historico = repository.listarMovimentacoes();
      res.json(historico);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao carregar histórico de estoque." });
    }
  });

  // Registrar uma nova movimentação
  app.post("/estoque/movimentar", (req, res) => {
    try {
      const dados = req.body;

      if (!dados.id_produto || !dados.qtd || !dados.id_funcionario || !dados.tipo_movimentacao) {
        throw new Error("Campos obrigatórios: produto, quantidade, funcionário e tipo (Entrada/Saída).");
      }

      const movimentoComData = {
        ...dados,
        data_hora: dados.data_hora || new Date().toISOString()
      };

      const resultado = repository.fazerMovimentacao(movimentoComData);

      console.log(`[Estoque] ${movimentoComData.tipo_movimentacao}: ${movimentoComData.qtd} unidades do produto ${movimentoComData.id_produto}`);

      res.status(201).json({
        mensagem: "Movimentação de estoque registrada!",
        movimento: resultado
      });

    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro ao processar movimentação";
      res.status(400).json({ erro: mensagem });
    }
  });
}