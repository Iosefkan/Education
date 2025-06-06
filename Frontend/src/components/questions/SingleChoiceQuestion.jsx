import { useState } from 'react';
import { Card, Badge, ListGroup, Form } from 'react-bootstrap';

const SingleChoiceQuestion = ({
  showId,
  questionId,
  questionText,
  options,
  onSelect,
  isReadonly = false
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    onSelect(optionId);
  };

  return (
    <Card className="mb-4">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Вопрос {showId}: {questionText}</h5>
        <Badge pill bg="secondary">
          Один ответ
        </Badge>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {options.map((option, index) => (
            <ListGroup.Item 
              key={option.id}
              action={!isReadonly}
              onClick={(e) => {
                if (isReadonly) return;
                e.preventDefault();
                handleOptionSelect(option.id)
              }}
              className="d-flex align-items-center py-3"
            >
              <Form.Check 
                type="radio"
                id={`option-${questionId}-${index}`}
                name={`question-${questionId}`}
                checked={selectedOption === option.id}
                disabled={isReadonly}
                onChange={() => {}}
                label={option.text}
                className="w-100"
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default SingleChoiceQuestion;