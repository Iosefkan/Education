import { useState } from 'react';
import { Card, ListGroup, Form, Badge } from 'react-bootstrap';

const MultipleChoiceQuestion = ({
  questionId,
  questionText,
  options,
  onSelect
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleOptionSelect = (optionId) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    
    setSelectedOptions(newSelection);
    onSelect(questionId, newSelection);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{questionText}</h5>
        <Badge pill bg="secondary">
          Нексолько ответов
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
              style={{ cursor: 'pointer' }}
            >
              <Form.Check 
                type="checkbox"
                id={`option-${questionId}-${index}`}
                checked={selectedOptions.includes(option.id)}
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

export default MultipleChoiceQuestion;