import { app } from "../server";
import { atualizarCategoria } from "../repositories/CategoriaClienteRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { Cliente } from "../models/CategoriaCliente";

export function CategoriaClienteController() {
  const clienteRepository = new ClienteRepository();

  app.post("/clientes/:id/atualizar-categoria", (req, res) => {
    try {
      const id = parseInt(req.params.id);
    
      const cliente = clienteRepository.buscarPorId(id) as Cliente;

      if (!cliente) {
        return res.status(404).json({ erro: "Cliente não encontrado para atualização de categoria." });
      }

      atualizarCategoria(cliente);

      res.json({
        mensagem: `Processamento de categoria concluído para ${cliente.nome_completo}`,
        categoria_atual: cliente.categoria.nome,
        cliente: cliente
      });

    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro ao atualizar categoria";
      res.status(400).json({ erro: mensagem });
    }
  });
}