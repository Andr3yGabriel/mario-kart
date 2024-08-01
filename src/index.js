const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const personagens = {
    Mario: {
      NOME: "Mario",
      VELOCIDADE: 4,
      MANOBRABILIDADE: 3,
      PODER: 3,
      PONTOS: 0
    },
    Luigi: {
      NOME: "Luigi",
      VELOCIDADE: 3,
      MANOBRABILIDADE: 4,
      PODER: 4,
      PONTOS: 0
    },
    Peach: {
        NOME: "Peach",
        VELOCIDADE: 3,
        MANOBRABILIDADE: 4,
        PODER: 2,
        PONTOS: 0
    },
    Yoshi: {
        NOME: "Yoshi",
        VELOCIDADE: 2,
        MANOBRABILIDADE: 4,
        PODER: 3,
        PONTOS: 0
    },
    Bowser: {
        NOME: "Bowser",
        VELOCIDADE: 5,
        MANOBRABILIDADE: 2,
        PODER: 5,
        PONTOS: 0
    },
    DonkeyKong: {
        NOME: "Donkey Kong",
        VELOCIDADE: 2,
        MANOBRABILIDADE: 2,
        PODER: 5,
        PONTOS: 0
    }
}

async function escolherPersonagem() {
    return new Promise((resolve) => {
      rl.question('Escolha um personagem (Opções disponíveis no readme): ', (character) => {
        const personagem = personagens[character];
        if (personagem) {
          resolve(personagem);
        } else {
          console.log('Personagem não encontrado. Tente novamente.');
          resolve(escolherPersonagem());
        }
      });
    });
  }

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock(){
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.33:
            result = "RETA";
            break;
        case random < 0.66:
            result = "CURVA";
            break;
        default:
            result = "CONFRONTO";
    }

    return result;
}

async function getConfrontEvent() {
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.33:
            result = "BOMBA";
            break;
        case random < 0.66:
            result = "CASCO";
            break
        default:
            result = "TURBO";
    }

    console.log(`O confronto da rodada vale um(a): ${result}`);
    return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`)
}

async function showScoreboard(character1, character2) {
    console.log("🔔 Placar atual:");
    console.log(`${character1.NOME}: ${character1.PONTOS}`);
    console.log(`${character2.NOME}: ${character2.PONTOS}`);
}

async function playRaceEngine(character1, character2){
    for(let round = 1; round <= 10; round++){ 
        console.log(`🏁 Rodada ${round}`)

        // sortear bloco
        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        // rolar os dados
        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        // teste de habilidade
        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if(block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

            await logRollResult(
                character1.NOME,
                "velocidade",
                diceResult1,
                character1.VELOCIDADE
            );

            await logRollResult(
                character2.NOME,
                "velocidade",
                diceResult2,
                character2.VELOCIDADE
            );
        }

        if(block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(
                character1.NOME,
                "manobrabilidade",
                diceResult1,
                character1.MANOBRABILIDADE
            );

            await logRollResult(
                character2.NOME,
                "manobrabilidade",
                diceResult2,
                character2.MANOBRABILIDADE
            );
        }

        if(block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.PODER;
            let powerResult2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`)

            let event  = await getConfrontEvent();
            switch (true) {
                case event === "BOMBA":
                    console.log("O perdedor do confronto perderá até 2 pontos!");
                    break;
                case event === "CASCO":
                    console.log("O perdedor do confronto perderá 1 ponto!");
                    break;
                default:
                    console.log("O vencedor do confronto ganhará 1 ponto!");
            }
            
            await logRollResult(
                character1.NOME,
                "poder",
                diceResult1,
                character1.PODER
            );

            await logRollResult(
                character2.NOME,
                "poder",
                diceResult2,
                character2.PODER
            );

            switch (true) {
                case powerResult1 > powerResult2 && character2.PONTOS > 1 && event === "BOMBA":
                    console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 2 pontos 💣`);
                    character2.PONTOS -= 2;
                    await showScoreboard(character1, character2);
                    break;
                case powerResult2 > powerResult1 && character1.PONTOS > 1 && event === "BOMBA":
                    console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 2 pontos 💣`);
                    character1.PONTOS -= 2;
                    await showScoreboard(character1, character2);
                    break;
                case powerResult1 > powerResult2 && character2.PONTOS === 1 && event === "BOMBA":
                    console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 ponto 💣`);
                    character2.PONTOS--;
                    await showScoreboard(character1, character2);
                    break;
                case powerResult2 > powerResult1 && character1.PONTOS === 1 && event === "BOMBA":
                    console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 ponto 💣`);
                    character1.PONTOS--;
                    await showScoreboard(character1, character2);
                    break;
                case powerResult1 > powerResult2 && character2.PONTOS > 0 && event === "CASCO":
                    console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 pontos 🐢`);
                    character2.PONTOS--;
                    await showScoreboard(character1, character2);
                    break;
                case powerResult2 > powerResult1 && character1.PONTOS > 0 && event === "CASCO":
                    console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 pontos 🐢`);
                    character1.PONTOS--;
                    await showScoreboard(character1, character2);
                    break;
                case powerResult1 > powerResult2 && event === "TURBO":
                    console.log(`${character1.NOME} venceu o confronto e ganhou 1 ponto 🚀`);
                    character1.PONTOS++;
                    await showScoreboard(character1, character2);
                    break;
                case powerResult2 > powerResult1 && event === "TURBO":
                    console.log(`${character2.NOME} venceu o confronto e ganhou 1 ponto 🚀`);
                    character2.PONTOS++;
                    await showScoreboard(character1, character2);
                    break;
                case powerResult1 === powerResult2:
                    console.log("Confronto empatado! Sem alterações no placar!");
                    await showScoreboard(character1, character2);
                    break;
                default:
                    await showScoreboard(character1, character2);
            }
        }

        if(totalTestSkill1 > totalTestSkill2) {
            console.log(`${character1.NOME} marcou 1 ponto!`);
            character1.PONTOS++;
            await showScoreboard(character1, character2)
        } else if (totalTestSkill2 > totalTestSkill1) {
            console.log(`${character2.NOME} marcou 1 ponto!`);
            character2.PONTOS++;
            await showScoreboard(character1, character2)
        } else if (totalTestSkill1 === totalTestSkill2 && block != "CONFRONTO") {
            console.log("Confronto empatado! Sem alterações no placar!");
            await showScoreboard(character1, character2);
        }

        console.log("-----------------------------------------------------");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado final:");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if(character1.PONTOS > character2.PONTOS)
        console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
    else if(character2.PONTOS > character1.PONTOS)
        console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
    else
        console.log("A corrida terminou empatada");
}

(async function main() {
    let player1 = await escolherPersonagem();
    console.log('Personagem escolhido para Player 1:\n', player1);

    let player2 = await escolherPersonagem();
    console.log('Personagem escolhido para Player 2:\n', player2);

    console.log(`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando ...\n`);

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);

    rl.close();
})();