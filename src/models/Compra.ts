export interface Compra {
  id?: number;
  cep: string;
  numero_casa: string;
  frete: number;
  forma_pagamento: string;
  quantidade: number;
  status: string;
  data: string | Date;
}