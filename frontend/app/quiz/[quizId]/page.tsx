import { getWordList } from "../getQuestions";
import Quiz from "../page";
import QuizQuestions from "../QuizQuestions";


const page = async({ params }:{
    params:{
        quizId: string
    }
}) => {
    const quizId = params.quizId;
    const quizQuestions = await getWordList();
    return(
    <div>
        <QuizQuestions questions={quizQuestions}/>
    </div>)
}

export default page;