Here's a structured README in Markdown format for your React application. This README includes an overview of your app, setup instructions, a description of its main components, and usage guidelines.

```markdown
# Sorting Visualizer and Chat Application

This project consists of two main components: a Sorting Visualizer (`SortComponent`) and a Chat Application (`ChatModal`). The Sorting Visualizer uses animation to demonstrate sorting algorithms like Merge Sort and Insertion Sort. The Chat Application integrates with the ChatGPT API to provide explanations on sorting algorithms at various levels of complexity.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you start, ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- An API key from OpenAI for the ChatGPT functionality

### Installing

To set up the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Navigate to the project directory:
   ```bash
   cd [project-directory]
   ```
3. Install the required packages:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

The application should now be running on `http://localhost:3000/`.

## Components

### ChatModal

- **Description**: A modal that enables interaction with ChatGPT based on user input.
- **Usage**:
  - Enter your API key to start the session.
  - Select the complexity of the explanations (Beginner, Intermediate, Expert).
  - Type your questions or commands in the message input field.

### SortComponent

- **Description**: Visualizes sorting algorithms with adjustable parameters.
- **Usage**:
  - Click **NEW ARRAY** to generate a random array of bars.
  - Use the **MERGE** and **INSERTION** buttons to visualize the respective sorting algorithms.

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **Isaiah Alviola**


## Acknowledgments

- [Cooper Codes on YT](https://www.youtube.com/watch?v=Lag9Pj_33hM)
- Dr.Yulia Kumar at Kean
- [GenderMag](https://gendermag.org/)
```
