import db from "../database/database";
import { Avaliacao } from "../models/Avaliacao";

export class AvaliacaoRepository {
  salvar(avaliacao: Avaliacao): Avaliacao {
    const resultado = db
      .prepare("INSERT INTO avaliacoes (id_cliente, id_produto, estrelas, descricao) VALUES (?, ?, ?, ?)")
      .run(avaliacao.id_cliente, avaliacao.id_produto, avaliacao.estrelas, avaliacao.descricao);

    return { 
      ...avaliacao, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listarPorProduto(idProduto: number): Avaliacao[] {
    return db
      .prepare("SELECT * FROM avaliacoes WHERE id_produto = ? ORDER BY id DESC")
      .all(idProduto) as Avaliacao[];
  }

  listar(): Avaliacao[] {
    return db.prepare("SELECT * FROM avaliacoes").all() as Avaliacao[];
  }
}