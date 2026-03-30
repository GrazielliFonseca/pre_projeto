import { app } from "../server";
import { ItensPedidoRepository } from "../repositories/ItensPedidoRepository";

export function ItensPedidoController() {
  const repository = new ItensPedidoRepository();

  // Adicionar um item a um pedido existente
  app.post("/pedidos/:id/itens", (req, res) => {
    try {
      const idPedido = Number(req.params.id);
      const item = req.body;

      if (!item.id_produto || !item.qtd || !item.valor_unitario) {
        throw new Error("Produto, quantidade e valor unitário são obrigatórios.");
      }

      console.log(`[Item] Adicionando produto ${item.id_produto} ao pedido ${idPedido}`);

      repository.salvarItem(idPedido, item);

      res.status(201).json({ 
        mensagem: "Item adicionado ao pedido com sucesso!",
        detalhes: {
          pedido: idPedido,
          produto: item.id_produto,
          variacao: `${item.cor || 'N/A'} - ${item.tamanho || 'N/A'}`
        }
      });
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro ao adicionar item";
      res.status(400).json({ erro: mensagem });
    }
  });


  app.delete("/itens-pedido/:id", (req, res) => {
    try {
      const idItem = Number(req.params.id);
      const removido = repository.removerItem(idItem);

      if (!removido) {
        return res.status(404).json({ erro: "Item não encontrado para remoção." });
      }

      res.json({ mensagem: "Item removido do pedido com sucesso." });
    } catch (err) {
      res.status(500).json({ erro: "Erro interno ao remover item." });
    }
  });
}