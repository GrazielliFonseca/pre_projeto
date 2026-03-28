import db from "../database/database";
import { Pedido } from "../models/Pedido";
import { ItensPedidoRepository } from './ItensPedidoRepository';

  export class PedidoRepository {
  private itensRepo = new ItensPedidoRepository();

  finalizarPedido(dadosVenda: any, sacola: any[]): number | null {
    try {
      const stmt = db.prepare(`
        INSERT INTO pedido (
          id_cliente, valor_total, forma_pagto, status, 
          forma_entrega, frete, cep, rua, numero, bairro, cidade, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const resultado = stmt.run(
        dadosVenda.id_cliente,
        dadosVenda.valor_total,
        dadosVenda.forma_pagto,
        'Finalizado', // Status inicial ao pagar
        dadosVenda.forma_entrega,
        dadosVenda.frete || 0,
        dadosVenda.cep,
        dadosVenda.rua,
        dadosVenda.numero,
        dadosVenda.bairro,
        dadosVenda.cidade,
        dadosVenda.estado
      );

      const idPedido = Number(resultado.lastInsertRowid);

      for (const item of sacola) {
        this.itensRepo.salvarItem(idPedido, item);
      }

      return idPedido;
    } catch (erro) {
      console.error("Erro ao finalizar pedido:", erro);
      return null;
    }
  }

//Adm
  listarPedidosRecentes(): Pedido[] {
    return db.prepare("SELECT * FROM pedido ORDER BY data_hora DESC").all() as Pedido[];
  }
}