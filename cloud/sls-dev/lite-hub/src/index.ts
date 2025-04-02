import { HttpController } from "./controller/http-controller";
import { LambdaController } from "./controller/lambda-controller";
import { WSController } from "./controller/ws-controller";

const httpController = new HttpController();
const lambdaController = new LambdaController();
const wsController = new WSController();

httpController.init();
lambdaController.init();
wsController.init();
