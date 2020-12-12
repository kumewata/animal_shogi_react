import React from 'react';
// import ReactDOM from 'react-dom';
import './App.css';
import hiyokoImage from './images/hiyoko.png';
import kirinImage from './images/kirin.png';
import lionImage from './images/lion.png';
import zouImage from './images/zou.png';
class Square extends React.Component {
  image(type) {
    let image = null;
    switch(type) {
      case 'hiyoko':
        image = hiyokoImage;
        break;
      case 'kirin':
        image = kirinImage;
        break;
      case 'lion':
        image = lionImage;
        break;
      case 'zou':
        image = zouImage;
        break;
      default:
    }

    if(type == null) return

    const imageStyle = {
      height: '90px',
      width: '90px',
    };

    return(
      <img src={image} style={imageStyle} alt={type} />
    )
  }
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

    return (
      <button
        className={className}
        onClick={() => this.props.onClick()}
      >
        {this.image(this.props.type)}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        type={this.props.squares[i].type}
        onClick={() => this.props.onClick(i)}
        isSelected={this.props.selectedSquareIndex === i}
        isCandidate={this.props.isSquareIncludedInMovingCandidates(i)}
        direction={this.props.squares[i].direction}
      />);
  }

  render() {
    return (
      <div>
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
      upwardStocks: [],
      selectedStockIndex: null,
      downwardStocks: [],
    }
  }

  isSquareIncludedInMovingCandidates(i) {
    return this.state.movingCandidates.includes(i);
  }

  mapMergeDiffs(square, diffs) {
    const position = square.position;

    if (square.direction) {
      return diffs.map(diff => [position[0] + diff[0], position[1] + diff[1]]);
    } else {
      return diffs.map(diff => [position[0] + diff[0], position[1] - diff[1]]);
    }
  }

  convertPositionsToIndexes(positions, squares) {
    return positions.map((position) => squares.findIndex((s) => s.position[0] === position[0] && s.position[1] === position[1]))
                    .filter(i => i > 0);
  }

  filterdMovingCandidates(targetIndex, squares) {
    const diffs = new Koma(squares[targetIndex].type).moveTo;
    const movingCandidatePosisions = this.mapMergeDiffs(squares[targetIndex], diffs);
    const movingCandidateIndexes = this.convertPositionsToIndexes(movingCandidatePosisions, squares);
    const movableIndexes = squares.flatMap((s, index) => (s.type !== null && s.direction === squares[targetIndex].direction) ? index: null)
                                  .filter(i => i !== null);

    const isMovableIndex = (c) => {
      return !(movableIndexes.map(s => s.toString()).includes(c.toString()));
    }

    return movingCandidateIndexes.filter(isMovableIndex);
  }

  stockKoma(square) {
    let stocks;
    if (square.direction === false) {
      stocks = this.state.upwardStocks.slice();
      this.setState({
        upwardStocks: stocks.concat([square.type]),
      });
    } else if (square.direction === true) {
      stocks = this.state.downwardStocks.slice();
      this.setState({
        downwardStocks: stocks.concat([square.type]),
      });
    }
  }

  handleClick(i) {
    if (this.state.selectedSquareIndex === i) {
      if (this.state.winner !== null) return;

      this.setState({
        selectedSquareIndex: null,
        movingCandidates: []
      });
    } else if (this.isSquareIncludedInMovingCandidates(i) && this.state.selectedStockIndex === null) {
      const squares = this.state.squares.slice();
      this.stockKoma(squares[i]);
      squares[i].type = this.state.squares[this.state.selectedSquareIndex].type;
      squares[i].direction = this.state.squares[this.state.selectedSquareIndex].direction;
      squares[this.state.selectedSquareIndex].type = null;
      squares[this.state.selectedSquareIndex].direction = null;
      this.setState({
        squares: squares,
        selectedSquareIndex: null,
        movingCandidates: [],
        xIsNext: !this.state.xIsNext,
        selectedStockIndex: null,
      });

      const winner = calculateWinner(this.state.squares);
      if (winner !== null) {
        this.setState({
          winner: winner,
        });
      }
    } else if (this.isSquareIncludedInMovingCandidates(i) && this.state.selectedStockIndex !== null) {
      const squares = this.state.squares.slice();
      let stocks;
      if (this.state.xIsNext) {
        stocks = this.state.upwardStocks.slice();
      } else {
        stocks = this.state.downwardStocks.slice();
      }
      squares[i].type = stocks[this.state.selectedStockIndex];
      squares[i].direction = this.state.xIsNext;
      if (this.state.xIsNext) {
        this.setState({
          squres: squares,
          selectedStockIndex: null,
          movingCandidates: [],
          xIsNext: !this.state.xIsNext,
          upwardStocks: stocks.splice(this.selectedStockIndex, 1)
        })
      } else {
        this.setState({
          squres: squares,
          selectedStockIndex: null,
          movingCandidates: [],
          xIsNext: !this.state.xIsNext,
          downwardStocks: stocks.splice(this.selectedStockIndex, 1)
        })
      }
    } else if (this.state.xIsNext === this.state.squares[i].direction) {
      if (this.state.winner !== null) return;

      const squares = this.state.squares.slice();
      this.setState({
        selectedSquareIndex: i,
        selectedStockIndex: null,
        movingCandidates: this.filterdMovingCandidates(i, squares),
      });
    }
  }

  handleClickStock(index, direction) {
    if (direction !== this.state.xIsNext) return;

    const movableIndexes = this.state.squares.flatMap((s, index) => (s.type == null ? index: null))
                                  .filter(i => i !== null);

    this.setState({
      movingCandidates: movableIndexes,
      selectedSquareIndex: null,
      selectedStockIndex: index,
    })
  };

  render() {
    let status;
    if (this.state.winner !== null) {
      status = '勝者: ' + (this.state.winner ? '先手' : '後手');
    } else {
      status = '次の指し手: ' + (this.state.xIsNext ? '先手' : '後手');
    }

    const upwardStocks = this.state.upwardStocks.map((stock, index) => {
      return(
        <li
          key={index}
          onClick={() => this.handleClickStock(index, true)}
        >
          {new Koma(stock).name}
        </li>
      );
    });

    const downwardStocks = this.state.downwardStocks.map((stock, index) => {
      return(
        <li
          key={index}
          onClick={() => this.handleClickStock(index, false)}
        >
          {new Koma(stock).name}
        </li>
      );
    });

    return (
      <div className="app">
        <div className="status">
          {status}
        </div>
        <div className="game">
          <div className="game-stock-board downward">
            <p>持ち駒</p>
            <ol>{downwardStocks}</ol>
          </div>
          <div className="game-board">
            <Board
              squares={this.state.squares}
              selectedSquareIndex={this.state.selectedSquareIndex}
              movingCandidates={this.state.movingCandidates}
              onClick={(i) => this.handleClick(i)}
              isSquareIncludedInMovingCandidates={(i) => this.isSquareIncludedInMovingCandidates(i)}
              selectedStockIndex={this.state.selectedStockIndex}
            />
          </div>
          <div className="game-stock-board upward">
            <p>持ち駒</p>
            <ol>{upwardStocks}</ol>
          </div>
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
