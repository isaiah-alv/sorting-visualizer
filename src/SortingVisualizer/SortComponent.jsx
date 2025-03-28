// SortComponent.jsx
import React from "react";
import './SortComponent.css';
import { 
  getMergeSortAnimations, 
  getInsertionSortAnimations, 
  getBubbleSortAnimations 
} from './Algorithms.js'; 

const ANIMATION_SPEED_MS = 25;
const NUMBER_OF_ARRAY_BARS = 50;
const PRIMARY_COLOR = '#abff4f';
const SECONDARY_COLOR = '#f21b3f';

function randomIntFromInterval(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

export default class SortComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { array: [], isAnimating: false };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    if (this.state.isAnimating) return; 
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(100, 500));
    }
    this.setState({ array });
  }

  mergeSort() {
   const animations = getMergeSortAnimations(this.state.array);
   for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
         const [barOneIdx, barTwoIdx] = animations[i];
         const barOneStyle = arrayBars[barOneIdx].style;
         const barTwoStyle = arrayBars[barTwoIdx].style;
         const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
         setTimeout(() => {
           barOneStyle.backgroundColor = color;
           barTwoStyle.backgroundColor = color;
         }, i * ANIMATION_SPEED_MS);
      } else {
         setTimeout(() => {
           const [barOneIdx, newHeight] = animations[i];
           const barOneStyle = arrayBars[barOneIdx].style;
           barOneStyle.height = `${newHeight}px`;
         }, i * ANIMATION_SPEED_MS);
      }
   }
}

insertionSort() {
   const animations = getInsertionSortAnimations(this.state.array);
   for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 4 < 2; 
      if (isColorChange) {
         const [barOneIdx, barTwoIdx] = animations[i];
         const barOneStyle = arrayBars[barOneIdx].style;
         const barTwoStyle = arrayBars[barTwoIdx].style;
         const color = i % 4 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
         setTimeout(() => {
            barOneStyle.backgroundColor = color;
            barTwoStyle.backgroundColor = color;
         }, i * ANIMATION_SPEED_MS);
      } else {
         setTimeout(() => {
            const [barIdx, newHeight] = animations[i];
            const barStyle = arrayBars[barIdx].style;
            barStyle.height = `${newHeight}px`;
         }, i * ANIMATION_SPEED_MS);
      }
   }
}
  bubbleSort() {
    this.setState({ isAnimating: true });
    const animations = getBubbleSortAnimations(this.state.array);
    const arrayBars = document.getElementsByClassName('array-bar');
    let animationTime = 0;
    for (let i = 0; i < animations.length; i++) {
      const [firstVal, secondVal, type] = animations[i];
      if (type === "compare") {
        setTimeout(() => {
          arrayBars[firstVal].style.backgroundColor = SECONDARY_COLOR;
          arrayBars[secondVal].style.backgroundColor = SECONDARY_COLOR;
        }, animationTime * ANIMATION_SPEED_MS);
        animationTime++;
      } else if (type === "revert") {
        setTimeout(() => {
          arrayBars[firstVal].style.backgroundColor = PRIMARY_COLOR;
          arrayBars[secondVal].style.backgroundColor = PRIMARY_COLOR;
        }, animationTime * ANIMATION_SPEED_MS);
        animationTime++;
      } else if (type === "swap") {
        setTimeout(() => {
          arrayBars[firstVal].style.height = `${secondVal}px`;
        }, animationTime * ANIMATION_SPEED_MS);
        animationTime++;
      }
    }
    const totalDuration = animationTime * ANIMATION_SPEED_MS;
    setTimeout(() => {
      this.setState({ isAnimating: false });
    }, totalDuration);
  }

  render() {
    const { array, isAnimating } = this.state;
    return (
      <div className="component-section">
        <div className="button-bar">
          <button disabled={isAnimating} onClick={() => this.resetArray()}>New</button>
          <button onClick={() => this.insertionSort()}>Insertion</button>
          <button onClick={() => this.mergeSort()}>Merge</button>
          <button disabled={isAnimating} onClick={() => this.bubbleSort()}>Bubble</button>
        </div>
        <div className="array-container">
          {array.map((value, index) => (
            <div 
              className="array-bar" 
              key={index} 
              style={{ height: `${value}px` }}>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
