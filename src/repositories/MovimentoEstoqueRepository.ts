import db from "../database/database";
import { MovimentoEstoque } from "../models/MovimentoEstoque";

export class MovimentoEstoqueRepository {
  fazerMovimentacao(movimento: MovimentoEstoque): MovimentoEstoque {
    const resultado = db
      .prepare(`
        INSERT INTO movimento_estoque (id_produto, id_funcionario, tipo_movimentacao, qtd, data_hora) 
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        movimento.id_produto,
        movimento.id_funcionario,
        movimento.tipo_movimentacao,
        movimento.qtd,
        movimento.data_hora.toString()
      );

    return { 
      ...movimento, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

    listarMovimentacoes(): MovimentoEstoque[] {
      return db.prepare("SELECT * FROM movimento_estoque ORDER BY data_hora DESC").all() as MovimentoEstoque[];
    }
  }