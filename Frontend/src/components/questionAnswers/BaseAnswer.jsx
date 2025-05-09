import SingleChoiceAnswerViewer from "./SingleChoiceAnswerViewer";
import MultipleChoiceAnswerViewer from "./MultipleChoiceAnswerViewer";
import MatchingAnswerViewer from "./MatchingAnswerViewer";
import ShortAnswerViewer from "./ShortAnswerViewer";
import { ListGroup } from "react-bootstrap";

const BaseAnswer = ({
  data = [],
  itemsPerPage,
  currentPage,
}) => {
  return (
    <ListGroup>
      {data?.map((option, ind) =>
        option.type == 1 ? (
          <SingleChoiceAnswerViewer
            questionId={(itemsPerPage * (currentPage - 1) + ind + 1)}
            key={option.id}
            questionWeight={option.questionWeight}
            questionText={option.questionText}
            questionScore={option.questionScore}
            answers={option.answers}
          />
        ) : option.type == 2 ? (
          <MultipleChoiceAnswerViewer
            questionId={(itemsPerPage * (currentPage - 1) + ind + 1)}
            key={option.id}
            questionWeight={option.questionWeight}
            questionText={option.questionText}
            questionScore={option.questionScore}
            options={option.options}
          />
        ) : option.type == 3 ? (
          <MatchingAnswerViewer
            questionId={(itemsPerPage * (currentPage - 1) + ind + 1)}
            key={option.id}
            questionWeight={option.questionWeight}
            questionText={option.questionText}
            questionScore={option.questionScore}
            matches={option.matches}
          />
        ) : option.type == 4 ? (
          <ShortAnswerViewer
            questionId={(itemsPerPage * (currentPage - 1) + ind + 1)}
            key={option.id}
            questionWeight={option.questionWeight}
            questionText={option.questionText}
            questionScore={option.questionScore}
            answer={option.answer}
            isCorrect={option.isCorrect}
          />
        ) : (
          <></>
        )
      )}
    </ListGroup>
  );
};

export default BaseAnswer;
