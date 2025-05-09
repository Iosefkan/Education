import SingleChoiceQuestion from "./SingleChoiceQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import MatchingQuestion from "./MatchingQuestion";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import { ListGroup } from "react-bootstrap";

const BaseQuestion = ({
  data = [],
  setAnswers,
  answers,
  itemsPerPage,
  currentPage,
}) => {
  return (
    <ListGroup>
      {data?.map((option, ind) =>
        option.type == 1 ? (
          <SingleChoiceQuestion
            showId={(itemsPerPage * (currentPage - 1) + ind + 1)}
            key={option.id}
            questionId={option.id}
            questionText={option.text}
            options={option.body.options}
            isReadonly={false}
            onSelect={(ans) =>
              setAnswers(
                answers.map((a) =>
                  a.id === option.id ? { ...a, answer: ans } : a
                )
              )
            }
          />
        ) : option.type == 2 ? (
          <MultipleChoiceQuestion
            showId={(itemsPerPage * (currentPage - 1) + ind + 1)}
            key={option.id}
            questionId={option.id}
            questionText={option.text}
            options={option.body.options}
            isReadonly={false}
            onSelect={(ans) =>
              setAnswers(
                answers.map((a) =>
                  a.id === option.id ? { ...a, answer: JSON.stringify(ans) } : a
                )
              )
            }
          />
        ) : option.type == 3 ? (
          <MatchingQuestion
            showId={(itemsPerPage * (currentPage - 1) + ind + 1)}
            key={option.id}
            questionId={option.id}
            questionText={option.text}
            leftItems={option.body.leftItems}
            rightItems={option.body.rightItems}
            isReadonly={false}
            onMatch={(ans) =>
              setAnswers(
                answers.map((a) =>
                  a.id === option.id ? { ...a, answer: JSON.stringify(ans) } : a
                )
              )
            }
          />
        ) : option.type == 4 ? (
          <ShortAnswerQuestion
            showId={(itemsPerPage * (currentPage - 1) + ind + 1)}
            key={option.id}
            questionId={option.id}
            questionText={option.text}
            isReadonly={false}
            onSave={(ans) =>
              setAnswers(
                answers.map((a) =>
                  a.id === option.id ? { ...a, answer: ans } : a
                )
              )
            }
          />
        ) : (
          <></>
        )
      )}
    </ListGroup>
  );
};

export default BaseQuestion;
