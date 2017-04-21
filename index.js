const getComputerMove = game => {
    const moves = game.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    game.move(move)
    console.log(game.ascii())
}

const play = game => board => {
  game.turn() === 'w'
    ? getComputerMove(game)
    : getComputerMove(game)

  board.position(game.fen())

  if (!game.game_over()) {
    return window.setTimeout(play(game).bind(null, (board)), 500)
  }
}

const run = () => {
  if (!window.Chess) return console.error('Could not find Chess')
  if (!window.ChessBoard) return console.error('Could not find ChessBoard')

  const board = new ChessBoard('board', 'start')
  const game = new Chess()
  console.log(game.ascii())

  return window.setTimeout(play(game).bind(null, (board)), 500)
}
run()
