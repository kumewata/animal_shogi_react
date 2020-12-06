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
    return (
      <button
        className={className}
        onClick={() => this.props.onClick()}
      >
        {this.props.type}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    const squares = [
      {
        type: '0,0',
        position: [0, 0],
      },
      {
        type: '1,0',
        position: [1, 0],
      },
      {
        type: '2,0',
        position: [2, 0],
      },
      {
        type: '0,1',
        position: [0, 1],
      },
      {
        type: '1,1',
        position: [1, 1],
      },
      {
        type: '2,1',
        position: [2, 1],
      },
      {
        type: '0,2',
        position: [0, 2],
      },
      {
        type: '1,2',
        position: [1, 2],
      },
      {
        type: '2,2',
        position: [2, 2],
      },
      {
        type: '0,3',
        position: [0, 3],
      },
      {
        type: 'ひよこ',
        position: [1, 3],
      },
      {
        type: '2,3',
        position: [2, 3],
      },
    ]
    this.state = {
      squares: squares,
      selectedSquareIndex: null,
      movingCandidates: [],
    }
  }

  renderSquare(i) {
    const position = this.state.squares[i].position;
    const samePosition = (element) => element[0] === position[0] && element[1] === position[1];
    return (
      <Square
        type={this.state.squares[i].type}
        onClick={() => this.handleClick(i)}
        isSelected={this.state.selectedSquareIndex === i}
        isCandidate={this.state.movingCandidates.some(samePosition)}
      />);
  }

  handleClick(i) {
    const position = this.state.squares[i].position;
    const samePosition = (element) => element[0] === position[0] && element[1] === position[1];

    if (this.state.selectedSquareIndex === i) {
      this.setState({
        selectedSquareIndex: null,
        movingCandidates: []
      });
    } else if (this.state.movingCandidates.some(samePosition)) {
        const squares = this.state.squares.slice();
        squares[i].type = this.state.squares[this.state.selectedSquareIndex].type;
        squares[this.state.selectedSquareIndex].type = this.state.squares[this.state.selectedSquareIndex].position.join(',');
        this.setState({
          squares: squares,
          selectedSquareIndex: null,
          movingCandidates: [],
        });
    } else {
      this.setState({selectedSquareIndex: i});
      const position = this.state.squares[i].position
      const diffs = movingDiffs();
      const candidates = diffs.map(diff => [diff[0] + position[0], diff[1] + position[1]]);
      const filteredCandidates = candidates.filter(c => c[0] >= 0 && c[0] < 3 && c[1] >= 0 && c[1] < 4);
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

function movingDiffs() {
  return [[0, -1]];
}

export default App;
