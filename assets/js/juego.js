/* 

    * 2C = Two of Clubs
    * 2D = Two of Diamonds
    * 2H = Two of Hearts
    * 2S = Two of Spades

*/

const moduloBlackJack = (() => {
    'use strict' //Es una forma de decirle al compilador que revise el codigo de forma estricta

    let deck = [];

    //Tipos y especiales hace referencia a los tipos de cartas y a los comodines/especiales que existen de cada una de ellas 
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K']

    //Referencias del HTML
    const btnPedirCarta = document.querySelector('#btnPedirCarta'),
        btnPlantarse = document.querySelector('#btnPlantarse'),
        btnNuevoJuego = document.querySelector('#btnNuevoJuego'),
        puntuacionesHtml = document.querySelectorAll('h2 small'),
        divCartasJugadores = document.querySelectorAll('.divCartas')

    //Inicializar contadores y estado de los botones
    let puntosJugadores = [];
    btnPlantarse.disabled = true;
    btnPedirCarta.disabled = true;

    //Funcion para inicializar el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];

        for(let contador = 1; contador <= numJugadores; contador++){
            puntosJugadores.push(0);
        };

        puntuacionesHtml.forEach(puntuacion => puntuacion.innerText = 0);

        divCartasJugadores.forEach(divCartas => divCartas.innerHTML = '');

        btnNuevoJuego.disabled = true;
        btnPedirCarta.disabled = false;
        btnPlantarse.disabled = true;
    }

    //Crea el Deck, tomando en cuenta los array de tipos y especiales, donde genera cada nombre de carta y despues las desordena con ayuda de underscore y el metodo shuffle. Retorna el deck de cartas.
    const crearDeck = () => {
        deck = [];

        for(let tipo of tipos){
            
            for(let i = 2; i <= 10; i++){
                deck.push(i + tipo);
            }
            
            for(let especial of especiales){
                deck.push(especial + tipo)
            }
        }

        return _.shuffle(deck);
    }

    //Función encargada de pedir una carta al Deck y que retorna el nombre de la carta sin su valor. 
    // En caso de que el deck este vacio arroja un error.
    const pedirCarta = () => {
        if ( deck.length === 0 ){
            throw 'Error: No hay más cartas en el Deck';
        }

        return deck.pop()
    }

    //Recibe el nombre de la carta y extrae el valor que tiene asignado, ya sea del 1 al 10 o si es una As, J, Q y K
    //La regla que se sigue es la siguiente:
    //Revisa si el valor extraido no es un numero, si lo es entonces retorna el valor multiplicado por 1 para devolver un number y no un string
    //Si el valor no es un numero valida si es igual a A, si lo es entonces revisa si es el turno del jugador o del computador, de ser el jugador permite que eliga que valor quiere que tenga (11 o 1) si es computador lo hace en automatico
    const valorCarta = (carta = '', numJugador) => {
        const valor = carta.substring(0, carta.length - 1); //Los strings en Js pueden ser tratados como arrays.
        
        //Tomar en cuenta que J, K y Q tienen un valor de 10, a excepcion de A que vale 11
        if(!isNaN(valor)){
            return valor * 1;
        }

        if(valor != 'A'){
            return 10;
        }
        
        //Decide si es más propiado que el As valga 11 o 1 segun los puntos del jugador
        return (puntosJugadores[numJugador] + 11 <= 21) ? 11 : 1;
    }

    //Turno: 0 = primer jugador y el ultimo será la computador
    const sumarPuntaje = (carta, numTurno) => {
        puntosJugadores[numTurno] += valorCarta(carta, numTurno);
        puntuacionesHtml[numTurno].innerHTML = puntosJugadores[numTurno];

        return puntosJugadores[numTurno];
    }

    const insertarCarta = (carta, numTurno) => {
        const cartaNueva = document.createElement('img');
        cartaNueva.classList.add('carta');
        cartaNueva.src = `assets/cartas/${carta}.png`;
        divCartasJugadores[numTurno].append(cartaNueva);
    }

    //Genera los turnos de la computadora pidiendo cartas, tratando de obtener un numero mayor a puntosMinimos (puntuacion del usuario), siempre y cuando este sea menor a 21.
    const turnoComputadora = ( puntosMinimos ) => {
        let puntosComputadora = 0;
        
        do {
            const carta = pedirCarta();

            insertarCarta(carta, puntosJugadores.length - 1);
            puntosComputadora = sumarPuntaje(carta, puntosJugadores.length - 1);

        } while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );
    }

    // Función encarga de elegir un ganador segun la puntuación de la computadora y el jugador
    const elegirGanador = () => {
        let mensaje = '';
        const [puntosJugador, puntosComputadora] = puntosJugadores;

        if(puntosComputadora === puntosJugador){
            mensaje = 'Empate, nadie gana. Intenta de nuevo!';
        }else if(puntosComputadora > puntosJugador && puntosComputadora <= 21){
            mensaje = 'Perdiste, intenta de nuevo!';
        }else if(puntosJugador <= 21){
            mensaje = 'Ganaste, felicidades!';
        }else{
            mensaje = 'Perdiste, intenta de nuevo!';
        }

        alert(mensaje);
    }

    // ========================== Eventos al dar click en botones ==========================

    // Metodo encargado de esperar el click en el boton 'Pedir Carta' para generar un turno del jugador, asi como agregar la carta al front y actualizar la puntuación
    btnPedirCarta.addEventListener('click', () => {

        const carta = pedirCarta();

        insertarCarta(carta, 0)
        const puntosJugador = sumarPuntaje(carta, 0);
        
        btnNuevoJuego.disabled = false;
        btnPlantarse.disabled = false;

        if(puntosJugador > 21){
            btnPedirCarta.disabled = true;
            btnPlantarse.disabled = true;
            turnoComputadora(puntosJugador);
            setTimeout(() => {
                elegirGanador();
            }, 500)
        }else if(puntosJugador === 21){
            btnPedirCarta.disabled = true;
            btnPlantarse.disabled = true;

            turnoComputadora(puntosJugador);
            setTimeout(() => {
                elegirGanador();
            }, 500)
        }
    })

    //Metodo encargado de plantar al jugador y genera los turnos de la computadora para identificar si el jugador gana o pierde segun las puntuaciones
    btnPlantarse.addEventListener('click', () => {
        btnPedirCarta.disabled = true;
        btnPlantarse.disabled = true;

        const puntosJugador = puntosJugadores[0];

        turnoComputadora(puntosJugador);
            
        setTimeout(() => {
            elegirGanador();
        }, 500)
    })


    //Meotodo encargado de iniciar un nuevo juego limpiando la mesa de juego, creando un nuevo deck y reiniciando las puntuaciones
    btnNuevoJuego.addEventListener('click', () => {
        inicializarJuego();
    })

    // Lo que se se coloque dentro del return sera accesible fuera del modulo
    // Se pueden enviar las propiedades como un objeto literal para cambiar la forma en que se llaman, en caso de que sea necesario
    return {
        nuevoJuego: inicializarJuego,
    };
})();