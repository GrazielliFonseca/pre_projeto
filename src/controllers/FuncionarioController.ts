import { app } from "../server";
import { FuncionarioRepository } from "../repositories/FuncionarioRepository";

export function FuncionarioController() {
  const repository = new FuncionarioRepository();

  app.get("/funcionarios", (req, res) => {
    try {
      const funcionarios = repository.listar();
      res.json(funcionarios);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao listar funcionários" });
    }
  });


  app.post("/funcionarios", (req, res) => {
    try {
      const dados = req.body;

      if (!dados.nome || !dados.cpf || !dados.email || !dados.senha) {
        throw new Error("Dados obrigatórios faltando: nome, cpf, email ou senha.");
      }

      const novoFuncionario = repository.cadastrarFuncionario(dados);
      
      res.status(201).json(novoFuncionario);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro ao cadastrar funcionário";
      res.status(400).json({ erro: mensagem });
    }
  });


  app.put("/funcionarios/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const dados = req.body;

      const funcionarioAtualizado = repository.editarFuncionario({
        ...dados,
        id: id
      });

      if (!funcionarioAtualizado) {
        return res.status(404).json({ erro: "Funcionário não encontrado para edição." });
      }

      res.json({
        mensagem: "Dados do funcionário atualizados com sucesso!",
        funcionario: funcionarioAtualizado
      });
    } catch (err) {
      res.status(400).json({ erro: "Erro ao editar funcionário" });
    }
  });


  app.delete("/funcionarios/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const excluido = repository.excluirFuncionario(id);

      if (!excluido) {
        return res.status(404).json({ erro: "Funcionário não encontrado ou já removido." });
      }

      res.json({ mensagem: "Funcionário excluído com sucesso!" });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao excluir funcionário" });
    }
  });
}