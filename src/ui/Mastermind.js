import React, { Component } from 'react';
import Repeat from 'react-repeat-component';
import MastermindAPI from '../api/mastermind';
import './Mastermind.css';

const PEGS_PER_ROW = MastermindAPI.PEGS_PER_ROW;

class Mastermind extends Component {
  
  constructor(props) {
    super(props);
    this.state = {...MastermindAPI.startGame(props.level)};
  }

  checkCombination = (combination) => {
    const { currentAttempt, hints, status, secret } = MastermindAPI.checkCombination(combination);

    this.setState({
      currentAttempt,
      status,
      secret,
    });

    return hints;
  }

  render() {
    const { restart } = this.props;
    const { level, status, currentAttempt, secret = [] } = this.state;
    const { attempts, colors } = level;
    const playing = status === 'playing';
    const winMsg = status ===  'win' && `:) You win! Total attempts: ${currentAttempt}`;
    const loseMsg = status === 'lose' && `:( You lose! Secret key was: ${secret.join(', ')}`;

    return (
      <div className="wrapper">
        <Repeat times={attempts} order="desc" className="board">
          {(i) => <Row key={i+1} attempt={i+1} isActive={(currentAttempt === i+1) && playing} colors={colors} check={this.checkCombination} />}
        </Repeat>
        <div>
          <p>{winMsg || loseMsg}</p>
          {!playing && <button onClick={restart}>New Game</button>}
        </div>
      </div>
    );
  }
}

class Row extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      pegs: [],
      hints: { black: 0, white: 0 },
    };
  }

  changePeg(pegIndex) {
    this.setState((prevState, props) => {
      const { pegs, lastColorIndex } = prevState;
      const { colors } = props;
      const currentColor = pegs[pegIndex];
      const currentColorIndex = (currentColor === undefined) ? lastColorIndex - 1 : colors.indexOf(currentColor);
      const nextColorIndex = currentColorIndex < colors.length - 1 ? currentColorIndex + 1 : 0;
      const nextColor = colors[nextColorIndex];

      pegs[pegIndex] = nextColor;

       return {
        pegs,
        lastColorIndex: nextColorIndex,
       };
    });
  }

  onConfirmClick = () => {
    this.setState((prevState, props) => ({ hints: props.check(prevState.pegs)}));
  }
  
  render() {
    const { isActive } = this.props;
    const { pegs, hints } = this.state;
    const rowClass = isActive ? 'row active' : 'row';
    const disabled = pegs.filter(Boolean).length < PEGS_PER_ROW;

    const hintsArray = [
      ...Array.from({length: hints.black}, () => 'black'),
      ...Array.from({length: hints.white}, () => 'white'),
    ];
    
    return (
      <div className={rowClass}>
        <Repeat times={PEGS_PER_ROW} className="hints">
          {(i) => {
            const hintColor = hintsArray[i];
            const hintClass = hintColor ? `hole peg ${hintColor}` : 'hole'
            return (<div className={hintClass} key={`hint-${i}`}></div>);
          }}
        </Repeat>
        <Repeat times={PEGS_PER_ROW} className="combination">
          {(i) => {
            const pegColor = pegs[i];
            const pegClass = pegColor ? `hole peg ${pegColor}` : 'hole';
            return (<div className={pegClass} key={`peg-${i}`} onClick={() => isActive && this.changePeg(i)}></div>);
          }}
        </Repeat>
        <button className="confirm" disabled={disabled} hidden={!isActive} onClick={this.onConfirmClick}>Confirm</button>
      </div>
    );
  }
}

export default Mastermind;
