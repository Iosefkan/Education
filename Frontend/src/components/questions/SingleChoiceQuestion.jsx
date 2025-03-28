import { useState } from 'react';
import { Card, Badge, ListGroup, Form } from 'react-bootstrap';

const SingleChoiceQuestion = ({
  questionId,
  questionText,
  options,
  onSelect
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    let answer = { answer: optionId}
    onSelect(questionId, answer);
  };

  return (
    <Card className="mb-4">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{questionText}</h5>
        <Badge pill bg="secondary">
          Один ответ
        </Badge>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {options.map((option, index) => (
            <ListGroup.Item 
              key={option.id}
              action
              onClick={(e) => {
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