interface Props {
    displayedString: string,
    btnPhase: number,
}

function CyclePhases(currentPhase: string) {
    switch(currentPhase) {
        case("Start Quiz"):
        {alert();}
        case("Next Question"):
        case("End Quiz"):
        default:
            break;
        

    }
}


function QuizBtn(props: Props) {

    return (
        <button onClick={()=>CyclePhases(props.displayedString)}>{props.displayedString}</button>
    )
}

export default QuizBtn;