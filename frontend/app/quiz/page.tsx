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
      <h1>Quiz Context</h1>
      <Dashboard quizzes={quizzes} masterQuizzes={masterQuizzes}/>
    </div>
  );
};

export default page;
