const getPlayerMove = game => {

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

  if (!game.game_over())
    return waitAndPlayAgain(game)(board)
}

const run = () => {
  if (!window.Chess) return console.error('Could not find Chess')
  if (!window.ChessBoard) return console.error('Could not find ChessBoard')

  const options = {
    position: 'start',
  }

  const board = new ChessBoard('board', options)
  const game = new Chess()
  console.log(game.ascii())

  return window.setTimeout(play(game).bind(null, (board)), 500)
}
run()
