var board = document.querySelector('#board')
var dice = 0
var diceResult = document.querySelector('#dice-result')
var cheat = document.querySelector('#cheat')
var player1 = document.createElement('div')
var effect = []
player1.setAttribute('class', 'player1')
var player2 = document.createElement('div')
player2.setAttribute('class', 'player2')

var currentTurn = 'p1'
var currentPos = {
  p1: 1, p2: 1
}

renderBoard()
renderCheat()

function renderCheat () {
  for (var i = 1; i <= 6; i++) {
    var button = document.createElement('button')
    button.setAttribute('onclick', `diceRollResult(${i})`)
    button.textContent = i
    cheat.appendChild(button)
  }
}

function renderBoard() {
  var count = 25
  var countOdd = 21
  for (var i = 1; i <= 5; i++) {
    var row = document.createElement('tr')
    for (var j = 1; j <= 5; j++) {
      var tiles = document.createElement('td')
      var br = document.createElement('br')
      var tilesNumber = document.createElement('div')
      var tilesPlayer = document.createElement('div')
      var tilesEffect = document.createElement('div')

      tilesNumber.setAttribute('name', 'tiles-number')
      tilesNumber.setAttribute('class', 'number')
      tilesNumber.setAttribute('data-x', j)
      tilesNumber.setAttribute('data-y', i)

      tilesPlayer.setAttribute('name', 'tiles-player')
      tilesPlayer.setAttribute('class', 'player')

      tilesEffect.setAttribute('name', 'tiles-effect')
      tilesEffect.setAttribute('class', 'effect')

      tiles.setAttribute('class', 'box')
      
      if (i%2 == 0) {
        tilesNumber.textContent = count
        tilesEffect.id = `effect-${count}`
        tilesNumber.id = `number-${count}`
        tilesPlayer.id = `player-${count}`
      } else {
        if (count == 15) {
          countOdd = 11
        } else if (count == 5) {
          countOdd = 1
        }
        tilesNumber.textContent = countOdd
        tilesEffect.id = `effect-${countOdd}`
        tilesNumber.id = `number-${countOdd}`
        tilesPlayer.id = `player-${countOdd}`
        if (countOdd == 1) {
          tilesEffect.textContent = 'Start'
          // tilesPlayer.textContent = ' p1  p2 '
          var p1 = document.createElement('span')
          p1.setAttribute('class', 'playerBox p1')
          p1.id = 'p1'
          p1.textContent = 'p1'
          var p2 = document.createElement('span')
          p2.setAttribute('class', 'playerBox p2')
          p2.textContent = 'p2'
          p2.id = 'p2'
          tilesPlayer.appendChild(p1)
          tilesPlayer.appendChild(p2)
        }
        if (countOdd == 25) {
          tilesEffect.textContent = 'Finish'
        }
        countOdd++
      }
      count--

      tiles.appendChild(tilesNumber)
      tiles.appendChild(br)
      tiles.appendChild(tilesPlayer)
      tiles.appendChild(br)
      tiles.appendChild(tilesEffect)
      tiles.appendChild(br)
      row.appendChild(tiles)
    }
    board.appendChild(row)
  }
}

function startGame () {
  document.getElementById('setEffect').style.display = 'none'
  document.getElementById('dice').style.display = 'block'
}

function diceRollResult (input) {
  if (input == 0) {
    diceRoll = Math.floor(Math.random()*6+1)
  } else {
    diceRoll = input
  }
  diceResult.textContent = diceRoll
  if (currentTurn == 'p1') {
    var player = document.getElementById(`player-${currentPos.p1}`)
    var prevPos1 = currentPos.p1
    var prevPos2 = currentPos.p1
    currentPos.p1 = currentPos.p1 + diceRoll
    if (currentPos.p1 > 25) {
      currentPos.p1 = 25 - (currentPos.p1-25)
      prevPos2 = 25
      currentPos.p1 = checkEffect(currentPos.p1)
    } else {
      prevPos2 = currentPos.p1
      currentPos.p1 = checkEffect(currentPos.p1)
    }
    // document.getElementById(`player-${currentPos.p1}`).textContent += " p1 "
    
    movePlayer(prevPos1, prevPos2, currentPos.p1, currentTurn)
    // player.textContent = player.textContent.replace(' p1 ', '')
    // document.getElementById(`player-${currentPos.p1}`).textContent += " p1 "
    if (currentPos.p1 == 25) {
      alert('Game Over!! Player 1 Win')
    }

    currentTurn = 'p2'
  } else {
    var player = document.getElementById(`player-${currentPos.p2}`)
    var prevPos1 = currentPos.p2
    var prevPos2 = currentPos.p2
    currentPos.p2 = currentPos.p2 + diceRoll
    if (currentPos.p2 > 25) {
      currentPos.p2 = 25 - (currentPos.p2-25)
      prevPos2 = 25
      currentPos.p2 = checkEffect(currentPos.p2)
    } else {
      prevPos2 = currentPos.p1
      currentPos.p2 = checkEffect(currentPos.p2)
    }

    movePlayer(prevPos1, prevPos2, currentPos.p2, currentTurn)

    // player.textContent = player.textContent.replace(' p2 ', '')
    // document.getElementById(`player-${currentPos.p2}`).textContent += " p2 "
    if (currentPos.p2 == 25) {
      alert('Game Over!! Player 2 Win')
    }

    currentTurn = 'p1'
  }
}

function setEffect () {
  var input = window.prompt('masukan ular/tangga (kotak asal, kotak tujuan, ular/tangga)')
  input = input.split(',')
  if (input[2] == 'ular') {
    if (input[0] < 25 && input[1] < 25 && input[0] != '1') {
      if (parseInt(input[0]) > parseInt(input[1])) {
        if (document.getElementById(`effect-${input[0]}`).getAttribute('data-effect') == undefined ) {
          var overlap = getCoordinate(input)
          if (!overlap) {
            document.getElementById(`effect-${input[0]}`).textContent = `${input[2]} -> ${input[1]}`
            document.getElementById(`effect-${input[0]}`).setAttribute('data-effect', input[1])
          } else {
            alert('Ular atau Tangga tidak bisa bersebrangan dengan yg lain')
          }
        } else {
          alert(`kotak nomor ${input[0]} sudah digunakan`)
        }
      } else {
        alert('kotak tujuan harus lebih kecil dari kotak awal')
      }
    } else {
      alert('kotak yang diinput tidak boleh 25 atau lebih dan tidak boleh 1')
    }
  } else if (input[2] == 'tangga') {
    if (input[0] <= 25 && input[0] != '1' && input[1] <= 25) {
      if (parseInt(input[0]) < parseInt(input[1])) {
        if (document.getElementById(`effect-${input[0]}`).getAttribute('data-effect') == undefined ) {
          var overlap = getCoordinate(input)
          if (!overlap) {
            document.getElementById(`effect-${input[0]}`).textContent = `${input[2]} -> ${input[1]}`
            document.getElementById(`effect-${input[0]}`).setAttribute('data-effect', input[1])
          } else {
            alert('Ular atau Tangga tidak bisa bersebrangan dengan yang lain')
          }
        } else {
          alert(`kotak nomor ${input[0]} sudah digunakan`)
        }
      } else {
        alert('kotak tujuan harus lebih besar dari kotak awal')
      }
    } else {
      alert('kotak yang diinput tidak boleh 25 atau lebih dan tidak boleh 1')
    }
  } else {
    alert('Silahkan masukan ular/tangga')
  }
}

function checkEffect (pos) {
  var pos = pos
  var getEffect = true
  while (getEffect) {
    var effectElem = document.getElementById(`effect-${pos}`)
    if (effectElem.getAttribute('data-effect')) {
      pos = parseInt(effectElem.getAttribute('data-effect'))
      getEffect = true
      // return parseInt(effectElem.getAttribute('data-effect'))
    } else {
      getEffect = false
      // return parseInt(pos)
    }
  }
  return pos
  
}

function movePlayer (prevPos1, prevPos2, currentPos, playerTurn) {
  var prevPos1 = prevPos1
  var prevPos2 = prevPos2
  var currentPos = currentPos
  var effect = prevPos2 < currentPos ? 'tangga' : 'ular'
  var playerPawn = document.getElementById(playerTurn)
  var pawn = document.createElement('span')
    pawn.setAttribute('class', `playerBox ${playerTurn}`)
    pawn.id = `${playerTurn}`
    pawn.textContent = `${playerTurn}`
  
  var player = document.getElementById(`player-${prevPos1}`)
  player.removeChild(playerPawn)
  
  var move = setInterval(function () {
    if (prevPos1 < prevPos2) {
      prevPos1++
      var player = document.getElementById(`player-${prevPos1-1}`)
      // player.removeChild(playerPawn)
      // player.textContent = player.textContent.replace(` ${playerTurn} `, '')
      // document.getElementById(`player-${prevPos1}`).textContent += ` ${playerTurn} `
      document.getElementById(`player-${prevPos1}`).appendChild(pawn)
    } else if (effect == 'tangga') {
      if (prevPos2 < currentPos) {
        prevPos2++
        prevPos1++
        var player = document.getElementById(`player-${prevPos2-1}`)
        // player.textContent = player.textContent.replace(` ${playerTurn} `, '')
        // document.getElementById(`player-${prevPos2}`).textContent += ` ${playerTurn} `
        document.getElementById(`player-${prevPos2}`).appendChild(pawn)
      } else {
        effect = ""
      }
    } else if (effect == 'ular') {
      if (prevPos2 > currentPos) {
        prevPos2--
        var player = document.getElementById(`player-${prevPos2+1}`)
        // player.textContent = player.textContent.replace(` ${playerTurn} `, '')
        // document.getElementById(`player-${prevPos2}`).textContent += ` ${playerTurn} `
        document.getElementById(`player-${prevPos2}`).appendChild(pawn)
      } else {
        effect = ""
      }
    } else {
      clearInterval(move)
    }
  }, 1000/5)
}

function getCoordinate (input) {
  var overlap = false
  var tiles1 = document.getElementById(`number-${input[0]}`)
  var tiles2 = document.getElementById(`number-${input[1]}`)
  var x1 = tiles1.getAttribute('data-x')
  var y1 = tiles1.getAttribute('data-y')
  var x2 = tiles2.getAttribute('data-x')
  var y2 = tiles2.getAttribute('data-y')
  var top = {}
  var bottom = {}
  if (input[2] == 'ular') {
    top = {x: x1, y: y1}
    bottom = {x: x2, y: y2}
  } else if (input[2] == 'tangga') {
    top = {x: x2, y: y2}
    bottom = {x: x1, y: y1}
  }
  effect.map((effect) => {
    if (bottom.x < effect.bottom.x) {
      if (top.x > effect.top.x) {
        overlap = true
      }
    } else if (bottom.x > effect.bottom.x) {
      if (top.x < effect.top.x) {
        overlap = true
      }
    }
  })
  if (!overlap) {
    effect.push({ effect: input[2], top: top, bottom: bottom })
  }
  return overlap
}