// SortComponent.jsx
import React from "react";
import './SortComponent.css';
import { getMergeSortAnimations, getInsertionSortAnimations } from './Algorithms.js'; 

const ANIMATION_SPEED_MS = 10;
const NUMBER_OF_ARRAY_BARS = 80;
const PRIMARY_COLOR = '#4793AF';
const SECONDARY_COLOR = 'red';

function randomIntFromInterval(minimum, maximum){
   return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

export default class SortComponent extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         array: []
      };
   }

   resetArray(){
      const array = [];
      for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
         array.push(randomIntFromInterval(100, 500));
      }
      this.setState({array});
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

   render() {
      const {array} = this.state;
      return (
         <div className="component-section">
            <div className="button-bar">
               <button onClick={() => this.resetArray()}>NEW ARRAY</button>
               <button onClick={() => this.insertionSort()}>INSERTION</button>
               <button onClick={() => this.mergeSort()}>MERGE</button>
            </div>
            <div className="array-container">
               <div className="headerContainer"/>
               {array.map((value, index) => (
                  <div className="array-bar" key={index}
                       style={{height: `${value}px`}}>
                  </div> 
               ))}
            </div>
         </div>
      );
   }
}
