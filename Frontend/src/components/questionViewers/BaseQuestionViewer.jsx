import SingleChoiceQuestionViewer from "./SingleChoiceQuestionViewer";
import MultipleChoiceQuestionViewer from "./MultipleChoiceQuestionViewer";
import MatchingQuestionViewer from "./MatchingQuestionViewer";
import ShortAnswerQuestionViewer from "./ShortAnswerQuestionViewer";
import { ListGroup } from "react-bootstrap";

const BaseQuestionViewer = ({ 
  data = [], 
  length, 
  onUpdate, 
  onDelete,
  itemsPerPage,
  currentPage
 }) => {
  return (
    <ListGroup>
      {data
        ?.map((question, ind) =>
          question.type == 1 ? (
            <SingleChoiceQuestionViewer
              key={question.id}
              id={question.id}
              questionId={length - ((itemsPerPage * (currentPage - 1)) + ind)}
              questionText={question.text}
              answers={question.answer.answers}
              questionWeight={question.weight}
              correctAnswerId={question.answer.correctAnswerId}
              onUpdate={(quetionData) => onUpdate(quetionData)}
              onDelete={() => onDelete(question.id)}
            />
          ) : question.type == 2 ? (
            <MultipleChoiceQuestionViewer
              key={question.id}
              id={question.id}
              questionId={length - ((itemsPerPage * (currentPage - 1)) + ind)}
              questionText={question.text}
              options={question.answer.answers}
              questionWeight={question.weight}
              correctAnswers={question.answer.correctAnswers}
              onUpdate={(quetionData) => onUpdate(quetionData)}
              onDelete={() => onDelete(question.id)}
            />
          ) : question.type == 3 ? (
            <MatchingQuestionViewer
              key={question.id}
              id={question.id}
              questionId={length - ((itemsPerPage * (currentPage - 1)) + ind)}
              questionText={question.text}
              questionWeight={question.weight}
              matches={question.answer.matches}
              onUpdate={(quetionData) => onUpdate(quetionData)}
              onDelete={() => onDelete(question.id)}
            />
          ) : question.type == 4 ? (
            <ShortAnswerQuestionViewer
              key={question.id}
              id={question.id}
              questionId={length - ((itemsPerPage * (currentPage - 1)) + ind)}
              questionText={question.text}
              questionWeight={question.weight}
              correctAnswer={question.answer.answer}
              onUpdate={(quetionData) => onUpdate(quetionData)}
              onDelete={() => onDelete(question.id)}
            />
          ) : (
            <></>
          )
        )}
    </ListGroup>
  );
};

export default BaseQuestionViewer;