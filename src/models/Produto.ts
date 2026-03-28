export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  categoria: string;
  tamanho: string;
  cor: string;
  marca: string;
  sku: string;
  qtd: number;
  estoque_min: number;
  custo: number;
  venda: number;
  margem: number;
  data_entrada: Date | string;
  id_funcionario: number;
  id_fornecedor: number;
}