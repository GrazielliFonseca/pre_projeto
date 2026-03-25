import db from "../database/database";
import { Pedido } from "../models/Pedido";

export class PedidoRepository {
  salvar(pedido: Pedido): Pedido {
    const resultado = db
      .prepare(`
        INSERT INTO pedidos (data_pedido, valor_total, status_pedido, id_cliente) 
        VALUES (?, ?, ?, ?)
      `)
      .run(
        pedido.data_pedido,
        pedido.valor_total,
        pedido.status_pedido,
        pedido.id_cliente
      );

    return { 
      ...pedido, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Pedido[] {
    return db.prepare("SELECT * FROM pedidos").all() as Pedido[];
  }

  buscarPorId(id: number): Pedido | null {
    return (db.prepare("SELECT * FROM pedidos WHERE id = ?").get(id) as Pedido) ?? null;
  }

  listarPorCliente(idCliente: number): Pedido[] {
    return db.prepare("SELECT * FROM pedidos WHERE id_cliente = ?").all(idCliente) as Pedido[];
  }

  listarPorStatus(status: string): Pedido[] {
    return db.prepare("SELECT * FROM pedidos WHERE status_pedido = ?").all(status) as Pedido[];
  }

  atualizarStatus(id: number, novoStatus: string): boolean {
    const resultado = db
      .prepare("UPDATE pedidos SET status_pedido = ? WHERE id = ?")
      .run(novoStatus, id);
    return resultado.changes > 0;
  }
}