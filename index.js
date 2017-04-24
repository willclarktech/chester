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
const piecesToScore = ['P', 'N', 'B', 'R', 'Q']

const getWeight = piece => {
  switch (piece) {
    case 'Q':
      return 9
    case 'R':
      return 5
    case 'N':
    case 'B':
      return 3
    default:
      return 1
  }
}

const scoreColor = position => color => piecesToScore
  .map(piece => {
    const regex = new RegExp(color === 'white' ? piece : piece.toLowerCase(), 'g')
    return (position.match(regex) || '').length * getWeight(piece)
  })
  .reduce((sum, pieceScore) => sum + pieceScore, 0)

const scorePosition = fen => {
  const position = fen.split(' ')[0]
  const score = scoreColor(position)
  return score('black') - score('white')
}

const evaluateMove = game => move => {
  game.move(move)
  const score =
    game.in_checkmate()
      ? game.turn() === 'w'
        ? 1000
        : - 1000
      : game.in_stalemate() || game.in_draw()
        ? 0
        : scorePosition(game.fen())

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
