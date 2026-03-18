export interface Pedido {
  id?: number;
  id_cliente: number;
  data_hora: Date | string;
  valor_total: number;
  forma_pagto: string;
  status: string;
  entrega: string;
}