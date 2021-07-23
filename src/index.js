import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const squareClassName = props.isWinLine ? "win-square" : "square";
  return (
    <button className={squareClassName} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function SortButton(props) {
  return (
    <button className="sort-button" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const isWinLine = this.props.winLine ? this.props.winLine.includes(i): false;
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        isWinLine={isWinLine}
      />
    );
  }

  renderBoardRow(i){
    const boardRow = []
    for(let j=0; j<3; j++){
      boardRow.push(this.renderSquare((i*3)+j))
    }
    return (
      <div className="board-row">
        {boardRow}
      </div>  
    )
  }

  render() {
    const board = []
    for(let i=0; i<3; i++){
      board.push(this.renderBoardRow(i))
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        choice: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      isSortAsc: true,
      win: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.state.win || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const win = calculateWinner(squares);
    
    this.setState({
      history: history.concat([{
        squares: squares,
        choice: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      win: win,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      win: null,
    });
  }

  renderSortButton() {
    return (
      <SortButton 
        value="sort button" 
        onClick={() => this.changeSort()}
      />
    );
  }

  changeSort(){
    this.setState({
      isSortAsc: !this.state.isSortAsc,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = this.state.win;
    const winLine = win ? win.winLine: null;

    const stepNumber = this.state.stepNumber;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " / choice:(" + (step.choice % 3) + "," + Math.floor(step.choice/3) + ")":
        'Go to game start';
      const select = move === stepNumber ?
        '->':
        '';

      return (
        <li key={move}>
          {select}<button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const historyLine = this.state.isSortAsc ? moves.slice() : moves.reverse();

    let status;
    if (win) {
      status = 'Winner: ' + win.winner;
    } else if (stepNumber >= 9) {
      status = 'draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{this.renderSortButton()}</div>
          <ol>{historyLine}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner : squares[a],
        winLine : lines[i],
      };
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
