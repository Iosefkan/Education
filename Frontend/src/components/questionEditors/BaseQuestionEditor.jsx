import SingleChoiceQuestionEditor from "./SingleChoiceQuestionEditor";
import MultipleChoiceQuestionEditor from "./MultipleChoiceQuestionEditor";
import MatchingQuestionEditor from "./MatchingQuestionEditor";
import ShortAnswerQuestionEditor from "./ShortAnswerQuestionEditor";

const BaseQuestionEditor = ({ type, onCreate }) => {
  return (
    <>
      {type == 1 && (
        <SingleChoiceQuestionEditor
          onSave={onCreate}
        />
      )}

      {type == 2 && (
        <MultipleChoiceQuestionEditor
          onSave={onCreate}
        />
      )}

      {type == 3 && (
        <MatchingQuestionEditor
          onSave={onCreate}
        />
      )}

      {type == 4 && (
        <ShortAnswerQuestionEditor
          onSave={onCreate}
        />
      )}
    </>
  );
};

export default BaseQuestionEditor;
