import React from 'react';
// import ReactDOM from 'react-dom';
import './App.css';

class Square extends React.Component {
  render() {
    let className = 'square';
    if (this.props.isSelected) {
      className += ' selected';
    }
    if (this.props.isCandidate) {
      className += ' candidate';
    }
    if (!this.props.direction) {
      className += ' downward';
    }
    const koma = new Koma(this.props.type);
    return (
      <button
        className={className}
        onClick={() => this.props.onClick()}
      >
        {koma.name}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    const squares = [
      {
        type: 'kirin',
        direction: false,
        position: [0, 0],
      },
      {
        type: 'lion',
        direction: false,
        position: [1, 0],
      },
      {
        type: 'zou',
        direction: false,
        position: [2, 0],
      },
      {
        type: null,
        direction: null,
        position: [0, 1],
      },
      {
        type: 'hiyoko',
        direction: false,
        position: [1, 1],
      },
      {
        type: null,
        direction: null,
        position: [2, 1],
      },
      {
        type: null,
        direction: null,
        position: [0, 2],
      },
      {
        type: 'hiyoko',
        direction: true,
        position: [1, 2],
      },
      {
        type: null,
        direction: null,
        position: [2, 2],
      },
      {
        type: 'zou',
        direction: true,
        position: [0, 3],
      },
      {
        type: 'lion',
        direction: true,
        position: [1, 3],
      },
      {
        type: 'kirin',
        direction: true,
        position: [2, 3],
      },
    ]
    this.state = {
      squares: squares,
      selectedSquareIndex: null,
      movingCandidates: [],
      xIsNext: true,
      winner: null,
    }
  }

  isSquareIncludedInMovingCandidates(i) {
    const position = this.state.squares[i].position;
    const isSamePosition = (element) => element[0] === position[0] && element[1] === position[1];

    return this.state.movingCandidates.some(isSamePosition);
  }

  mapMergeDiffs(square, diffs) {
    const position = square.position;

    if (square.direction) {
      return diffs.map(diff => [position[0] + diff[0], position[1] + diff[1]]);
    } else {
      return diffs.map(diff => [position[0] + diff[0], position[1] - diff[1]]);
    }
  }

  filterdMovingCandidates(targetIndex, squares) {
    const diffs = new Koma(squares[targetIndex].type).moveTo;
    const movingCandidates = this.mapMergeDiffs(squares[targetIndex], diffs);
    const filledPositions = squares.filter(s => s.type !== null && s.direction === squares[targetIndex].direction);
    const isInsideBoard = (c) => {
      return c => c[0] >= 0 && c[0] < 3 && c[1] >= 0 && c[1] < 4;
    }
    const isPositionFilled = (c) => {
      return !(filledPositions.map(s => s.position.toString()).includes(c.toString()));
    }
    
    return movingCandidates.filter(isInsideBoard)
                           .filter(isPositionFilled);
  }

  renderSquare(i) {
    return (
      <Square
        type={this.state.squares[i].type}
        onClick={() => this.handleClick(i)}
        isSelected={this.state.selectedSquareIndex === i}
        isCandidate={this.isSquareIncludedInMovingCandidates(i)}
        direction={this.state.squares[i].direction}
      />);
  }

  handleClick(i) {
    if (this.state.selectedSquareIndex === i) {
      if (this.state.winner !== null) return;

      this.setState({
        selectedSquareIndex: null,
        movingCandidates: []
      });
    } else if (this.isSquareIncludedInMovingCandidates(i)) {
      const squares = this.state.squares.slice();
      squares[i].type = this.state.squares[this.state.selectedSquareIndex].type;
      squares[i].direction = this.state.squares[this.state.selectedSquareIndex].direction;
      squares[this.state.selectedSquareIndex].type = null;
      squares[this.state.selectedSquareIndex].direction = null;
      this.setState({
        squares: squares,
        selectedSquareIndex: null,
        movingCandidates: [],
        xIsNext: !this.state.xIsNext,
      });

      const winner = calculateWinner(this.state.squares);
      if (winner !== null) {
        this.setState({
          winner: winner,
        });
      }
    } else if (this.state.xIsNext === this.state.squares[i].direction) {
      if (this.state.winner !== null) return;

      const squares = this.state.squares.slice();
      this.setState({
        selectedSquareIndex: i,
        movingCandidates: this.filterdMovingCandidates(i, squares),
      });
    }
  }

  render() {
    let status;
    if (this.state.winner !== null) {
      status = 'Winner: ' + (this.state.winner ? 'Upward' : 'Downward');
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'Upward' : 'Downward');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <div className="board-row">
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

class Koma {
  constructor(type) {
    const animals = {
      'hiyoko': {
        name: 'ひよこ',
        moveTo: [[0, -1]],
      },
      'zou': {
        name: 'ぞう',
        moveTo: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
      },
      'lion': {
        name: 'らいおん',
        moveTo: [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [-1, 0], [0, 1], [1, 0]],
      },
      'kirin': {
        name: 'きりん',
        moveTo: [[0, -1], [-1, 0], [0, 1], [1, 0]],
      },
    }

    this.type = type;
    this.name = !!type ? animals[type].name : '';
    this.moveTo = !!type ? animals[type].moveTo: [];
  }
}

function calculateWinner(squares) {
  
  const lions = squares.filter(s => s.type === 'lion');
  const isCatched = lions.length === 1;
  if (isCatched) {
    return lions[0].direction;
  }
  const isUpwardTried = squares.filter(s => (s.type === 'lion' && s.direction))[0].position[1] === 0;
  const isDownwardTried = squares.filter(s => (s.type === 'lion' && !s.direction))[0].position[1] === 3;
  if (isUpwardTried) {
    return true;
  } else if (isDownwardTried) {
    return false
  }

  return null
}

export default App;
