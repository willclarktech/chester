const onDragStart = game => (_, piece) =>
  console.log(piece, piece.match(/^w/), game.game_over()) ||
  !game.game_over() && piece.match(/^w/)

const onDrop = game => (from, to) => {
  const move = game.move({
    from,
    to,
    promotion: 'q',
  })
  return move
    ? true
    : 'snapback'
}

const getComputerMove = game => {
    const moves = game.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    game.move(move)
}

const waitAndPlayAgain = game => board =>
  window.setTimeout(
    play(game).bind(null, (board)),
    500
  )

const play = game => board => {
  if (game.turn() === 'b') {
    getComputerMove(game)
    board.position(game.fen())
    console.log(game.ascii())
  }

  return game.game_over()
    ? console.log('done')
    : waitAndPlayAgain(game)(board)
}

const run = () => {
  if (!window.Chess) return console.error('Could not find Chess')
  if (!window.ChessBoard) return console.error('Could not find ChessBoard')

  const game = new Chess()
  console.log(game.ascii())

  const options = {
    position: 'start',
    draggable: true,
    onDragStart: onDragStart(game),
    onDrop: onDrop(game),
  }

  const board = new ChessBoard('board', options)

  return window.setTimeout(play(game).bind(null, (board)), 500)
}
run()
