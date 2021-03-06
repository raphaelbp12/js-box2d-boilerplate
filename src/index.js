import { World } from './world.js'
import { WorldDrawer } from './worldDrawer.js'
import { GenericWebWorker } from './GenericWebWorker.js'

function init() {  

  var canvas = document.getElementById("canvas")
  var world = new WorldDrawer(30, canvas)

  let numPopulation = 1
  let population = []

  for(let i = 0; i < numPopulation; i++) {
    population.push(new World(0, 0, 30, canvas))
  }

  let ticks = 0
  let lastTickTime = 0


  let backwardOrForward = 0, leftOrRight = 0

  document.addEventListener('keydown', (event) => {
      let code = event.key;
      if(code == 'a' || code == 'ArrowLeft' ) //LEFT
        leftOrRight = -1
      if(code == 'd' || code == 'ArrowRight') //RIGHT
        leftOrRight = 1
      if(code == 'w' || code == 'ArrowUp') //FORWARD
        backwardOrForward = 1
      if(code == 's' || code == 'ArrowDown') //BACKWARD
        backwardOrForward = -1
  });
  document.addEventListener('keyup', (event) => {
    let code = event.key;
    if(code == 'a' || code == 'ArrowLeft' ) //LEFT
      leftOrRight = 0
    if(code == 'd' || code == 'ArrowRight') //RIGHT
      leftOrRight = 0
    if(code == 'w' || code == 'ArrowUp') //FORWARD
      backwardOrForward = 0
    if(code == 's' || code == 'ArrowDown') //BACKWARD
      backwardOrForward = 0
  });

  

  document.addEventListener('keydown', (event) => {
    let code = event.key;
    if(code == 'r') //LEFT
      update()
  });
  // window.setInterval(update, 1000 / 60);

  let gameoverCounter = 0

  update()
  
  //update  
  function update() {

    if (lastTickTime == 0)
      lastTickTime = performance.now();
    // world.update(true)

    let allWorlds = []

    let promises = []

    population.forEach((person, index) => {
      if(!person.gameover) {
        promises.push(person.update(true))
        // console.log('world update called', index)
      }
    })

    Promise.all(promises)
    .then((populationResolved) => {
      populationResolved.forEach((person) => {
        // console.log('person', person)
        allWorlds.push({car: person.car, gameover: person.gameover})
        if(person.gameover) {
          console.log('gameoverCounter incresed', gameoverCounter)
          gameoverCounter = gameoverCounter + 1
        }
      })

      // world.drawAllWorlds(allWorlds)
      // world.update()

      // console.log('update called', gameoverCounter, population.length)
  
      if(gameoverCounter < population.length) {
        console.log('ooveeer gameoverCounter', gameoverCounter)
        window.setTimeout(update, 10);
      } else if (gameoverCounter == population.length) {
        console.log('calculating new population')
        population.forEach((world) => {
          world.generateNewPop()
          world.gameover = false
          world.ticks = 0
          gameoverCounter = 0
          window.setTimeout(update, 10);
        })
      }

    })
    var t1 = performance.now();
    // console.log("Call to doSomething took " + (t1 - lastTickTime) + " milliseconds.")
    lastTickTime = t1
  };


};


      
init();