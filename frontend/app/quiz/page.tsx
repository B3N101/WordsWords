import { auth } from "@/auth/auth";
import QuizPage from "./quiz";
import { getQuestions } from "@/prisma/queries";

const page = async () => {
  const quizId = "cly3se4i80000nue034hzq655"; // TODO: get quizID from somewhere else
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const quizQuestions = await getQuestions(quizId);
  return (
    <div>
      <h1>Quiz</h1>
      <QuizPage quizId={quizId} questions={quizQuestions} />
    </div>
  );
};

export default page;
