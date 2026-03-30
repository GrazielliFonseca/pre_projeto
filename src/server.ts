import express from "express";

import { AvaliacaoController } from "./controllers/AvaliacaoController";
import { CategoriaClienteController } from "./controllers/CategoriaClienteController";
import { ClienteController } from "./controllers/ClienteController";
import { FornecedorController} from "./controllers/FornecedorController";
import { FuncionarioController } from "./controllers/FuncionarioController";
import { ItensPedidoController } from "./controllers/ItensPedidoController";
import { MovimentoEstoqueController} from "./controllers/MovimentosEstoqueController";
import { PedidoController } from "./controllers/PedidoController";
import { ProdutoController } from "./controllers/ProdutoController";


export const app = express();

app.use(express.json());

AvaliacaoController();
CategoriaClienteController();
ClienteController();
FornecedorController();
FuncionarioController();
ItensPedidoController();
MovimentoEstoqueController();
PedidoController();
ProdutoController();


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});