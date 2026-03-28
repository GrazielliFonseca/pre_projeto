import db from "../database/database";
import { Avaliacao } from "../models/Avaliacao";

export class AvaliacaoRepository {
  criarAvaliacao(nomeDigitado: string, id_produto: number, nota: number, comentario: string) {
    const cliente = db.prepare("SELECT id FROM cliente WHERE nome = ?").get(nomeDigitado) as { id: number };

    if (!cliente) {
      throw new Error("Apenas clientes cadastrados podem avaliar produtos.");
    }

    const resultado =db.prepare(`
      INSERT INTO avaliacao (id_cliente, id_produto, estrelas, descricao) 
      VALUES (?, ?, ?, ?)
    `).run(cliente.id, id_produto, nota, comentario);

    return { 
      sucesso: true,
      id: Number(resultado.lastInsertRowid)
    };
  }

  listarAvaliacaoPorProduto(id_produto: number) {
  return db.prepare(`
    SELECT 
      c.nome, 
      a.estrelas AS nota, 
      a.descricao AS comentario,
      a.data_avaliacao
    FROM avaliacao a
    JOIN cliente c ON a.id_cliente = c.id
    WHERE a.id_produto = ?
    ORDER BY a.data_avaliacao DESC
  `).all(id_produto);
  }

  listarAvaliacao(): Avaliacao[] {
    return db.prepare("SELECT * FROM avaliacao").all() as Avaliacao[];
  }
}