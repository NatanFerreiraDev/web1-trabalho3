import { getTabelaPrice,
    calcularCoeficienteFinanciamento,
     calcularTaxaDeJuros,
     calcularFatorAplicado,
     calcularValorFuturo,
     calcularPrecoAPrazo,
     calcularPMT,
    getValorCorrigido,
    calcularValorAVoltar,
    converterJurosMensalParaAnual } from "./main.js";
    

function handleButtonClick(){

    let tableElement,numeroParcelas,  juros,valorFinanciado,valorFinal,mesesAVoltar,temEntrada, imprimir;

    tableElement = document.querySelector("#table-content");
    let box1Element = document.querySelector("#left-box");
    let box2Element = document.querySelector("#right-box");

    $("#submitButton").click(function (event) {
        numeroParcelas = document.querySelector("#parc").value;
        juros = document.querySelector("#itax").value;
        valorFinanciado = document.querySelector("#ipv").value;
        valorFinal = document.querySelector("#ipp").value;
        mesesAVoltar = document.querySelector("#ipb").value;
        temEntrada = document.querySelector("#idp").checked;   
        imprimir = document.querySelector("#ipr").checked;   

        var errorMessage = "";
        if (juros == 0 && valorFinal == 0) {
            errorMessage +=
            "<p>Taxa de juros e valor final não podem ser ambos nulos.</p>";
        }
        if (juros == 0 && $("#ipv").val() == 0) {
            errorMessage +=
            "<p>Taxa de juros e valor financiado não podem ser ambos nulos.</p>";
        }
        if ($("#ipv").val() == 0 && $("#ipp").val() == 0) {
            errorMessage +=
            "<p>Valor financiado e valor final não podem ser ambos nulos.</p>";
        }
        if (errorMessage != "") {
            $("#errorMessage").html(errorMessage);
            $("#errorMessage").show();
            $("#successMessage").hide();

        } else {
            $("#successMessage").show();
            $("#errorMessage").hide();

            let tabelaPrice, valorCorrigido, coeficienteFinanciamento;


            if(valorFinal == 0){
                coeficienteFinanciamento = calcularCoeficienteFinanciamento(juros, numeroParcelas);
                valorFinal = calcularValorFuturo(coeficienteFinanciamento,juros,valorFinanciado,numeroParcelas,temEntrada);
            }
            var minhaDiv = document.getElementById("div-box-nt");
            minhaDiv.style.display = "none";
            tabelaPrice = getTabelaPrice(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada);

            ExibeTabelaPrice(tabelaPrice, tableElement);
            valorCorrigido = getValorCorrigido(tabelaPrice,numeroParcelas,mesesAVoltar);

            ExibeBox1(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada, mesesAVoltar,box1Element);
            ExibeBox2(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada, valorCorrigido, box2Element);


        }

            
    });
}


function ExibeTabelaPrice(tabelaPrice, tableDocumentElement){

    let table = "";
 
   for(let i = 0; i < tabelaPrice.length; i++){
       if(i == 0){
           table += "<thead><tr>";
           tabelaPrice[i].forEach(function(element){
               table += `<th> ${element} </th>`;
                });
           table += "</tr></thead>";
       }else{
           table += "<tr>";
           tabelaPrice[i].forEach(function (element){
               table += `<td> ${element} </td>`;
           });
           table += "</tr>";
       }
   }

   tableDocumentElement.innerHTML = table;
   
}


function ExibeBox1(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada,mesesAVoltar,divElement){
    let valorParcelas = 0; 
    let jurosReal = 0;

    jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
    let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);

    jurosReal = jurosReal.toFixed(4);

    precoAPrazo = (precoAPrazo > 0) ? precoAPrazo : precoAVista * calcularCoeficienteFinanciamento;

    let jurosTotal = 0, totalPago = 0, amortizacaoTotal = 0, saldoDevedorTotal = precoAVista;
 
    let pmt = calcularPMT(precoAVista,coeficienteFinanciamento).toFixed(2);

     valorParcelas = (precoAPrazo / numParcelas).toFixed(2);

    let jurosUsado = taxaDeJuros > 0? taxaDeJuros : jurosReal;
    jurosUsado = jurosUsado;

    divElement.innerHTML = `<p>Parcelamento: ${numParcelas} </p>
    <p>Taxa: ${taxaDeJuros}% Ao Mês (${converterJurosMensalParaAnual(taxaDeJuros)}% Ao Ano) </p>
    <p>Valor Financiado: $ ${precoAVista} </p>
    <p>Valor Final: $ ${precoAPrazo}</p>
    <p>Meses a Voltar(Adiantados) ${mesesAVoltar} </p>
    <p>Valor a voltar(Adiantamento da dívida) $ ${calcularValorAVoltar(pmt,numParcelas,mesesAVoltar).toFixed(2)} </p>
    <p>Entrada: ${temEntrada ? "Sim" : "Não"} </p>`;

}

function ExibeBox2(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada,valorCorrigido,divElement){

    let text = "";

    let valorParcelas = 0; 
    let jurosReal = 0;

    let quantidadeParcelas = (temEntrada) ? (numParcelas - 1) : numParcelas;


    jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
    let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);


    jurosReal = jurosReal.toFixed(4);

    precoAPrazo = (precoAPrazo > 0) ? precoAPrazo : precoAVista * calcularCoeficienteFinanciamento;

    let jurosTotal = 0, totalPago = 0, amortizacaoTotal = 0, saldoDevedorTotal = precoAVista;
 
    let pmt = calcularPMT(precoAVista,coeficienteFinanciamento).toFixed(2);
 
     valorParcelas = (precoAPrazo / numParcelas).toFixed(2);

    let jurosUsado = taxaDeJuros > 0? taxaDeJuros : jurosReal;
    jurosUsado = jurosUsado;

    let juros = jurosUsado, amortizacao = 0, saldo = 0, saldoDevedor = precoAVista;


    let jurosEmbutido = ((precoAPrazo - precoAVista) / precoAVista) * 100;
    jurosEmbutido = jurosEmbutido.toFixed(2);
    let desconto = ((precoAPrazo - precoAVista) / precoAPrazo) * 100;
    desconto = desconto.toFixed(2);

    divElement.innerHTML = `
    <p> Prestação: $ ${pmt}</p>
    <p> Taxa Real:  ${jurosReal}%</p>
    <p> Coeficiente de Financiamento: ${coeficienteFinanciamento} </p>
    <p>Fator Aplicado: ${calcularFatorAplicado(temEntrada,numParcelas,coeficienteFinanciamento,taxaDeJuros)}</p>
    <p> Valor Corrigido: $ ${valorCorrigido} </p>
    <p> Juros Embutido: ${jurosEmbutido}% </p>
    <p> Desconto:  ${desconto}% </p>
    `;
}


handleButtonClick();
