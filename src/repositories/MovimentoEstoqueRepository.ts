import db from "../database/database";
import { MovimentoEstoque } from "../models/MovimentoEstoque";

export class MovimentoEstoqueRepository {
  salvar(movimento: MovimentoEstoque): MovimentoEstoque {
    const resultado = db
      .prepare(`
        INSERT INTO movimento_estoque (id_produto, id_funcionario, id_pedido, tipo_movimentacao, qtd, data_hora) 
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        movimento.id_produto,
        movimento.id_funcionario,
        movimento.id_pedido,
        movimento.tipo_movimentacao,
        movimento.qtd,
        movimento.data_hora.toString()
      );

    return { 
      ...movimento, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listarPorProduto(idProduto: number): MovimentoEstoque[] {
    return db.prepare("SELECT * FROM movimento_estoque WHERE id_produto = ? ORDER BY data_hora DESC").all(idProduto) as MovimentoEstoque[];
  }

  listarPorFuncionario(idFuncionario: number): MovimentoEstoque[] {
    return db.prepare("SELECT * FROM movimento_estoque WHERE id_funcionario = ?").all(idFuncionario) as MovimentoEstoque[];
  }

  listarPorTipo(tipo: string): MovimentoEstoque[] {
    return db.prepare("SELECT * FROM movimento_estoque WHERE tipo_movimentacao = ?").all(tipo) as MovimentoEstoque[];
  }
}