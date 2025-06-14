const soap = require("soap");
const url = "http://www.dneonline.com/calculator.asmx?WSDL";
const argumentos = process.argv.slice(2);

async function operation(url, intA, intB, operacao) {
  try {
    const cliente = await soap.createClientAsync(url);
    const parametros = { intA, intB };
    let result;

    switch (operacao) {
      case "adicionar":
        result = await cliente.AddAsync(parametros);
        break;
      case "subtrair":
        result = await cliente.SubtractAsync(parametros);
        break;
      case "multiplicar":
        result = await cliente.MultiplyAsync(parametros);
        break;
      case "dividir":
        result = await cliente.DivideAsync(parametros);
        break;
      default:
        return console.error("Operação inválida. Use: adicionar, subtrair, multiplicar, dividir");
    }

    console.log(`Resultado: ${Object.values(result[0])[0]}`);
  } catch (erro) {
    console.error("Erro durante operação SOAP:", erro);
  }
}

operation(url, parseInt(argumentos[0]), parseInt(argumentos[1]), argumentos[2]);
