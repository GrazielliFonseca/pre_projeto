import db from "../database/database";
import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  salvar(cliente: Cliente): Cliente {
    const resultado = db
      .prepare(`
        INSERT INTO clientes (nome, cpf, email, telefone, endereco, data_nasc, id_categoria) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        cliente.nome,
        cliente.cpf,
        cliente.email,
        cliente.telefone,
        cliente.endereco,
        cliente.data_nasc,
        cliente.id_categoria
      );

    return { 
      ...cliente, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Cliente[] {
    return db.prepare("SELECT * FROM clientes").all() as Cliente[];
  }

  buscarPorId(id: number): Cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE id = ?").get(id) as Cliente) ?? null;
  }

  buscarPorNome(nome: string): Cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE nome LIKE ?").get(`%${nome}%`) as Cliente) ?? null;
  }
  
  buscarPorCpf(cpf: string): Cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE cpf = ?").get(cpf) as Cliente) ?? null;
  }
}