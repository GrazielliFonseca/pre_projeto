import db from "../database/database";
import { Produto } from "../models/Produto";

export class ProdutoRepository {
  cadastrarProduto(produto: Produto): Produto {
    const resultado = db
      .prepare(`
        INSERT INTO produto (
          nome, descricao, categoria, tamanho, cor, sku, 
          qtd, estoque_min, custo, venda, id_fornecedor, data_entrada
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        produto.nome,
        produto.descricao,
        produto.categoria,
        produto.tamanho,
        produto.cor,
        produto.sku,
        produto.qtd,
        produto.estoque_min,
        produto.custo,
        produto.venda,
        produto.id_fornecedor,
        produto.data_entrada instanceof Date ? produto.data_entrada.toISOString() : produto.data_entrada
      );

    return { 
      ...produto, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

//Site
  listar(): Produto[] {
    return db.prepare("SELECT * FROM produto").all() as Produto[];
  }

  filtrarPorCategoria(categoria: string): Produto[] {
    return db.prepare("SELECT * FROM produto WHERE categoria = ?").all(categoria) as Produto[];
  }
  
  buscarPorNome(nome: string): Produto[] {
    return db.prepare("SELECT * FROM produto WHERE nome LIKE ?").all(`%${nome}%`) as Produto[];
  }

  buscarPorCategoria(categoria: string): Produto[] {
    return db.prepare("SELECT * FROM produto WHERE categoria = ?").all(categoria) as Produto[];
  }

//Adm
  listarProdutosCadastrados(): Produto[] {
    return db.prepare("SELECT * FROM produto").all() as Produto[];
  }

  mostrarDescricao(id: number): string | null {
    const resultado = db.prepare("SELECT descricao FROM produto WHERE id = ?").get(id) as { descricao: string } | undefined;
    return resultado ? resultado.descricao : null;
}

  editarProduto(produto: Produto): Produto | null {
    const resultado = db
      .prepare(`
        UPDATE produto
        SET nome = ?, descricao = ?, categoria = ?, tamanho = ?, cor = ?, sku = ?,
            qtd = ?, estoque_min = ?, custo = ?, venda = ?, id_fornecedor = ?, data_entrada = ?
        WHERE id = ?
      `)
      .run(
        produto.nome,
        produto.descricao,
        produto.categoria,
        produto.tamanho,
        produto.cor,
        produto.sku,
        produto.qtd,
        produto.estoque_min,
        produto.custo,
        produto.venda,
        produto.id_fornecedor,
        produto.data_entrada instanceof Date ? produto.data_entrada.toISOString() : produto.data_entrada,
        produto.id
      );

    return resultado.changes > 0 ? produto : null;
  }

  aplicarDesconto(id: number, valorDesconto: number): boolean {
  const resultado = db
    .prepare(`
      UPDATE produto
      SET venda = venda - (venda * (? / 100.0)) 
      WHERE id = ?
    `)
    .run(valorDesconto, id);

  return resultado.changes > 0;
  }

  excluirProduto(id: number): boolean {
    const resultado = db.prepare("DELETE FROM produto WHERE id = ?").run(id);
    return resultado.changes > 0;
  }

  liquidacaoAutomatica(): void {
    db.prepare(`
      UPDATE produto
      SET venda = venda * 0.8
      WHERE id IN (
        SELECT id FROM produto
        WHERE qtd > 0 AND DATEDIFF(CURRENT_DATE, data_ultima_venda) > 15
      )
    `).run();
  }
}