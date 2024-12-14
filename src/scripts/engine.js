const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    action:{

        button: document.getElementById('next-duel'),

    },
    playerSides : {
        player1: 'player-cards',
        player1BOX:  document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBOX:  document.querySelector('#computer-cards')
    },
}
const playerSides = {
    player1: 'player-cards',

    computer: 'computer-cards',


}
const pathImage = "./src/assets/icons/"
const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: "Paper",
        img: `${pathImage}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },

    {
        id: 1,
        name: 'Dark Magician',
        type: "Rock",
        img: `${pathImage}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },

    {
        id: 2,
        name: 'Exodia',
        type: "Scissors",
        img: `${pathImage}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
]



async function createCardImage(IdCard,fieldCards) {
    const cardImage = document.createElement('img')
    cardImage.setAttribute('height'," 100px");
cardImage.setAttribute('src', "./src/assets/icons/card-back.png");
cardImage.setAttribute('data-id',IdCard);
cardImage.classList.add("card")

if(fieldCards == playerSides.player1){
    cardImage.addEventListener("click", () =>{
        setCardsFields(cardImage.getAttribute('data-id'))
        
    })
    cardImage.addEventListener("mouseover", () =>{
        drawSelectCard(IdCard);
    })
}
 
    

    return cardImage;
}
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
    
}

async function drawSelectCard(index) {
        state.cardSprites.avatar.src = cardData[index].img;
        state.cardSprites.name.innerText = cardData[index].name;
        state.cardSprites.type.innerHTML = "Atribute: " + cardData[index].type
}

async function drawCards(cardNumber, fieldSide) {
    for( let i = 0; i <cardNumber; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        
        

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}
async function setCardsFields(cardId) {
    await removeAllCardsimages()


    let computerCardId = await getRandomCardId();
    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    state.cardSprites.name.innerText=""
    state.cardSprites.type.innerText=""
    state.cardSprites.avatar.src=""

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore();

    await drawButton(duelResults)
}

async function drawButton(text) {
    state.action.button.innerText = text.toUpperCase();
    state.action.button.style.display = 'block'
}
async function updateScore() {
    state.score.scoreBox.innerHTML = `Win:${state.score.playerScore} | Lose:${state.score.computerScore}`
}

async function removeAllCardsimages() {
    let {computerBOX, player1BOX} = state.playerSides
    let imgelements = computerBOX.querySelectorAll('img')
    imgelements.forEach((img) =>{
        img.remove()
    })

   
    imgelements = player1BOX.querySelectorAll('img')
    imgelements.forEach((img) =>{
        img.remove()
    })
}

async function resetDuel() {
    state.cardSprites.avatar.src = ''
    state.action.button.style.display ='none'

    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'

    init()
    
}
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "empate"

    let playerCard = cardData[playerCardId];
    if (playerCard.WinOf.includes(computerCardId)){
        duelResults= "win"
        state.score.playerScore++
        

    }
    if( playerCard.LoseOf.includes(computerCardId)){
            duelResults= "lose"
            state.score.computerScore++
            

        }
        await playAudio(duelResults)

        return duelResults
    }


async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.volume = 1

    try {
        audio.play();
    } catch  {
        
    }
 


}


const bgm = document.getElementById("bgm").play();






function init(){
    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)

    
}

init()
