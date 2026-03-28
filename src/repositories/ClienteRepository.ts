import db from "../database/database";
import { Cliente } from "../models/Cliente";

export interface ClienteOfertaDTO {
  nome: string;
  ultima_compra: string;
  total_gasto: number;
  perfil_estilo: string;
  fidelidade: string; // Nome da categoria (Ex: Elite)
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

    let novaCategoria = 1; // Casual (Padrão)

    if (cliente.total_gasto >= 300) {
      novaCategoria = 3; // Elite (20% desconto + Frete Grátis)
    } else if (cliente.total_gasto >= 150) {
      novaCategoria = 2; // Premium (10% desconto)
    }

    db.prepare("UPDATE cliente SET id_categoria = ? WHERE id = ?")
      .run(novaCategoria, idCliente);

    console.log(`[Status] Categoria do cliente ${idCliente} verificada/atualizada.`);
  }

//Adm
  listarClientesInativos(): ClienteOfertaDTO[] {
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

    const clientes = db.prepare(sql).all() as ClienteOfertaDTO[];
    return clientes;
  }

  enviarOferta(): void {
    const clientes = this.listarClientesInativos();

    clientes.forEach(cliente => {
      const mensagem = `Olá! Sentimos sua falta. Confira nossas novidades!`;
    });
  }
}