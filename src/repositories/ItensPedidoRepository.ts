import db from "../database/database";

export class ItensPedidoRepository {
  salvarItem(idPedido: number, item: any): void {
    db.prepare(`
      INSERT INTO itens_pedido (id_pedido, id_produto, qtd, valor_unitario, cor, tamanho)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(idPedido, item.id_produto, item.qtd, item.valor_unitario, item.cor, item.tamanho);
  }

  removerItem(id: number): boolean {
    const resultado = db.prepare("DELETE FROM itens_pedido WHERE id = ?").run(id);
    return resultado.changes > 0;
  }
}