
import { useState } from 'react'
import './App.css'

function App() {
  
  //scratch notes
  /* phases: before quiz has started, quiz ongoing, quiz finished */
  /* variables per phase:
  ........before: none
  ........during: currentQuestion (int), optionA (str), optionB (str), optionC (str), optionD (str), correctAnswers (array int), selectedAnswers (arrayint), output
  ........after:  */

  /* processing 
  .......before: just the submit btn to start
  .......during: connection query, 
  .......scoreScreen: 
  */


  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [currentQuestionOptionAText, setCurrentQuestionOptionAText] = useState("");
  const [currentQuestionOptionBText, setCurrentQuestionOptionBText] = useState("");
  const [currentQuestionOptionCText, setCurrentQuestionOptionCText] = useState("");
  const [currentQuestionOptionDText, setCurrentQuestionOptionDText] = useState("");
  const [currentQuestionCorrectAnswer, setQuestionCorrectAnswer] = useState(0);
  const [finalOutputString, setFinalOutputString] = useState(0); //not a fan of this but w.e

  return (


    <>
      <div className="">
        <h1>Security+ Quiz - Data</h1>
        <p>This quiz will present you 10 questions out of a pool of 25, by connecting through a mySQL databsee that is authenticated with Azure Key Vault.</p>
        <button>Start Quiz</button>
      </div>


    </>
  )
}

export default App
