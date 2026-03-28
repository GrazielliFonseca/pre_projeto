import db from "../database/database";
import { Fornecedor } from "../models/Fornecedor";

export class FornecedorRepository {
  cadastrarFornecedor(fornecedor: Fornecedor): Fornecedor {
    const resultado = db
      .prepare(`
        INSERT INTO fornecedor (nome, cnpj, telefone, email, prazo_pagto) 
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(fornecedor.nome, fornecedor.cnpj, fornecedor.telefone, fornecedor.email, fornecedor.prazo_pagto);

    return { 
      ...fornecedor, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Fornecedor[] {
    return db.prepare("SELECT * FROM fornecedor").all() as Fornecedor[];
  }

  editarFornecedor(fornecedor: Fornecedor): Fornecedor | null {
    const resultado = db
      .prepare(`
        UPDATE fornecedor
        SET nome = ?, cnpj = ?, telefone = ?, email = ?, prazo_pagto = ?
        WHERE id = ?
      `)
      .run(fornecedor.nome, fornecedor.cnpj, fornecedor.telefone, fornecedor.email, fornecedor.prazo_pagto, fornecedor.id);

    return resultado.changes > 0 ? fornecedor : null;
  }

  excluirFornecedor(id: number): boolean {
    const resultado = db.prepare("DELETE FROM fornecedor WHERE id = ?").run(id);
    return resultado.changes > 0;
  }
}