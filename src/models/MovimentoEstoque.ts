export interface MovimentoEstoque {
  id?: number;
  id_produto: number;
  id_funcionario: number;
  tipo_movimentacao: string;
  qtd: number;
  data_hora: Date | string;
}