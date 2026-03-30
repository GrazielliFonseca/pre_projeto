import { app } from "../server";
import { FornecedorRepository } from "../repositories/FornecedorRepository";

export function FornecedorController() {
  const repository = new FornecedorRepository();

  app.get("/fornecedores", (req, res) => {
    try {
      const fornecedores = repository.listar();
      res.json(fornecedores);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao listar fornecedores" });
    }
  });


  app.post("/fornecedores", (req, res) => {
    try {
      const dados = req.body;

      if (!dados.nome || !dados.cnpj) {
        throw new Error("Nome e CNPJ são obrigatórios.");
      }

      const novoFornecedor = repository.cadastrarFornecedor(dados);
      res.status(201).json(novoFornecedor);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro ao cadastrar fornecedor";
      res.status(400).json({ erro: mensagem });
    }
  });


  app.put("/fornecedores/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const dados = req.body;

      const fornecedorAtualizado = repository.editarFornecedor({
        ...dados,
        id: id 
      });

      if (!fornecedorAtualizado) {
        return res.status(404).json({ erro: "Fornecedor não encontrado para edição." });
      }

      res.json({
        mensagem: "Fornecedor atualizado com sucesso!",
        fornecedor: fornecedorAtualizado
      });
    } catch (err) {
      res.status(400).json({ erro: "Erro ao editar fornecedor" });
    }
  });
  

  app.delete("/fornecedores/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const excluido = repository.excluirFornecedor(id);

      if (!excluido) {
        return res.status(404).json({ erro: "Fornecedor não encontrado ou já excluído." });
      }

      res.json({ mensagem: "Fornecedor removido com sucesso!" });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao excluir fornecedor" });
    }
  });
}