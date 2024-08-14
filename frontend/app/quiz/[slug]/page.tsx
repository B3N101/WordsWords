import { auth } from "@/auth/auth";
import QuizPage from "@/components/quiz/quiz";
import { getQuiz } from "@/prisma/queries";

const page = async ({ params }: { params: { slug: string } }) => {
  const quizId = params.slug;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const quiz = await getQuiz(quizId);
  if(!quiz){
    throw new Error("Quiz not found");
  }
  // shuffle the answers in all questions
  quiz.questions.forEach((question) => {
    question.allAnswers = question.allAnswers.sort(() => Math.random() - 0.5);
  });
  return (
    <div>
      <QuizPage quiz={quiz} />
    </div>
  );
};

export default page;
