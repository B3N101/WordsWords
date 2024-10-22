import prisma from "@/prisma/prisma";
import { Metadata } from "next";
import StudyQuizPage from "@/components/study/studySpaceQuiz";
export const metadata: Metadata = {
  title: "MX Words Words | Study Quiz",
  description: "MX Words Words Study Quiz",
};

async function getQuiz(studySpaceID: string) {
  const data = await prisma.studySpace.findFirst({
    where: {
      id: studySpaceID,
    },
    include: {
      StudySpaceWords: {
        include: {
          word: true,
        },
      },
      StudySpaceQuizzes:
      {
        include: {
          questions: {
            include: {
              studyWord: {
                include: {
                  word: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!data) {
    throw new Error("StudySpace not found");
  }
  const quizzes = data.StudySpaceQuizzes!.filter((quiz) => quiz.studyType == "FLASHCARD");
  return quizzes[0];
}


const page = async ({ params }: { params: { studySpaceID: string, classID: string} }) => {
  const quiz = await getQuiz(params.studySpaceID);
  if (!quiz) {
      throw new Error("No quiz found");
  }
  // shuffle the answers in all questions
  quiz.questions.forEach((question) => {
    question.allAnswers = question.allAnswers.sort(() => Math.random() - 0.5);
  });
  return <StudyQuizPage quiz={quiz} classID={params.classID} />;

};

export default page;
