const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const palavrasPorLetra = {
  A: ["Abelha", "Amigo", "Amor"],
  B: ["Bola", "Bicho", "Bolo"],
  C: ["Cachorro", "Casa", "Copo"],
  // Adicione mais letras e palavras conforme desejar
};

let nomeUsuario = "";
let frase = [];
let palavraAtual = "";
let operacaoSelecionada = null;
let num1 = null;
let num2 = null;

function falar(texto) {
  const msg = new SpeechSynthesisUtterance(texto);
  msg.lang = 'pt-BR';
  window.speechSynthesis.speak(msg);
}

function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.add("escondido"));
  document.getElementById(id).classList.remove("escondido");
}

function abrirPalavras() {
  mostrarTela("tela-palavras");
  const container = document.getElementById("abecedario");
  container.innerHTML = "";

  letras.forEach(letra => {
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.onclick = () => escolherLetra(letra);
    container.appendChild(btn);
  });

  // Botão espaço
  const btnEspaco = document.createElement("button");
  btnEspaco.textContent = "Espaço";
  btnEspaco.onclick = () => {
    palavraAtual += " ";
    atualizarFrase();
    falar("espaço");
  };
  container.appendChild(btnEspaco);

  palavraAtual = "";
  frase = [];
  atualizarFrase();
}

function escolherLetra(letra) {
  palavraAtual += letra;
  falar(letra);
  atualizarFrase();
}

function lerPalavra() {
  if (palavraAtual.length > 0) {
    falar(`${nomeUsuario}, a palavra é ${palavraAtual}`);
  }
}

function limparPalavra() {
  palavraAtual = "";
  atualizarFrase();
  falar("Palavra apagada");
}

function atualizarFrase() {
  const fraseBox = document.getElementById("frase");
  fraseBox.textContent = frase.join(" ") + (palavraAtual ? " " + palavraAtual : "");
}

// ---------------------- NÚMEROS -----------------------------

function abrirNumeros() {
  mostrarTela("tela-numeros");
  operacaoSelecionada = null;
  num1 = null;
  num2 = null;
  document.getElementById("info-operacao").textContent = "Por favor, selecione uma operação.";
  document.getElementById("input-numeros").style.display = "none";
  document.getElementById("resultado").textContent = "";
  document.getElementById("numeros").innerHTML = "";
  document.getElementById("input-numero").value = "";
}

function selecionarOperacao(op) {
  operacaoSelecionada = op;
  document.getElementById("info-operacao").textContent = `Você escolheu: ${capitalizar(op)}. Agora digite o primeiro número.`;
  falar(`${nomeUsuario}, você escolheu ${capitalizar(op)}. Agora digite o primeiro número.`);

  const container = document.getElementById("numeros");
  container.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => escolherNumero(i);
    container.appendChild(btn);
  }
  document.getElementById("input-numeros").style.display = "block";

  num1 = null;
  num2 = null;
  document.getElementById("input-numero").value = "";
  document.getElementById("resultado").textContent = "";
}

function escolherNumero(n) {
  if (num1 === null) {
    num1 = n;
    falar(`${nomeUsuario}, você digitou o número ${n}. Agora digite o próximo número.`);
    document.getElementById("info-operacao").textContent = `Primeiro número: ${num1}. Agora digite o próximo número.`;
  } else if (num2 === null) {
    num2 = n;
    calcularResultado();
  }
}

function adicionarNumeroInput() {
  const input = document.getElementById("input-numero");
  const valor = input.value.trim();

  if (!valor || isNaN(valor)) {
    alert("Por favor, digite um número válido.");
    return;
  }

  const numero = Number(valor);

  if (num1 === null) {
    num1 = numero;
    falar(`${nomeUsuario}, você digitou o número ${numero}. Agora digite o próximo número.`);
    document.getElementById("info-operacao").textContent = `Primeiro número: ${num1}. Agora digite o próximo número.`;
    input.value = "";
  } else if (num2 === null) {
    num2 = numero;
    input.value = "";
    calcularResultado();
  }
}

function calcularResultado() {
  if (num1 === null || num2 === null || !operacaoSelecionada) return;

  let resultado;
  switch (operacaoSelecionada) {
    case 'soma':
      resultado = num1 + num2;
      break;
    case 'subtracao':
      resultado = num1 - num2;
      break;
    case 'multiplicacao':
      resultado = num1 * num2;
      break;
    case 'divisao':
      resultado = (num2 !== 0) ? num1 / num2 : "erro";
      if (resultado !== "erro" && Number.isInteger(resultado)) {
        // Deixa inteiro
      } else if (resultado !== "erro") {
        resultado = resultado.toFixed(2);
      }
      break;
  }

  const opSimbolo = simboloOperacao();
  const textoTela = `${nomeUsuario}, a ${capitalizar(operacaoSelecionada)} de ${num1} ${opSimbolo} ${num2} = ${resultado}`;
  const palavraFalada = operacaoSelecionada === "multiplicacao" ? "vezes" : opSimbolo;
  const textoFala = `${nomeUsuario}, a ${capitalizar(operacaoSelecionada)} de ${num1} ${palavraFalada} ${num2} é igual a ${resultado}`;

  document.getElementById("resultado").textContent = textoTela;
  falar(textoFala);
}

function simboloOperacao() {
  return {
    soma: "+",
    subtracao: "-",
    multiplicacao: "x",
    divisao: "÷"
  }[operacaoSelecionada];
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function limparOperacao() {
  abrirNumeros();
  falar("Operação apagada");
}

function voltarInicio() {
  mostrarTela("tela-inicial");
  frase = [];
  palavraAtual = "";
  num1 = null;
  num2 = null;
  operacaoSelecionada = null;
  document.getElementById("resultado").textContent = "";
  atualizarFrase();
}

// Pergunta o nome do usuário ao iniciar
window.onload = function () {
  let nome = prompt("Olá! Qual é o seu nome?");
  nomeUsuario = nome ? nome.trim() : "Usuário";
  voltarInicio();
};
