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
  return (
    <div>
      <h1>Quiz</h1>
      <QuizPage quiz={quiz} />
    </div>
  );
};

export default page;
