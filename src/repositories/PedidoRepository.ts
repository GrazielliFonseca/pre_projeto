import db from "../database/database";
import { Pedido } from "../models/Pedido";
import { ItensPedidoRepository } from './ItensPedidoRepository';

export class PedidoRepository {
  private itensRepo = new ItensPedidoRepository();

  iniciarPedido(idCliente: number, valorTotal: number, sacola: any[]): number | null {
    try {
      const stmt = db.prepare(`
        INSERT INTO pedido (id_cliente, valor_total, status, data_hora, frete) 
        VALUES (?, ?, 'Pendente', datetime('now'), 0)
      `);

      const resultado = stmt.run(idCliente, valorTotal);
      const idPedido = Number(resultado.lastInsertRowid);

      for (const item of sacola) {
        this.itensRepo.salvarItem(idPedido, item);
      }

      return idPedido;
    } catch (erro) {
      console.error("Erro ao iniciar pedido:", erro);
      return null;
    }
  }

  // Usei Partial<Pedido> para permitir passar apenas os dados de endereço
  definirEntrega(idPedido: number, dados: Partial<Pedido>): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE pedido SET 
          forma_entrega = ?, frete = ?, cep = ?, rua = ?, 
          numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?
        WHERE id = ?
      `);

      const resultado = stmt.run(
        dados.forma_entrega,
        dados.frete || 0,
        dados.cep || null,
        dados.rua || null,
        dados.numero || null,
        dados.complemento || null,
        dados.bairro || null,
        dados.cidade || null,
        dados.estado || null,
        idPedido
      );
      return resultado.changes > 0;
    } catch (erro) {
      console.error("Erro ao definir entrega:", erro);
      return false;
    }
  }

  definirPagamento(idPedido: number, formaPagto: string): boolean {
    try {
      const stmt = db.prepare("UPDATE pedido SET forma_pagto = ? WHERE id = ?");
      const resultado = stmt.run(formaPagto, idPedido);
      return resultado.changes > 0;
    } catch (erro) {
      console.error("Erro ao definir pagamento:", erro);
      return false;
    }
  }

  revisarPedido(idPedido: number): any {
    try {
      const pedido = db.prepare(`
        SELECT p.*, c.nome_completo 
        FROM pedido p 
        JOIN cliente c ON p.id_cliente = c.id 
        WHERE p.id = ?
      `).get(idPedido) as any;

      if (!pedido) {
        console.error("Pedido não encontrado");
        return null;
      }

      const itens = db.prepare("SELECT * FROM itens_pedido WHERE id_pedido = ?").all(idPedido);

      return { ...pedido, itens };
    } catch (erro) {
      console.error("Erro ao revisar pedido:", erro);
      return null;
    }
  }

  finalizarPedido(idPedido: number): boolean {
    try {
      const stmt = db.prepare("UPDATE pedido SET status = 'Finalizado' WHERE id = ?");
      const resultado = stmt.run(idPedido);
      if (resultado.changes > 0) {
        console.log(`Pedido ${idPedido} finalizado com sucesso.`);
      }
      
      return resultado.changes > 0;
    } catch (erro) {
      console.error("Erro ao finalizar pedido:", erro);
      return false;
    }
  }

//Adm
  listarPedidosRecentes(): Pedido[] {
    return db.prepare("SELECT * FROM pedido ORDER BY data_hora DESC").all() as Pedido[];
  }
}