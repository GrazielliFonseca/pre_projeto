import db from "../database/database";
import { Fornecedor } from "../models/Fornecedor";

export class FornecedorRepository {
  salvar(fornecedor: Fornecedor): Fornecedor {
    const resultado = db
      .prepare(`
        INSERT INTO fornecedores (nome, cnpj, telefone, email) 
        VALUES (?, ?, ?, ?)
      `)
      .run(fornecedor.nome, fornecedor.cnpj, fornecedor.telefone, fornecedor.email);

    return { 
      ...fornecedor, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Fornecedor[] {
    return db.prepare("SELECT * FROM fornecedores").all() as Fornecedor[];
  }

  buscarPorId(id: number): Fornecedor | null {
    return (db.prepare("SELECT * FROM fornecedores WHERE id = ?").get(id) as Fornecedor) ?? null;
  }

  buscarPorCnpj(cnpj: string): Fornecedor | null {
    return (db.prepare("SELECT * FROM fornecedores WHERE cnpj = ?").get(cnpj) as Fornecedor) ?? null;
  }

  buscarPorNome(nome: string): Fornecedor[] {
    return db.prepare("SELECT * FROM fornecedores WHERE nome LIKE ?").all(`%${nome}%`) as Fornecedor[];
  }
}