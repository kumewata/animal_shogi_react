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
        type: null,
        position: [0, 0],
      },
      {
        type: null,
        position: [1, 0],
      },
      {
        type: null,
        position: [2, 0],
      },
      {
        type: null,
        position: [0, 1],
      },
      {
        type: null,
        position: [1, 1],
      },
      {
        type: null,
        position: [2, 1],
      },
      {
        type: null,
        position: [0, 2],
      },
      {
        type: 'hiyoko',
        position: [1, 2],
      },
      {
        type: null,
        position: [2, 2],
      },
      {
        type: 'zou',
        position: [0, 3],
      },
      {
        type: 'lion',
        position: [1, 3],
      },
      {
        type: 'kirin',
        position: [2, 3],
      },
    ]
    this.state = {
      squares: squares,
      selectedSquareIndex: null,
      movingCandidates: [],
    }
  }

  isSquareIncludedInMovingCandidates(i) {
    const position = this.state.squares[i].position;
    const isSamePosition = (element) => element[0] === position[0] && element[1] === position[1];

    return this.state.movingCandidates.some(isSamePosition);
  }

  mapMergeDiffs(target, diffs) {
    return diffs.map(diff => [diff[0] + target[0], diff[1] + target[1]]);
  }

  renderSquare(i) {
    return (
      <Square
        type={this.state.squares[i].type}
        onClick={() => this.handleClick(i)}
        isSelected={this.state.selectedSquareIndex === i}
        isCandidate={this.isSquareIncludedInMovingCandidates(i)}
      />);
  }

  handleClick(i) {
    if (this.state.selectedSquareIndex === i) {
      this.setState({
        selectedSquareIndex: null,
        movingCandidates: []
      });
    } else if (this.isSquareIncludedInMovingCandidates(i)) {
        const squares = this.state.squares.slice();
        squares[i].type = this.state.squares[this.state.selectedSquareIndex].type;
        squares[this.state.selectedSquareIndex].type = null;
        this.setState({
          squares: squares,
          selectedSquareIndex: null,
          movingCandidates: [],
        });
    } else {
      this.setState({selectedSquareIndex: i});
      const squares = this.state.squares.slice();
      
      const diffs = new Koma(this.state.squares[i].type).moveTo;
      const movingCandidates = this.mapMergeDiffs(squares[i].position, diffs);
      const komaPositionStrings = squares.filter(s => s.type !== null).map(s => s.position.toString());
      const filteredCandidates = movingCandidates.filter(c => c[0] >= 0 && c[0] < 3 && c[1] >= 0 && c[1] < 4)
                                           .filter(c => !(komaPositionStrings.includes(c.toString())));

      this.setState({movingCandidates: filteredCandidates});
    }
  }

  render() {
    const status = 'Next player: X';

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

export default App;
