import { auth } from "@/auth/auth";
import {
  getUserQuizProgress,
  getUserQuizzes,
  getWords,
} from "@/prisma/queries";
import Dashboard from "@/components/quiz/dashboard";
import ContextPage from "@/app/learn/context";
const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const quizzes = await getUserQuizzes(userId);
  const words = await getWords();

  return (
    <div>
      <h1>Quiz Context</h1>
      {/* <Dashboard quizzes={quizzes}/> */}
    </div>
  );
};

export default page;
