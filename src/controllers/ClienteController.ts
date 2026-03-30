import { app } from "../server";
import { ClienteRepository } from "../repositories/ClienteRepository";

export function ClienteController() {
  const repository = new ClienteRepository();

//Site
  app.post("/clientes/cadastro", (req, res) => {
    try {
      const dadosCliente = req.body;

      if (!dadosCliente.nome || !dadosCliente.cpf || !dadosCliente.senha) {
        throw new Error("Campos obrigatórios (nome, cpf, senha) estão faltando.");
      }

      const novoCliente = repository.criarConta(dadosCliente);
      res.status(201).json({
        mensagem: "Conta criada com sucesso!",
        cliente: novoCliente
      });
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro ao criar conta";
      res.status(400).json({ erro: mensagem });
    }
  });

  app.post("/clientes/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    const cliente = repository.login(email, senha);

    if (!cliente) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    res.json({
      mensagem: "Login realizado com sucesso!",
      cliente
    });
  });


  app.get("/clientes/:id", (req, res) => {
    const id = Number(req.params.id);
    const cliente = repository.buscarPorId(id);

    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado." });
    }

    res.json(cliente);
  });


//Adm

  app.get("/adm/clientes/inativos", (req, res) => {
    try {
      const inativos = repository.listarClientesInativos();
      res.json(inativos);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao listar clientes inativos." });
    }
  });

  app.post("/adm/enviar-ofertas", (req, res) => {
    try {
      repository.enviarOferta();
      res.json({ mensagem: "Processo de envio de ofertas disparado com sucesso!" });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao processar envio de ofertas." });
    }
  });

  app.patch("/clientes/:id/atualizar-fidelidade", (req, res) => {
    const id = Number(req.params.id);
    repository.atualizarCategoriaCliente(id);
    res.json({ mensagem: `Verificação de fidelidade solicitada para o cliente ${id}` });
  });
}