import db from "../database/database";
import { Estoque } from "../models/Estoque";

export class EstoqueRepository {
  salvar(item: Estoque): Estoque {
    const resultado = db
      .prepare(`
        INSERT INTO estoque (data_entrada, status_produto, qtd_produto) 
        VALUES (?, ?, ?)
      `)
      .run(
        item.data_entrada,
        item.status_produto,
        item.qtd_produto
      );

    return { 
      ...item, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Estoque[] {
    return db.prepare("SELECT * FROM estoque").all() as Estoque[];
  }

  buscarPorId(id: number): Estoque | null {
    return (db.prepare("SELECT * FROM estoque WHERE id = ?").get(id) as Estoque) ?? null;
  }

  atualizarQuantidade(id: number, novaQuantidade: number): boolean {
    const resultado = db
      .prepare("UPDATE estoque SET qtd_produto = ? WHERE id = ?")
      .run(novaQuantidade, id);
    return resultado.changes > 0;
  }

  listarEstoqueBaixo(limite: number = 5): Estoque[] {
    return db.prepare("SELECT * FROM estoque WHERE qtd_produto <= ?").all(limite) as Estoque[];
  }
}