import db from "../database/database";
import { Funcionario } from "../models/Funcionario";

export class FuncionarioRepository {
  salvar(funcionario: Funcionario): Funcionario {
    const resultado = db
      .prepare(`
        INSERT INTO funcionarios (nome, cargo, nivel_permissao) 
        VALUES (?, ?, ?)
      `)
      .run(
        funcionario.nome,
        funcionario.cargo,
        funcionario.nivel_permissao
      );

    return { 
      ...funcionario, 
      id: Number(resultado.lastInsertRowid) 
    };
  }

  listar(): Funcionario[] {
    return db.prepare("SELECT * FROM funcionarios").all() as Funcionario[];
  }

  buscarPorId(id: number): Funcionario | null {
    return (db.prepare("SELECT * FROM funcionarios WHERE id = ?").get(id) as Funcionario) ?? null;
  }

  listarPorCargo(cargo: string): Funcionario[] {
    return db.prepare("SELECT * FROM funcionarios WHERE cargo = ?").all(cargo) as Funcionario[];
  }

  listarPorPermissao(nivel: string): Funcionario[] {
    return db.prepare("SELECT * FROM funcionarios WHERE nivel_permissao = ?").all(nivel) as Funcionario[];
  }

  atualizarDados(id: number, cargo: string, nivel: string): boolean {
    const resultado = db
      .prepare("UPDATE funcionarios SET cargo = ?, nivel_permissao = ? WHERE id = ?")
      .run(cargo, nivel, id);
    return resultado.changes > 0;
  }
}