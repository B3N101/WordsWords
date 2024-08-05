import { auth } from "@/auth/auth";
import QuizPage from "@/components/quiz/quiz";
import { getQuestions, getQuiz, getUserQuizProgress } from "@/prisma/queries";

const page = async ({ params }: { params: { slug: string } }) => {
  const quizId = params.slug;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const userQuizProgress = await getUserQuizProgress(userId, quizId);
  if (!userQuizProgress) {
    throw new Error("User quiz not found");
  }
  return (
    <div>
      <h1>Quiz</h1>
      <QuizPage userQuiz={userQuizProgress} />
    </div>
  );
};

export default page;
