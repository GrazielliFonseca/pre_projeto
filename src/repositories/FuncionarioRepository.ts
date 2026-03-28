import db from "../database/database";
import { Funcionario } from "../models/Funcionario";

export class FuncionarioRepository {
  cadastrarFuncionario(funcionario: Funcionario): Funcionario {
    const resultado = db
      .prepare(`
        INSERT INTO funcionario (nome, cpf, email, cargo, senha, nivel_permissao) 
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        funcionario.nome,
        funcionario.cpf,
        funcionario.email,
        funcionario.cargo,
        funcionario.senha,
        funcionario.nivel_permissao
      );

    return { 
      ...funcionario, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Funcionario[] {
    return db.prepare("SELECT * FROM funcionario").all() as Funcionario[];
  }

  editarFuncionario(funcionario: Funcionario): Funcionario | null {
    const resultado = db
      .prepare(`
        UPDATE funcionario
        SET nome = ?, cpf = ?, email = ?, cargo = ?, senha = ?, nivel_permissao = ?
        WHERE id = ?
      `)
      .run(
        funcionario.nome,
        funcionario.cpf,
        funcionario.email,
        funcionario.cargo,
        funcionario.senha,
        funcionario.nivel_permissao,
        funcionario.id
      );

    return resultado.changes > 0 ? funcionario : null;
  }

  excluirFuncionario(id: number): boolean {
    const resultado = db
      .prepare(`DELETE FROM funcionario WHERE id = ?`).run(id);
    return resultado.changes > 0;
  }
}