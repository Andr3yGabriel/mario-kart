const readline = require('readline');

// Cria uma interface de leitura
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Faz uma pergunta ao usuário
rl.question('Qual é o seu nome?\n', (name) => {
  console.log(`Olá, ${name}!`);

  // Fecha a interface de leitura
  rl.close();
});
