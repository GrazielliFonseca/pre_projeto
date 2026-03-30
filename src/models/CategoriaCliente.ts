export interface Categoria {
  id?: number;
  nome: string;
  beneficios: string;
  valor_minimo: number;
  desconto: number;
}

export const CAT_CASUAL: Categoria = { nome: "Casual", beneficios: "Sem benefícios extras", valor_minimo: 0.0, desconto: 0.0 };
export const CAT_PREMIUM: Categoria = { nome: "Premium", beneficios: "10% de desconto", valor_minimo: 150.0, desconto: 0.1 };
export const CAT_ELITE: Categoria = { nome: "Elite", beneficios: "Frete grátis e 20% de desconto", valor_minimo: 300.0, desconto: 0.2 };

export interface Cliente {
  nome_completo: string;
  total_gasto: number;
  categoria: Categoria;
}