"use server";
import { PrismaClient, QuizType, Question } from "@prisma/client";
import { create } from "domain";
const prisma = new PrismaClient();

function pickNRandom(arr: string[], n: number){
    const result = new Array(n);
    let len = arr.length;
    const taken = new Array(len);
    if (n > len){
        throw new RangeError("getRandom: more elements taken than available");
    }
    while(n--){
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
export const createMiniQuiz = async (wordListId: string, userId: string, miniSetId: number, learnCompleted: boolean) => {
    const wordList = await prisma.wordsList.findFirst({
        where: {
            listId: wordListId,
        },
        include:{
            words: true
        }
    });
    if (!wordList){
        throw new Error("Word list not found");
    }
    // get the words associated with the correct miniquiz
    const allwords = wordList.words;
    const words = allwords.slice(miniSetId*5, (miniSetId+1)*5);
    console.log(allwords, words);
    if (words.length === 0){
        return null;
    }
    const questions = words.map((word, index) => {
        // Take two of the incorrect definitions at random
        const answerChoices = pickNRandom(word.incorrectDefinitions, 3)
        // add the correct definition
        answerChoices.push(word.definition)
        return {
            questionString: "What is the definition of " + word.word + "?",
            rank: index,
            allAnswers: answerChoices,
            correctAnswer: word.definition,
            wordId: word.wordId,
        }
    })

    const quiz = await prisma.quiz.create({
        data:{
            user: { connect: { id: userId } },
            wordsList: { connect: { listId: wordListId } },
            quizType: QuizType.MINI,
            name: wordListId + "_mini_quiz_" + miniSetId,
            miniSetNumber: miniSetId,
            learnCompleted: learnCompleted,
            userWordsListProgress: { 
                connectOrCreate: {
                    create:{
                        user: { connect: { id: userId }},
                        wordsList: { connect: { listId: wordListId }},
                    },
                    where: {
                        userWordsListProgressId:{
                            userId: userId,
                            wordsListListId: wordListId,
                        },
                    }
                }
            },
            questions:{
                createMany:{
                    data: questions
                }
            }
        }
    })
    return quiz;
}

export const createMasterQuiz = async (wordListId: string, userId: string) => {
    const wordList = await prisma.wordsList.findFirst({
        where: {
            listId: wordListId,
        },
        include:{
            words: true
        }
    });
    if (!wordList){
        throw new Error("Word list not found");
    }
    const words = wordList.words;
    // retrieve the 5 words with the lowest mastery score from other lists
    const oldWords = await prisma.userWordMastery.findMany({
        where: {
            userId: userId,
            word: {
                listId: {
                    not: wordListId,
                },
            },
        },
        orderBy: {
            masteryScore: "asc",
        },
        select: {
            word: true
        },
        take: 5,
    });
    const allWords = words.concat(oldWords.flatMap((word) => word.word));

    const questions = allWords.map((word, index) => {
        // Take two of the incorrect definitions at random
        const answerChoices = pickNRandom(word.incorrectDefinitions, 3)
        // add the correct definition
        answerChoices.push(word.definition)
        return {
            questionString: "What is the definition of " + word.word + "?",
            rank: index,
            allAnswers: answerChoices,
            correctAnswer: word.definition,
            wordId: word.wordId,
        }
    })
    const quiz = await prisma.quiz.create({
        data:{
            user: { connect: { id: userId } },
            wordsList: { connect: { listId: wordListId } },
            name: wordListId + "_master_quiz",
            quizType: QuizType.MASTERY,
            miniSetNumber: -1,
            learnCompleted: true,
            userWordsListProgress: { 
                connectOrCreate: {
                    create:{
                        user: { connect: { id: userId }},
                        wordsList: { connect: { listId: wordListId }},
                    },
                    where: {
                        userWordsListProgressId:{
                            userId: userId,
                            wordsListListId: wordListId,
                        },
                    }
                }
            },
            questions:{
                createMany:{
                    data: questions
                }
            }
        }
    })
    return quiz;
}

// Fetchquizzes used in every wordlist page to get the active quiz
export const fetchQuizzes = async (wordListId: string, userId: string) => {

    let miniQuizzes = [];

    for (let miniSetNumber = 0; miniSetNumber < 3; miniSetNumber++) {
        let latestQuiz = await prisma.quiz.findFirst({
            where: {
                wordsListId: wordListId,
                userId: userId,
                quizType: QuizType.MINI,
                miniSetNumber: miniSetNumber,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!latestQuiz) {
            latestQuiz = await createMiniQuiz(wordListId, userId, miniSetNumber, false);
        }

        if (latestQuiz) {
            miniQuizzes.push(latestQuiz);
        }
    }

    // check if all the miniquizzes are completed. If not, no master quiz
    for (let miniquiz of miniQuizzes){
        if (!miniquiz.completed){
            return { miniQuizzes, masterQuiz: null };
        }
    }
    // otherwise a masterquiz is either available or needs to be created
    let masterQuiz = await prisma.quiz.findFirst({
        where: {
            wordsListId: wordListId,
            userId: userId,
            quizType: QuizType.MASTERY,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
    if (!masterQuiz){
        masterQuiz = await createMasterQuiz(wordListId, userId);
    }
    return { miniQuizzes, masterQuiz };
}