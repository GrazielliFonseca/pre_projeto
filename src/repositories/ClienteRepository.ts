import db from "../database/database";
import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  
  cadastrar(cliente: Cliente): Cliente {
    const resultado = db.prepare(`
      INSERT INTO clientes (nome, cpf, senha, email, telefone, endereco, data_nasc, id_categoria, perfil_estilo, total_gasto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      cliente.nome,
      cliente.cpf,
      cliente.senha,
      cliente.email,
      cliente.telefone,
      cliente.rua,
      cliente.numero,
      cliente.bairro,
      cliente.cidade,
      cliente.cep,
      cliente.data_nasc,
      cliente.id_categoria,
      cliente.perfil_estilo || 'casual'
    );

    return {
      ...cliente,
      id: Number(resultado.lastInsertRowid)
    };
  }

  autenticar(email: string, senha: string): Cliente | null {
    return db.prepare("SELECT * FROM clientes WHERE email = ? AND senha = ?")
             .get(email, senha) as Cliente ?? null;
  }

  buscarPorCpf(cpf: string): Cliente | null {
    return db.prepare("SELECT * FROM clientes WHERE cpf = ?")
             .get(cpf) as Cliente ?? null;
  }

  // Aqui o 'id_categoria' representa Casual (1), Premium (2) ou Elite (3)
  atualizarNivelFidelidade(idCliente: number, novaCategoria: number): void {
    db.prepare("UPDATE clientes SET id_categoria = ? WHERE id = ?")
      .run(novaCategoria, idCliente);
  }

 
  listarClientesParaMarketing(perfil: string, gastoMinimo: number): Cliente[] {
    return db.prepare(`
      SELECT * FROM clientes 
      WHERE perfil_estilo = ? AND total_gasto >= ?
      ORDER BY total_gasto DESC
    `).all(perfil, gastoMinimo) as Cliente[];
  }
}