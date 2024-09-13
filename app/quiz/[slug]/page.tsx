import { auth } from "@/auth/auth";
import QuizPage from "@/components/quiz/quiz";
import RequestRetakePage from "@/components/quiz/retake";
import { getQuiz } from "@/prisma/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | Quiz",
  description: "MX Words Words Quiz",
};

const page = async ({ params }: { params: { slug: string } }) => {
  const quizId = params.slug;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const quiz = await getQuiz(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  // shuffle the answers in all questions
  quiz.questions.forEach((question) => {
    question.allAnswers = question.allAnswers.sort(() => Math.random() - 0.5);
  });

  const miniSet = quiz.miniSetNumber === -1 ? 3 : quiz.miniSetNumber; // masterQuizzes have setnumber -1
  const hasAttemptsRemaining =
    quiz.userWordsListProgress.quizAttemptsRemaining[miniSet];
  return (
    <div>
      {hasAttemptsRemaining ? (
        <QuizPage quiz={quiz} userID={userId} />
      ) : (
        <RequestRetakePage quiz={quiz} />
      )}
    </div>
  );
};

export default page;
