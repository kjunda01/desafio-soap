const { performance } = require("perf_hooks");
const soap = require("soap");
const chalk = require("chalk");

const url = "http://www.dneonline.com/calculator.asmx?WSDL";

// Mapeia nomes amigáveis para os métodos do SOAP
const OPERACOES = {
  adicionar: "Add",
  subtrair: "Subtract",
  multiplicar: "Multiply",
  dividir: "Divide",
};

const opKeys = Object.keys(OPERACOES);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomOp = () => opKeys[randomInt(0, opKeys.length - 1)];

async function callAsync(client) {
  const intA = randomInt(0, 10);
  const intB = randomInt(0, 10);
  const opLabel = randomOp();
  const opMethod = OPERACOES[opLabel];
  const params = { intA, intB };

  try {
    const [result] = await client[`${opMethod}Async`](params);
    const resultado = result[`${opMethod}Result`];
    return chalk.green(`${intA} ${intB} ${opLabel} => Resultado: ${resultado}`);
  } catch (err) {
    return chalk.red(`${intA} ${intB} ${opLabel} => Erro: ${err.message}`);
  }
}

(async () => {
  const client = await soap.createClientAsync(url);

  console.log(chalk.blueBright("🔄 Executando 10 chamadas SÍNCRONAS..."));
  const startSync = performance.now();
  for (let i = 0; i < 10; i++) {
    const output = await callAsync(client);
    console.log(output);
  }
  const endSync = performance.now();
  console.log(chalk.cyan(`⏱️ Tempo total sync: ${(endSync - startSync).toFixed(0)}ms`));

  console.log(chalk.blueBright("\n⚡ Executando 10 chamadas ASSÍNCRONAS em paralelo..."));
  const startAsync = performance.now();
  const promises = Array.from({ length: 10 }, () => callAsync(client));
  const results = await Promise.all(promises);
  results.forEach((line) => console.log(line));
  const endAsync = performance.now();
  console.log(chalk.cyan(`⏱️ Tempo total async: ${(endAsync - startAsync).toFixed(0)}ms`));
})();
