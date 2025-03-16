document.addEventListener("DOMContentLoaded", () => {
    iniciarCronometro(120); // Define o tempo para 2 minutos (120 segundos)
    setInterval(moverFantasmas, 1000);
    const gameContainer = document.getElementById("game-container");

    const recorde = localStorage.getItem("recorde") || 0;
    document.getElementById("recorde").innerText = `Recorde: ${recorde}`;

    const labirinto = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    let pacmanX = 1;
    let pacmanY = 1;
    let score = 0;
    let frutas = [];
    let fantasmas = [
        { x: 3, y: 1, color: "red" },
        { x: 3, y: 3, color: "black" }
    ];

    let dots = [];

    function inicializarBolinhas() {
        dots = [];
        for (let y = 0; y < labirinto.length; y++) {
            for (let x = 0; x < labirinto[y].length; x++) {
                if (labirinto[y][x] === 0) {
                    dots.push({ x, y });
                }
            }
        }
    }

    function desenharLabirinto() {
        gameContainer.innerHTML = "";

        for (let y = 0; y < labirinto.length; y++) {
            for (let x = 0; x < labirinto[y].length; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell", labirinto[y][x] === 1 ? "wall" : "path");
                gameContainer.appendChild(cell);
            }
        }

        // Renderizar bolinhas
        dots.forEach(dot => {
            const dotElement = document.createElement("div");
            dotElement.classList.add("dot");
            dotElement.style.top = dot.y * 42 + 16 + "px";
            dotElement.style.left = dot.x * 42 + 16 + "px";
            gameContainer.appendChild(dotElement);
        });

        // Renderizar frutas
        frutas.forEach(fruit => {
            const fruitElement = document.createElement("div");
            fruitElement.classList.add("fruit");
            fruitElement.style.top = fruit.y * 42 + 16 + "px";
            fruitElement.style.left = fruit.x * 42 + 16 + "px";
            gameContainer.appendChild(fruitElement);
        });

        // Renderizar Pac-Man
        const pacman = document.createElement("div");
        pacman.id = "pacman";
        pacman.style.top = pacmanY * 42 + "px";
        pacman.style.left = pacmanX * 42 + "px";
        gameContainer.appendChild(pacman);

        // Renderizar fantasmas
        fantasmas.forEach(fantasma => {
            const ghost = document.createElement("div");
            ghost.classList.add("ghost");
            ghost.style.backgroundColor = fantasma.color;
            ghost.style.top = fantasma.y * 42 + "px";
            ghost.style.left = fantasma.x * 42 + "px";
            gameContainer.appendChild(ghost);
        });

        fantasmas.forEach(fantasma => {
            const ghost = document.createElement("div");
            ghost.classList.add("ghost");
            ghost.style.backgroundColor = `rgba(155, 233, 145, 0.7)`; // Transparente
            ghost.style.top = fantasma.y * 42 + "px";
            ghost.style.left = fantasma.x * 42 + "px";

            // Pupilas (dinamicamente adicionadas)
            const pupilLeft = document.createElement("div");
            pupilLeft.classList.add("pupil");
            ghost.appendChild(pupilLeft);

            const pupilRight = document.createElement("div");
            pupilRight.classList.add("pupil");
            ghost.appendChild(pupilRight);

            gameContainer.appendChild(ghost);
        });

        dots = dots.filter(dot => {
            if (dot.x === pacmanX && dot.y === pacmanY) {
                score += 10; // Incrementa a pontuação
                return false;
            }
            return true;
        });
        document.getElementById("score").innerText = `Pontuação: ${score}`;
    }

    function inicializarFrutas() {
        frutas = [];
        let x, y;
        do {
            x = Math.floor(Math.random() * labirinto[0].length);
            y = Math.floor(Math.random() * labirinto.length);
        } while (labirinto[y][x] !== 0 || frutas.some(fruit => fruit.x === x && fruit.y === y));
        frutas.push({ x, y });
    }


    function moverPacman(dx, dy) {
        const novoX = pacmanX + dx;
        const novoY = pacmanY + dy;

        if (labirinto[novoY][novoX] === 0) {
            pacmanX = novoX;
            pacmanY = novoY;

            //Comer Bolinhas
            dots = dots.filter(dot => {
                if (dot.x === pacmanX && dot.y === pacmanY) {
                    score += 10;
                    return false;
                }
                return true;
            });

            // Verifica se todas as bolinhas foram comidas
            if (dots.length === 0) {
                fimDeJogo("Campeão!"); // Exibe mensagem e encerra o jogo
                return;
            }

            // Comer frutas
            frutas = frutas.filter(fruit => {
                if (fruit.x === pacmanX && fruit.y === pacmanY) {
                    score *= 2; // Dobra a pontuação
                    setTimeout(() => {
                        inicializarFrutas(); // Gera nova fruta após o intervalo
                        desenharLabirinto(); // Atualiza o labirinto para desenhar a nova fruta
                    }, 3000); // 3000ms = 3 segundos
                    return false; // Remove a fruta do labirinto
                }
                return true;
            });

            desenharLabirinto();
        }

        fantasmas.forEach(fantasma => {
            if (fantasma.x === pacmanX && fantasma.y === pacmanY) {
                alert("Game Over!");
                reiniciarJogo();
            }
        });
    }

    function moverFantasmas() {
        fantasmas.forEach(fantasma => {
            let direcoesPossiveis = [];

            if (labirinto[fantasma.y - 1] && labirinto[fantasma.y - 1][fantasma.x] === 0) direcoesPossiveis.push("up");
            if (labirinto[fantasma.y + 1] && labirinto[fantasma.y + 1][fantasma.x] === 0) direcoesPossiveis.push("down");
            if (labirinto[fantasma.y][fantasma.x - 1] === 0) direcoesPossiveis.push("left");
            if (labirinto[fantasma.y][fantasma.x + 1] === 0) direcoesPossiveis.push("right");

            if (direcoesPossiveis.length > 0) {
                let novaDirecao = direcoesPossiveis[Math.floor(Math.random() * direcoesPossiveis.length)];

                switch (novaDirecao) {
                    case "up":
                        fantasma.y--;
                        break;
                    case "down":
                        fantasma.y++;
                        break;
                    case "left":
                        fantasma.x--;
                        break;
                    case "right":
                        fantasma.x++;
                        break;
                }
            }

            if (fantasma.x === pacmanX && fantasma.y === pacmanY) {
                alert("Game Over!");
                reiniciarJogo();
            }
        });

        desenharLabirinto();
    }

    function reiniciarJogo() {
        pacmanX = 1;
        pacmanY = 1;
        score = 0;
        inicializarBolinhas();
        desenharLabirinto();
    }

    document.addEventListener("keydown", (event) => {
        if (event.key.startsWith("Arrow")) {
            const moves = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
            moverPacman(...moves[event.key]);
        }
    });

    function iniciarCronometro(duracao) {
        let tempoRestante = duracao; // Tempo total em segundos (2 minutos = 120 segundos)

        const intervalo = setInterval(() => {
            const minutos = Math.floor(tempoRestante / 60); // Calcula minutos
            const segundos = tempoRestante % 60; // Calcula segundos

            // Atualiza o elemento do cronômetro na tela
            document.getElementById("timer").innerText =
                `Tempo Restante: ${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;

            if (tempoRestante <= 0) {
                clearInterval(intervalo); // Para o temporizador
                alert(`Tempo Esgotado! Sua pontuação final foi: ${score}`);
                reiniciarJogo(); // Reinicia o jogo
            }

            tempoRestante--; // Reduz o tempo em 1 segundo
        }, 1000); // Executa a cada segundo
    }

    function fimDeJogo(mensagem) {
        alert(`${mensagem} Sua pontuação final foi: ${score}`);
        
        // Obter o recorde atual do localStorage
        const recordeAtual = localStorage.getItem("recorde") || 0;
    
        // Verifica se o novo recorde foi batido
        if (score > recordeAtual) {
            localStorage.setItem("recorde", score); // Salva o novo recorde
            document.getElementById("recorde").innerText = `Recorde: ${score}`; // Atualiza na tela
    
            // Toca o som de novo recorde
            const somNovoRecorde = document.getElementById("novoRecordeSom");
            somNovoRecorde.play();
    
            alert("Novo Recorde! 🎉");
        }
        reiniciarJogo(); // Reinicia o jogo
    }
    inicializarBolinhas();
    desenharLabirinto();
    inicializarFrutas();
});