import { auth } from "@/auth/auth";
import {getUserQuizProgress, getUserQuizzes, getUserWordLists, getWords} from "@/prisma/queries";
import { masteryAvailable, createMasterQuiz } from "@/actions/master_quiz";
import Dashboard  from "@/app/quiz/components/dashboard";
import ContextPage from "@/app/learn/context";
const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const quizzes = await getUserQuizzes(userId);
  const words = await getWords();
  const wordLists = await getUserWordLists(userId);

  let masterQuizzes = [];

  for( const wordList of wordLists){
    if(await masteryAvailable(wordList.listId, userId)){
      const masteryQuiz = await createMasterQuiz(wordList.listId, userId);
      masterQuizzes.push(masteryQuiz);
    }
  }
  return (
    <div>
      {!submitted ? (
        <div className="flex flex-col flex-1">
          <div>
            <header>
              <ProgressBar
                value={(currentQuestion / quizQuestions.length) * 100}
              />
            </header>
          </div>
          <main className="flex justify-center flex-1">
            {!started ? (
              <h1 className="text-3xl font-bol">Demo Words Quiz</h1>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">
                  {quizQuestions[currentQuestion].question}
                </h2>
                <div className="grid grid-cols1 gap-6 m-12">
                  {quizQuestions[currentQuestion].answers.map((answer) => (
                    <Button
                      key={answer.id}
                      variant="answer_choice"
                      onClick={() => handleAnswerClick(answer)}
                    >
                      {answer.answerText}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </main>
          <footer className="flow-root pb-9 px-6 bottom mb-0">
            <div className="float-left flex flex-col">
              {!started ? null : <Button onClick={handleBack}>{"Back"}</Button>}
            </div>
            <div className="float-right flex flex-col">
              <p>{isCurrentCorrect ? "correct" : "incorrect"}</p>
              <Button onClick={handleNext}>
                {!started
                  ? "Start"
                  : currentQuestion !== quizQuestions.length - 1
                    ? "Next"
                    : "Submit"}{" "}
              </Button>
            </div>
          </footer>
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center">
          <h1>Quiz Results</h1>
          <p>
            You scored {score} out of {quizQuestions.length}
          </p>
          <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
        </div>
      )}
    </div>
  );
};

export default page;
