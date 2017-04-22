// Need to declare this here for onSnapEnd
let board

// ChessBoard

const onDragStart = game => (_, piece, position, orientation) =>
  !game.game_over() && !!piece.match(orientation === 'white' ? /^w/ : /^b/)

const onDrop = game => (from, to) =>
  game.move({
    from,
    to,
    promotion: 'q',
  })
    ? true
    : 'snapback'

const onSnapEnd = game => () =>
  board.position(game.fen())

////////////////////////////////////////////////////////////////

// AI

const scorePosition = fen => {
  const position = fen.split(' ')[0]
  const whitePawns = (position.match(/P/g) || '').length
  const blackPawns = (position.match(/p/g) || '').length
  return blackPawns - whitePawns
}

const evaluateMove = game => move => {
  game.move(move)
  const score = scorePosition(game.fen())
  game.undo()
  return score
}

const compareMoves = game => (current, move) => {
  const score = evaluateMove(game)(move)
  return score > current.score
    ? { move, score }
    : current
}

const getBestMove = game =>
  game
    .moves()
    .reduce(compareMoves(game), { score: -10e3 })
    .move

////////////////////////////////////////////////////////////////

// Game play

const getComputerMove = game =>
    game
      .move(getBestMove(game))

const waitAndPlayAgain = humanPlaysWhite => game => board =>
  window.setTimeout(
    play(humanPlaysWhite)(game).bind(null, (board)),
    500
  )

const play = humanPlaysWhite => game => board => {
  if (game.turn() === (humanPlaysWhite ? 'b' : 'w')) {
    getComputerMove(game)
    board.position(game.fen())
  }

  return game.game_over()
    ? true
    : waitAndPlayAgain(humanPlaysWhite)(game)(board)
}

const run = (color) => {
  if (!window.Chess) return console.error('Could not find Chess')
  if (!window.ChessBoard) return console.error('Could not find ChessBoard')

  const game = new Chess()
  const humanPlaysWhite = color
    ? color === 'white'
    : Math.floor(Math.random() * 2)

  const options = {
    position: 'start',
    orientation: humanPlaysWhite ? 'white' : 'black',
    draggable: true,
    onDragStart: onDragStart(game),
    onDrop: onDrop(game),
    onSnapEnd: onSnapEnd(game),
  }

  board = new ChessBoard('board', options)

  return window.setTimeout(play(humanPlaysWhite)(game).bind(null, (board)), 500)
}

run('white')
