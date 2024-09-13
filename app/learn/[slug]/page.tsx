import { auth } from "@/auth/auth";
import ContextPage from "@/components/quiz/learn";
import { getLearnQuiz } from "@/prisma/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | Learn",
  description: "MX Words Words Learn",
};

const page = async ({ params }: { params: { slug: string } }) => {
  const quizId = params.slug;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const { words, classId, wordListId } = await getLearnQuiz(quizId);

  if (!words || !classId || !wordListId) {
    throw new Error("Error retreiving data");
  }

  return (
    <div>
      <ContextPage
        words={words}
        quizId={quizId}
        classId={classId}
        wordsListId={wordListId}
      />
    </div>
  );
};

export default page;
