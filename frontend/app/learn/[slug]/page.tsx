import { auth } from "@/auth/auth";
import ContextPage from "@/app/learn/context";
import { getQuizWords} from "@/prisma/queries";

const page = async ({ params }: { params: { slug: string } }) => {
    const quizId = params.slug;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("User not found");
    }
    const words = await getQuizWords(quizId);
    if(!words){
        throw new Error("Words not found");
    }
    console.log(words);

    return (
    <div>
        <h1>Learn!</h1>
        <ContextPage words={words} quizId={quizId}/>
    </div>
    );
};

export default page;
