import { useState } from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';

const MatchingQuestion = ({
  showId,
  questionId,
  questionText,
  leftItems,
  rightItems,
  onMatch,
  isReadonly = false
}) => {
  const [matches, setMatches] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (itemId, isLeft) => {
    setDraggedItem({ id: itemId, isLeft });
  };

  const handleDrop = (targetId, isLeft) => {
    if (!draggedItem || draggedItem.isLeft === isLeft) return;

    const newMatches = { ...matches };

    if (isLeft) {
      if (!draggedItem.isLeft) {
        const existingLeft = Object.keys(newMatches).find(
          key => newMatches[key] === draggedItem.id
        );
        if (existingLeft) delete newMatches[existingLeft];
      }
    } else {
      const draggedLeftId = draggedItem.id;
      const targetRightId = targetId;

      delete newMatches[draggedLeftId];
      const existingLeft = Object.keys(newMatches).find(
        key => newMatches[key] === targetRightId
      );
      if (existingLeft) delete newMatches[existingLeft];

      newMatches[draggedLeftId] = targetRightId;
    }

    setMatches(newMatches);
    let answer = Object.keys(newMatches).map((value) => { return { left: value, right: newMatches[value] }})
    onMatch(answer);
    setDraggedItem(null);
  };

  const getMatchedText = (leftId) => {
    const matchId = matches[leftId];
    return rightItems.find(item => item.id === matchId)?.text || 'Не соотнесен';
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Вопрос {showId}: {questionText}</h5>
        <Badge pill bg="secondary">
          Соотнесение
        </Badge>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={5}>
            {leftItems.map((leftItem) => (
              <div
                key={leftItem.id}
                className="match-item mb-2 p-3 border rounded"
                draggable={!isReadonly}
                onDragStart={() => handleDragStart(leftItem.id, true)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(leftItem.id, true)
                }}
                style={{
                  backgroundColor: matches[leftItem.id] ? '#e8f4ff' : 'white',
                  cursor: 'move',
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>{leftItem.text}</span>
                  {!isReadonly && (<Badge bg="light" text="dark" className="ms-2">
                    {getMatchedText(leftItem.id)}
                  </Badge>)}
                </div>
              </div>
            ))}
          </Col>

          <Col md={2} className="text-center d-flex align-items-center">
            <div className="w-100">
              {!isReadonly && (<Button variant="light" disabled className="my-2">
                Соотнести →
              </Button>)}
            </div>
          </Col>

          <Col md={5}>
            {rightItems.map((rightItem) => {
              const isMatched = Object.values(matches).includes(rightItem.id);
              return (
                <div
                  key={rightItem.id}
                  className="match-item mb-2 p-3 border rounded"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(rightItem.id, false)}
                  style={{
                    backgroundColor: isMatched ? '#e8f4ff' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  {rightItem.text}
                </div>
              );
            })}
          </Col>
        </Row>

        {!isReadonly && (<div className="text-center mt-4">
          <Button
            variant="outline-danger"
            onClick={() => {
              setMatches({});
              onMatch(questionId, {});
            }}
          >
            Сбросить ответы
          </Button>
        </div>)}
      </Card.Body>
    </Card>
  );
};

export default MatchingQuestion;