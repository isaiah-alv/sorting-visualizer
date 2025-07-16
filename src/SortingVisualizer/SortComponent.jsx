import React from "react";
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import './SortComponent.css';
import { 
  getMergeSortAnimations, 
  getInsertionSortAnimations, 
  getBubbleSortAnimations, 
  getQuickSortAnimations 
} from './Algorithms.js'; 

const NUMBER_OF_ARRAY_BARS = 30;
const PRIMARY_COLOR = '#abff4f';
const SECONDARY_COLOR = '#f21b3f';
const MAX_BAR_HEIGHT = 300; 
const MIN_BAR_HEIGHT = 30; 

function randomIntFromInterval(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

export default class SortComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      array: [], 
      isAnimating: false,
      selectedAlgorithm: 'insertion',
      animationTimeouts: [],
      animationSpeed: 25
    };
    this.handleAlgorithmChange = this.handleAlgorithmChange.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);
  }

  componentDidMount() {
    this.resetArray();
  }

  handleAlgorithmChange(event) {
    this.setState({ selectedAlgorithm: event.target.value });
  }

  handleSpeedChange(e) {
    this.setState({ animationSpeed: Number(e.target.value) });
  }

  startAnimation() {
    if (this.state.isAnimating) return;
    this.setState({ isAnimating: true }, () => {
      if (window.onAlgorithmPlay) window.onAlgorithmPlay(this.state.selectedAlgorithm);
      switch (this.state.selectedAlgorithm) {
        case 'merge':
          this.runMergeSort();
          break;
        case 'bubble':
          this.runBubbleSort();
          break;
        case 'quick':
          this.runQuickSort();
          break;
        case 'insertion':
        default:
          this.runInsertionSort();
          break;
      }
    });
  }

  stopAnimation() {
    this.state.animationTimeouts.forEach(timeout => clearTimeout(timeout));
    this.setState({ isAnimating: false, animationTimeouts: [] });
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let bar of arrayBars) bar.style.backgroundColor = PRIMARY_COLOR;
  }

  resetArray() {
    if (this.state.isAnimating) return; 
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(MIN_BAR_HEIGHT, MAX_BAR_HEIGHT));
    }
    this.setState({ array });
    setTimeout(() => {
      const arrayBars = document.getElementsByClassName('array-bar');
      for (let bar of arrayBars) bar.style.backgroundColor = PRIMARY_COLOR;
    }, 0);
  }

  runMergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    const timeouts = [];
    const speed = this.state.animationSpeed;
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        const timeout = setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * speed);
        timeouts.push(timeout);
      } else {
        const timeout = setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * speed);
        timeouts.push(timeout);
      }
    }
    const totalDuration = animations.length * speed;
    const endTimeout = setTimeout(() => {
      this.setState({ isAnimating: false, animationTimeouts: [] });
    }, totalDuration);
    timeouts.push(endTimeout);
    this.setState({ animationTimeouts: timeouts });
  }

  runInsertionSort() {
    const animations = getInsertionSortAnimations(this.state.array);
    const timeouts = [];
    const speed = this.state.animationSpeed;
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 4 < 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 4 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        const timeout = setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * speed);
        timeouts.push(timeout);
      } else {
        const timeout = setTimeout(() => {
          const [barIdx, newHeight] = animations[i];
          const barStyle = arrayBars[barIdx].style;
          barStyle.height = `${newHeight}px`;
        }, i * speed);
        timeouts.push(timeout);
      }
    }
    const totalDuration = animations.length * speed;
    const endTimeout = setTimeout(() => {
      this.setState({ isAnimating: false, animationTimeouts: [] });
    }, totalDuration);
    timeouts.push(endTimeout);
    this.setState({ animationTimeouts: timeouts });
  }

  runBubbleSort() {
    const animations = getBubbleSortAnimations(this.state.array);
    const arrayBars = document.getElementsByClassName('array-bar');
    let animationTime = 0;
    const timeouts = [];
    const speed = this.state.animationSpeed;
    for (let i = 0; i < animations.length; i++) {
      const [firstVal, secondVal, type] = animations[i];
      if (type === "compare") {
        const timeout = setTimeout(() => {
          arrayBars[firstVal].style.backgroundColor = SECONDARY_COLOR;
          arrayBars[secondVal].style.backgroundColor = SECONDARY_COLOR;
        }, animationTime * speed);
        timeouts.push(timeout);
        animationTime++;
      } else if (type === "revert") {
        const timeout = setTimeout(() => {
          arrayBars[firstVal].style.backgroundColor = PRIMARY_COLOR;
          arrayBars[secondVal].style.backgroundColor = PRIMARY_COLOR;
        }, animationTime * speed);
        timeouts.push(timeout);
        animationTime++;
      } else if (type === "swap") {
        const timeout = setTimeout(() => {
          arrayBars[firstVal].style.height = `${secondVal}px`;
        }, animationTime * speed);
        timeouts.push(timeout);
        animationTime++;
      }
    }
    const totalDuration = animationTime * speed;
    const endTimeout = setTimeout(() => {
      this.setState({ isAnimating: false, animationTimeouts: [] });
    }, totalDuration);
    timeouts.push(endTimeout);
    this.setState({ animationTimeouts: timeouts });
  }

  runQuickSort() {
    const animations = getQuickSortAnimations(this.state.array);
    const arrayBars = document.getElementsByClassName('array-bar');
    let animationTime = 0;
    const timeouts = [];
    const speed = this.state.animationSpeed;
    for (let i = 0; i < animations.length; i++) {
      const [firstVal, secondVal, type] = animations[i];
      if (type === "compare") {
        const timeout = setTimeout(() => {
          arrayBars[firstVal].style.backgroundColor = SECONDARY_COLOR;
          arrayBars[secondVal].style.backgroundColor = SECONDARY_COLOR;
        }, animationTime * speed);
        timeouts.push(timeout);
        animationTime++;
      } else if (type === "revert") {
        const timeout = setTimeout(() => {
          arrayBars[firstVal].style.backgroundColor = PRIMARY_COLOR;
          arrayBars[secondVal].style.backgroundColor = PRIMARY_COLOR;
        }, animationTime * speed);
        timeouts.push(timeout);
        animationTime++;
      } else if (type === "swap") {
        const timeout = setTimeout(() => {
          arrayBars[firstVal].style.height = `${secondVal}px`;
        }, animationTime * speed);
        timeouts.push(timeout);
        animationTime++;
      }
    }
    const totalDuration = animationTime * speed;
    const endTimeout = setTimeout(() => {
      this.setState({ isAnimating: false, animationTimeouts: [] });
    }, totalDuration);
    timeouts.push(endTimeout);
    this.setState({ animationTimeouts: timeouts });
  }

  render() {
    const { array, isAnimating, selectedAlgorithm, animationSpeed } = this.state;
    return (
      <div className="component-section sorting-border">
        <nav className="button-bar navbar-bar">
          <IconButton disabled={isAnimating} onClick={() => this.resetArray()} title="Reset Array">
            <RefreshIcon />
          </IconButton>

          <select value={selectedAlgorithm} onChange={this.handleAlgorithmChange} disabled={isAnimating}>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="bubble">Bubble Sort</option>
            <option value="quick">Quick Sort</option>
          </select>

          <div className="slider-group">
            <label htmlFor="speed-slider">Speed</label>
            <input id="speed-slider" type="range" min="25" max="100" value={animationSpeed} onChange={this.handleSpeedChange} disabled={isAnimating} />
            <span className="slider-value">{animationSpeed} ms</span>
          </div>

          <IconButton disabled={isAnimating} onClick={this.startAnimation} title="Start Animation">
            <PlayArrowIcon />
          </IconButton>

          <IconButton disabled={!isAnimating} onClick={this.stopAnimation} title="Stop Animation">
            <StopIcon />
          </IconButton>
        </nav>

        <div className="array-container">
          {array.map((value, index) => (
            <div className="array-bar" key={index} style={{ height: `${value}px` }} />
          ))}
        </div>
      </div>
    );
  }
}
