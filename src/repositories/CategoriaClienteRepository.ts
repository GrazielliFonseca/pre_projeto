import { Cliente, Categoria, CAT_ELITE, CAT_PREMIUM, CAT_CASUAL } from "../models/CategoriaCliente";

export function atualizarCategoria(cliente: Cliente): void {
  let novaCategoria: Categoria;

  if (cliente.total_gasto >= CAT_ELITE.valor_minimo) {
    novaCategoria = CAT_ELITE;
  } else if (cliente.total_gasto >= CAT_PREMIUM.valor_minimo) {
    novaCategoria = CAT_PREMIUM;
  } else {
    novaCategoria = CAT_CASUAL;
  }

  if (cliente.categoria.nome !== novaCategoria.nome) {
    cliente.categoria = novaCategoria;
    
    console.log(`--- Atualização: ${cliente.nome_completo} agora é ${novaCategoria.nome}! ---`);
  }
}