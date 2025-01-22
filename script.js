// Adicione os sons
const jumpSound = new Audio('jump2.mp3'); // Som de pulo
const hitSound = new Audio('hit.mp3');   // Som de colisão
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "flappy-bird-set.png";

// general settings
let gamePlaying = false;
const gravity = .5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

// Detecção de colisão com som
const render = () => {
    index++;
  
    // Desenho do fundo
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
    if (gamePlaying) {
      pipes.map(pipe => {
        pipe[0] -= speed;
  
        // Desenho dos canos
        ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
        ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);
  
        // Remover e criar novos canos
        if (pipe[0] <= -pipeWidth) {
          currentScore++;
          bestScore = Math.max(bestScore, currentScore);
          pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
        }
  
        // Verificar colisão
        if ([pipe[0] <= cTenth + size[0], pipe[0] + pipeWidth >= cTenth, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]].every(elem => elem)) {
          hitSound.play(); // Toca o som de colisão
          gamePlaying = false;
          setup();
        }
      });
  
      // Atualizar posição do pássaro
      ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  
        // Adiciona texto sobre o pássaro
        const birdTextX = cTenth + size[0] / 2; // Centro horizontal do pássaro
        const birdTextY = flyHeight - 10; // Posição vertical acima do pássaro
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "white"; // Cor do texto
        ctx.fillText("Held", birdTextX, birdTextY); // Desenha o texto sobre o pássaro

        // Restaurar alinhamento padrão para outros textos
        ctx.textAlign = "start"; // Alinha à esquerda para textos padrão
  
      // Verificar se o pássaro caiu no chão
      if (flyHeight >= canvas.height - size[1]) {
        hitSound.play(); // Toca o som de colisão
        gamePlaying = false;
        setup();
      }
    } else {
      ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
      flyHeight = (canvas.height / 2) - (size[1] / 2);
  
      // Mensagens iniciais
      ctx.fillText(`Valor Coletado R$: ${bestScore}`, 30, 245);
      ctx.fillText('Clique para procurar', 35, 478);
      ctx.fillText('as Hérnias de Disco', 40, 535);
      ctx.fillStyle = "white"; // Cor do texto
      ctx.font = "bold 30px courier";
    }
  
    document.getElementById('bestScore').innerHTML = `Carteira : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Ganhou : ${currentScore}`;
  
    window.requestAnimationFrame(render);
  };
  
// Configuração inicial
setup();
img.onload = render;

// Eventos de clique
// Eventos de clique
canvas.addEventListener('click', () => {
    if (!gamePlaying) {
      gamePlaying = true; // Inicia o jogo ao clicar pela primeira vez
    }
    flight = jump; // Faz o pássaro pular
    
    // Cria uma nova instância do som de pulo e toca imediatamente
    const jumpSoundInstance = new Audio('jump.mp3');
    jumpSoundInstance.play().catch(error => {
      console.error('Erro ao reproduzir o som de pulo:', error);
    });
  });
  
