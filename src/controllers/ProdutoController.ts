import { app } from "../server";
import { ProdutoRepository } from "../repositories/ProdutoRepository";

export function ProdutoController() {
  const repository = new ProdutoRepository();

//Site
  app.get("/produtos", (req, res) => {
    try {
      const { nome, categoria } = req.query;

      if (nome) {
        return res.json(repository.buscarPorNome(nome as string));
      }

      if (categoria) {
        return res.json(repository.filtrarPorCategoria(categoria as string));
      }

      const produtos = repository.listar();
      res.json(produtos);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao buscar produtos." });
    }
  });

//Adm
  app.post("/adm/produtos", (req, res) => {
    try {
      const dados = req.body;
      if (!dados.nome || !dados.sku || !dados.venda) {
        throw new Error("Campos essenciais faltando: nome, sku ou preço de venda.");
      }

      const novoProduto = repository.cadastrarProduto(dados);
      res.status(201).json(novoProduto);
    } catch (err) {
      res.status(400).json({ erro: err instanceof Error ? err.message : "Erro ao cadastrar" });
    }
  });

  app.get("/produtos/:id/descricao", (req, res) => {
    const id = Number(req.params.id);
    const descricao = repository.mostrarDescricao(id);

    if (!descricao) return res.status(404).json({ erro: "Produto não encontrado." });

    res.json({ id, descricao });
  });


  app.put("/adm/produtos/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const dados = req.body;

      const atualizado = repository.editarProduto({ ...dados, id });

      if (!atualizado) return res.status(404).json({ erro: "Produto não encontrado." });

      res.json({ mensagem: "Produto atualizado!", produto: atualizado });
    } catch (err) {
      res.status(400).json({ erro: "Erro ao editar produto." });
    }
  });


  app.patch("/adm/produtos/:id/desconto", (req, res) => {
    try {
      const id = Number(req.params.id);
      const { valor_desconto } = req.body;

      if (!valor_desconto) throw new Error("Informe o percentual do desconto.");

      const sucesso = repository.aplicarDesconto(id, Number(valor_desconto));
      if (!sucesso) return res.status(404).json({ erro: "Produto não encontrado." });

      res.json({ mensagem: "Desconto aplicado com sucesso!" });
    } catch (err) {
      res.status(400).json({ erro: err instanceof Error ? err.message : "Erro ao aplicar desconto." });
    }
  });


  app.post("/adm/produtos/liquidacao", (req, res) => {
    try {
      repository.liquidacaoAutomatica();
      res.json({ mensagem: "Processo de liquidação executado para produtos sem saída." });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao processar liquidação." });
    }
  });


  app.delete("/adm/produtos/:id", (req, res) => {
    const id = Number(req.params.id);
    const excluido = repository.excluirProduto(id);

    if (!excluido) return res.status(404).json({ erro: "Produto não encontrado." });

    res.json({ mensagem: "Produto removido do catálogo." });
  });
}