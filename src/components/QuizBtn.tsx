import React, { useState } from "react"

interface Props {
    displayedString: string,
    onClick: () => void; // allow onClick prop
}

const [selectedQuizNumbers, setSelectedQuizNumbers] = useState(0)

// function CyclePhases(currentPhase: string) {
//     //get rid of this switch statemetn and just have different displayed based on phase on App.tsx
//     switch(currentPhase) {

//         case("Start Quiz"):      
//         {
//             //open db connection, generate list of random numbers

//             //1-25 inclusive, add it to the list
//             Math.floor(Math.random() * 25) + 1

            
//         }
//         case("Next Question"):
//         case("End Quiz"):
//         default:
//             break;
        

//     }
// }


function QuizBtn(props: Props) {

    return (
        <button onClick={props.onClick}>{props.displayedString}</button>
    )
}

export default QuizBtn;