let board

const onDragStart = game => (_, piece, position, orientation) =>
  !game.game_over() && !!piece.match(orientation === 'white' ? /^w/ : /^b/)

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

const onSnapEnd = game => () =>
  board.position(game.fen())

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
  }

  return game.game_over()
    ? true
    : waitAndPlayAgain(game)(board)
}

const run = () => {
  if (!window.Chess) return console.error('Could not find Chess')
  if (!window.ChessBoard) return console.error('Could not find ChessBoard')

  const game = new Chess()

  const options = {
    position: 'start',
    draggable: true,
    onDragStart: onDragStart(game),
    onDrop: onDrop(game),
    onSnapEnd: onSnapEnd(game),
  }

  board = new ChessBoard('board', options)

  return window.setTimeout(play(game).bind(null, (board)), 500)
}
run()
