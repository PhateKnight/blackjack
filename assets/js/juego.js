/* 

    * 2C = Two of Clubs
    * 2D = Two of Diamonds
    * 2H = Two of Hearts
    * 2S = Two of Spades

*/

let deck = [];

//Tipos y especiales hace referencia a los tipos de cartas y a los comodines/especiales que existen de cada una de ellas 
const tipos = ['C', 'D', 'H', 'S'] 
const especiales = ['A', 'J', 'Q', 'K']

//Referencias del HTML
const btnPedirCarta = document.querySelector('#btnPedirCarta');
const btnPlantarse = document.querySelector('#btnPlantarse')
const btnNuevoJuego = document.querySelector('#btnNuevoJuego')
const puntuaciones = document.querySelectorAll('h2 small');
const puntuacionJugador = puntuaciones[0];
const puntuacionComputador = puntuaciones[1];
const divCartasJugador = document.querySelector('#jugador-cartas');
const divCartasComputador = document.querySelector('#computadora-cartas');

//Inicializar contadores y estado de los botones
let puntosJugador = 0;
let puntosComputadora = 0;
btnNuevoJuego.disabled = true;
btnPlantarse.disabled = true;

//Crea el Deck, tomando en cuenta los array de tipos y especiales, donde genera cada nombre de carta y despues las desordena con ayuda de underscore y el metodo shuffle. Retorna el deck de cartas.
const crearDeck = () => {

    for(let tipo of tipos){
        for(let i = 2; i <= 10; i++){
            deck.push(i + tipo);
        }
    }
    
    for(let tipo of tipos){
        for(let especial of especiales){
            deck.push(especial + tipo)
        }
    }

    deck = _.shuffle(deck);

    return deck;
}


//Función encargada de pedir una carta al Deck y que retorna el nombre de la carta sin su valor. 
// En caso de que el deck este vacio arroja un error.
const pedirCarta = () => {
    
    if ( deck.length === 0 ){
        throw 'Error: No hay más cartas en el Deck';
    }

    const carta = deck.pop()

    return carta;
}

//Recibe el nombre de la carta y extrae el valor que tiene asignado, ya sea del 1 al 10 o si es una As, J, Q y K
//La regla que se sigue es la siguiente:
//Revisa si el valor extraido no es un numero, si lo es entonces retorna el valor multiplicado por 1 para devolver un number y no un string
//Si el valor no es un numero valida si es igual a A, si lo es entonces retorna 11 y sino entonces 10
const valorCarta = (carta = '') => {
    const valor = carta.substring(0, carta.length - 1); //Los strings en Js pueden ser tratados como arrays.
    
    //Tomar en cuenta que J, K y Q tienen un valor de 10, a excepcion de A que vale 11
    if(!isNaN(valor)){
        return valor * 1;
    }

    if(valor != 'A'){
        return 10;
    }

    let desicionAs = confirm("¿Desea que el As valga 11? (En caso negativo, valdra 1)", false)
    return (desicionAs) ? 11 : 1;
}

// Función encarga de elegir un ganador segun la puntuación de la computadora y el jugador
const elegirGanador = () => {
    let mensaje = '';

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

//Genera los turnos de la computadora pidiendo cartas, tratando de obtener un numero mayor a puntosMinimos (puntuacion del usuario), siempre y cuando este sea menor a 21.
const turnoComputadora = ( puntosMinimos ) => {
    do {
        const carta = pedirCarta();

        puntosComputadora += valorCarta(carta);
        puntuacionComputador.innerHTML = puntosComputadora;

        const cartaNueva = document.createElement('img');
        cartaNueva.classList.add('carta');
        cartaNueva.src = `assets/cartas/${carta}.png`;
        divCartasComputador.append(cartaNueva);

    } while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );
}

// Eventos al dar click en botones

// Metodo encargado de esperar el click en el boton 'Pedir Carta' para generar un turno del jugador, asi como agregar la carta al front y actualizar la puntuación
btnPedirCarta.addEventListener('click', () => {

    const carta = pedirCarta();

    puntosJugador += valorCarta(carta);
    puntuacionJugador.innerHTML = puntosJugador;

    const cartaNueva = document.createElement('img');
    cartaNueva.classList.add('carta');
    cartaNueva.src = `assets/cartas/${carta}.png`;
    divCartasJugador.append(cartaNueva);

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

    turnoComputadora(puntosJugador);
           
    setTimeout(() => {
        elegirGanador();
    }, 500)
})


//Meotodo encargado de iniciar un nuevo juego limpiando la mesa de juego, creando un nuevo deck y reiniciando las puntuaciones
btnNuevoJuego.addEventListener('click', () => {
    deck = []
    deck = crearDeck();

    puntosComputadora = 0;
    puntosJugador = 0;
    puntuacionComputador.innerHTML = puntosComputadora
    puntuacionJugador.innerHTML = puntosJugador

    divCartasComputador.innerHTML = '';
    divCartasJugador.innerHTML = '';

    btnNuevoJuego.disabled = true;
    btnPedirCarta.disabled = false;
    btnPlantarse.disabled = true;
})

crearDeck();