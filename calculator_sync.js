const soap = require("soap");
const url = "http://www.dneonline.com/calculator.asmx?WSDL";
const args = process.argv.slice(2);

function operation(url, intA, intB, op) {
  soap.createClient(url, (erro, cliente) => {
    if (erro) {
      return console.error("Erro ao criar cliente SOAP:", erro);
    }

    const parametros = { intA, intB };
    let metodo;

    switch (op) {
      case "adicionar":
        metodo = "Add";
        break;
      case "subtrair":
        metodo = "Subtract";
        break;
      case "multiplicar":
        metodo = "Multiply";
        break;
      case "dividir":
        metodo = "Divide";
        break;
      default:
        return console.error("Operação inválida. Use: adicionar, subtrair, multiplicar, dividir");
    }

    cliente[metodo](parametros, (erro, resultado) => {
      if (erro) {
        return console.error("Erro ao chamar o método SOAP:", erro);
      }

      console.log(`Resultado: ${Object.values(resultado)[0]}`);
    });
  });
}

operation(url, parseInt(args[0]), parseInt(args[1]), args[2]);
