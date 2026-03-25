import db from "../database/database";
import { ItensPedido } from "../models/ItensPedido";

export class ItensPedidoRepository {
  salvar(item: ItensPedido): ItensPedido {
    const resultado = db
      .prepare(`
        INSERT INTO itens_pedido (id_pedido, id_produto, qtd) 
        VALUES (?, ?, ?)
      `)
      .run(
        item.id_pedido,
        item.id_produto,
        item.qtd
      );

    return { 
      ...item, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listarPorPedido(idPedido: number): ItensPedido[] {
    return db.prepare("SELECT * FROM itens_pedido WHERE id_pedido = ?").all(idPedido) as ItensPedido[];
  }

  listarPorProduto(idProduto: number): ItensPedido[] {
    return db.prepare("SELECT * FROM itens_pedido WHERE id_produto = ?").all(idProduto) as ItensPedido[];
  }

  removerItem(id: number): boolean {
    const resultado = db.prepare("DELETE FROM itens_pedido WHERE id = ?").run(id);
    return resultado.changes > 0;
  }
}