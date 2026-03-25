import db from "../database/database";
import { Produto } from "../models/Produto";

export class ProdutoRepository {
  salvar(produto: Produto): Produto {
    const resultado = db
      .prepare(`
        INSERT INTO produtos (
          nome, descricao, categoria, tamanho, cor, marca, sku, 
          qtd, estoque_min, custo, venda, margem, id_funcionario, id_fornecedor
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        produto.nome,
        produto.descricao,
        produto.categoria,
        produto.tamanho,
        produto.cor,
        produto.marca,
        produto.sku,
        produto.qtd,
        produto.estoque_min,
        produto.custo,
        produto.venda,
        produto.margem,
        produto.id_funcionario,
        produto.id_fornecedor
      );

    return { 
      ...produto, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Produto[] {
    return db.prepare("SELECT * FROM produtos").all() as Produto[];
  }

  buscarPorId(id: number): Produto | null {
    return (db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto) ?? null;
  }

  buscarPorSku(sku: string): Produto | null {
    return (db.prepare("SELECT * FROM produtos WHERE sku = ?").get(sku) as Produto) ?? null;
  }

  listarPorCategoria(categoria: string): Produto[] {
    return db.prepare("SELECT * FROM produtos WHERE categoria = ?").all(categoria) as Produto[];
  }

  listarProdutosParaRepor(): Produto[] {
    return db.prepare("SELECT * FROM produtos WHERE qtd <= estoque_min").all() as Produto[];
  }

  atualizarPreco(id: number, novoPreco: number, novaMargem: number): boolean {
    const resultado = db
      .prepare("UPDATE produtos SET venda = ?, margem = ? WHERE id = ?")
      .run(novoPreco, novaMargem, id);
    return resultado.changes > 0;
  }
}