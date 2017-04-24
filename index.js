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

const onChange = human => game => () => {
  game.load(board.fen())
  window.setTimeout(play(human)(game).bind(null, board), 100)
}

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
    const regex = new RegExp(color === 'w' ? piece : piece.toLowerCase(), 'g')
    return (position.match(regex) || '').length * getWeight(piece)
  })
  .reduce((sum, pieceScore) => sum + pieceScore, 0)

const scorePosition = fen => {
  const [position, player] = fen.split(' ')
  const score = scoreColor(position)
  return score(player) - score(player === 'b' ? 'w' : 'b')
}

const evaluateBoard = player => game =>
  game.in_checkmate()
    ? game.turn() === player
      ? -1000
      : 1000
    : game.in_stalemate() || game.in_draw()
      ? 0
      : scorePosition(game.fen())

const minimax = depth => game => {
  const player = game.turn()
  const moves = game.moves()
  if (!depth) {
    return moves.reduce((best, move) => {
      game.move(move)
      const score = - evaluateBoard(player)(game)
      console.log(move, score)
      game.undo()
      return !best || score > best.score
        ? { move, score }
        : best
    }, null)
  }
}

const getBestMove = game => {
  const result = minimax(0)(game)
  console.log('chose:', result)
  return result && result.move
}

////////////////////////////////////////////////////////////////

// Game play

const play = human => game => board => {
  if (!game.game_over() && game.turn() !== human) {
    game.move(getBestMove(game))
    board.position(game.fen())
  }

  return game.game_over()
    ? true
    : false
}

const run = (color) => {
  if (!window.Chess) return console.error('Could not find Chess')
  if (!window.ChessBoard) return console.error('Could not find ChessBoard')

  const game = new Chess()
  const human = color
    ? color === 'white' ? 'w' : 'b'
    : ['w', 'b'][Math.floor(Math.random() * 2)]

  const options = {
    position: 'start',
    orientation: color || (human === 'w' ? 'white' : 'black'),
    draggable: true,
    onDragStart: onDragStart(game),
    onDrop: onDrop(game),
    onSnapEnd: onSnapEnd(game),
    onChange: onChange(human)(game),
  }

  board = new ChessBoard('board', options)

  return play(human)(game)(board)
}

run('white')
