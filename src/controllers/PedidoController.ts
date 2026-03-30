import { app } from "../server";
import { PedidoRepository } from "../repositories/PedidoRepository";

export function PedidoController() {
  const repository = new PedidoRepository();


  app.post("/pedidos/iniciar", (req, res) => {
    try {
      const { id_cliente, valor_total, sacola } = req.body;

      if (!id_cliente || !sacola || !Array.isArray(sacola)) {
        throw new Error("Dados inválidos: id_cliente e sacola são obrigatórios.");
      }

      const idPedido = repository.iniciarPedido(id_cliente, valor_total, sacola);

      if (!idPedido) throw new Error("Erro ao processar a criação do pedido.");

      res.status(201).json({
        mensagem: "Pedido iniciado com sucesso!",
        id_pedido: idPedido
      });
    } catch (err) {
      res.status(400).json({ erro: err instanceof Error ? err.message : "Erro ao iniciar pedido" });
    }
  });


  app.patch("/pedidos/:id/entrega", (req, res) => {
    try {
      const id = Number(req.params.id);
      const dadosEntrega = req.body;

      const sucesso = repository.definirEntrega(id, dadosEntrega);

      if (!sucesso) return res.status(404).json({ erro: "Pedido não encontrado ou dados inválidos." });

      res.json({ mensagem: "Dados de entrega atualizados!" });
    } catch (err) {
      res.status(400).json({ erro: "Erro ao definir entrega." });
    }
  });


  app.patch("/pedidos/:id/pagamento", (req, res) => {
    try {
      const id = Number(req.params.id);
      const { forma_pagto } = req.body;

      if (!forma_pagto) throw new Error("Informe a forma de pagamento.");

      const sucesso = repository.definirPagamento(id, forma_pagto);

      if (!sucesso) return res.status(404).json({ erro: "Pedido não encontrado." });

      res.json({ mensagem: "Forma de pagamento registrada!" });
    } catch (err) {
      res.status(400).json({ erro: err instanceof Error ? err.message : "Erro no pagamento." });
    }
  });


  app.get("/pedidos/:id/revisar", (req, res) => {
    const id = Number(req.params.id);
    const resumo = repository.revisarPedido(id);

    if (!resumo) return res.status(404).json({ erro: "Pedido não encontrado." });

    res.json(resumo);
  });


  app.post("/pedidos/:id/finalizar", (req, res) => {
    const id = Number(req.params.id);
    const finalizado = repository.finalizarPedido(id);

    if (!finalizado) return res.status(400).json({ erro: "Não foi possível finalizar o pedido." });

    res.json({ mensagem: "Pedido finalizado com sucesso! Obrigado pela compra na Urban Style." });
  });

//Adm
  app.get("/adm/pedidos/recentes", (req, res) => {
    try {
      const pedidos = repository.listarPedidosRecentes();
      res.json(pedidos);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao listar pedidos recentes." });
    }
  });
}