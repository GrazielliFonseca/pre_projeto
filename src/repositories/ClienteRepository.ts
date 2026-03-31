import db from "../database/database";
import { Cliente } from "../models/Cliente";

export interface ClienteOferta {
  nome: string;
  ultima_compra: string;
  total_gasto: number;
  perfil_estilo: string;
  fidelidade: string; // Nome da categoria
  beneficio: string;
}

export class ClienteRepository {
  criarConta(cliente: Partial<Cliente>): Cliente {
    const resultado = db.prepare(`
      INSERT INTO cliente (nome, cpf, telefone, data_nasc, senha, id_categoria, total_gasto)
      VALUES (?, ?, ?, ?, ?, 1, 0) -- id_categoria 1 é 'Casual' por padrão
    `).run(
      cliente.nome,
      cliente.cpf,
      cliente.telefone,
      cliente.data_nasc,
      cliente.senha
    );
    return {
      ...cliente,
      id: Number(resultado.lastInsertRowid),
      id_categoria: 1,
      total_gasto: 0
    } as Cliente;
  }

  login(email: string, senha: string): Cliente | null {
    return db.prepare("SELECT * FROM cliente WHERE email = ? AND senha = ?")
             .get(email, senha) as Cliente ?? null;
  }

  atualizarCategoriaCliente(idCliente: number): void {
    const cliente = db.prepare("SELECT total_gasto FROM cliente WHERE id = ?").get(idCliente) as { total_gasto: number };

    if (!cliente) return;

    let novaCategoria = 1; // Casual

    if (cliente.total_gasto >= 300) {
      novaCategoria = 3; // Elite 
    } else if (cliente.total_gasto >= 150) {
      novaCategoria = 2; // Premium 
    }

    db.prepare("UPDATE cliente SET id_categoria = ? WHERE id = ?")
      .run(novaCategoria, idCliente);

    console.log(`[Status] Categoria do cliente ${idCliente} verificada/atualizada.`);
  }

  buscarPorId(id: number) {
    const cliente = db.prepare("SELECT * FROM cliente WHERE id = ?").get(id);
    
    if (!cliente) return null;
    
    return cliente; 
  }

//Adm
  listarClientesInativos(): ClienteOferta[] {
    const sql = `
      SELECT 
        c.nome, 
        c.data_ultima_compra AS ultima_compra, 
        c.total_gasto, 
        c.perfil_estilo, 
        cat.nome AS fidelidade, 
        cat.beneficios AS beneficio
      FROM cliente c
      JOIN categoria cat ON c.id_categoria = cat.id
      WHERE DATEDIFF(CURRENT_DATE, c.data_ultima_compra) > 35
    `;

    const clientes = db.prepare(sql).all() as ClienteOferta[];
    return clientes;
  }

  enviarOferta(): void {
    const clientes = this.listarClientesInativos();

    clientes.forEach(cliente => {
      const mensagem = `Olá! Sentimos sua falta. Confira nossas novidades!`;
    });
  }
}