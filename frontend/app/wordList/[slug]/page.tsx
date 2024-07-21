import WordListPage from "../components/wordListPage";

export default function Page({ params }: { params: { wordListId: string } }) {
  const wordListString = params.wordListId;

  return (
    <div>
      <h1>WordList page for {wordListString}</h1>
      {/* Add your class page content here */}
        <WordListPage wordListID={wordListString} />
    </div>
  );
}
