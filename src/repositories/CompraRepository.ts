import db from "../database/database";
import { Compra } from "../models/Compra";

export class CompraRepository {
  salvar(compra: Compra): Compra {
    const resultado = db
      .prepare(`
        INSERT INTO compras (cep, numero_casa, frete, forma_pagamento, quantidade, status, data) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        compra.cep,
        compra.numero_casa,
        compra.frete,
        compra.forma_pagamento,
        compra.quantidade,
        compra.status,
        compra.data.toString()
      );

    return { 
      ...compra, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Compra[] {
    return db.prepare("SELECT * FROM compras").all() as Compra[];
  }

  buscarPorId(id: number): Compra | null {
    return (db.prepare("SELECT * FROM compras WHERE id = ?").get(id) as Compra) ?? null;
  }


  listarPorStatus(status: string): Compra[] {
    return db.prepare("SELECT * FROM compras WHERE status = ?").all(status) as Compra[];
  }

  atualizarStatus(id: number, novoStatus: string): boolean {
    const resultado = db
      .prepare("UPDATE compras SET status = ? WHERE id = ?")
      .run(novoStatus, id);
    return resultado.changes > 0;
  }
}