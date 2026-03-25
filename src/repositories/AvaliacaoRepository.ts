import db from "../database/database";
import { Avaliacao } from "../models/Avaliacao";

export class AvaliacaoRepository {
  salvar(avaliacao: Avaliacao): Avaliacao {
    const resultado = db
      .prepare("INSERT INTO avaliacoes (id_cliente, id_produto, estrelas, descricao) VALUES (?, ?, ?, ?)")
      .run(avaliacao.id_cliente, avaliacao.id_produto, avaliacao.estrelas, avaliacao.descricao);

    return { id: Number(resultado.lastInsertRowid), id_cliente: avaliacao.id_cliente, id_produto: avaliacao.id_produto, estrelas: avaliacao.estrelas, descricao: avaliacao.descricao 
    };
  }
}

listar(): Avaliacao[] {
  const resultado = db.prepare("SELECT * FROM avaliacoes").all() as Avaliacao[];
  return resultado;
}

listarPorEstrelas(estrelas: number): Avaliacao[] {
  const resultado = db.prepare("SELECT * FROM avaliacao WHERE estrelas = ?").all(estrelas) as Avaliacao[];
  return resultado;
}
