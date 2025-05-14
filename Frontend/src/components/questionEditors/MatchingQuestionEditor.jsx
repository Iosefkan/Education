import { useState } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { PlusCircle, Trash } from "react-bootstrap-icons";
import "../../css/numInput.css";

const MatchingQuestionEditor = ({
  onSave,
  initText = "",
  initWeight = "",
  initMatches = [],
  showCancel = false,
  onCancel = null,
  id,
}) => {
  const [questionText, setQuestionText] = useState(initText);
  const [questionWeight, setQuestionWeight] = useState(initWeight);
  const [matches, setMatches] = useState(initMatches);
  const [errors, setErrors] = useState({});

  const addMatch = () => {
    setMatches([
      ...matches,
      { id: Date.now(), left: "", right: "", weight: "" },
    ]);
  };

  const deleteMatch = (matchId) => {
    setMatches(matches.filter((m) => m.id !== matchId));
  };

  const handleMatchChange = (matchId, field, value) => {
    setMatches(
      matches.map((m) => (m.id === matchId ? { ...m, [field]: value } : m))
    );
  };

  const handleValidateWeight = (e) => {
    if (e.target.value < 0 || e.target.value > 1) {
      e.target.value = "";
    }
  };

  const handleValidateQuestionWeight = (e) => {
    if (e.target.value < 0) {
      e.target.value = "";
    }
  };

    const handleKeyDown = (e, matchid, field, value) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let newVal = Number(value) + 0.1;
      handleMatchChange(matchid, field, newVal > 1 ? value : newVal.toFixed(1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      let newVal = Number(value) - 0.1;
      handleMatchChange(matchid, field, newVal < 0 ? value : newVal.toFixed(1));
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
  };

  const validate = () => {
    const newErrors = {};
    const leftValues = [];
    const rightValues = [];
    if (!questionText.trim()) newErrors.question = "Заполните текст вопроса";
    if (!questionWeight) newErrors.weight = "Введите вес вопроса";
    let accWeight = 0;

    matches.forEach((match) => {
      if (!match.left.trim()) {
        newErrors[`left-${match.id}`] = "Заполните левую сторону соотнесения";
      }
      if (!match.right.trim()) {
        newErrors[`right-${match.id}`] = "Заполните правую сторону соотнесения";
      }

      if (!match.weight) {
        newErrors[`weight-${match.id}`] = "Введите вес";
      } else {
        accWeight += Number(match.weight);
      }

      if (leftValues.includes(match.left.trim())) {
        newErrors[`left-${match.id}`] = "Повторяющиеся опции на левой стороне";
      }
      if (rightValues.includes(match.right.trim())) {
        newErrors[`right-${match.id}`] =
          "Повторяющиеся опции на правой стороне";
      }

      leftValues.push(match.left.trim());
      rightValues.push(match.right.trim());
    });

    if (matches.length < 2) {
      newErrors.general = "Должно быть как минимум два соотнесения";
    }

    if (Math.abs(accWeight - 1 ) > 0.00001) {
      newErrors.general = "Общий вес ответов должен равняться 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const questionData = {
      type: 3,
      matches: matches.map(({ left, right, weight }, index) => ({
        right: {
          id: `q${index + 1}`,
          text: right,
        },
        left: {
          id: `a${index + 1}`,
          text: left,
        },
        weight,
      })),
      text: questionText,
      weight: questionWeight,
    };

    onSave(questionData);
    setQuestionText('');
    setQuestionWeight('');
    setMatches([]);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Вопрос {id}</h5>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-4">
          <Form.Label>Текст вопроса</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            isInvalid={!!errors.question}
            placeholder="Введите текст вопроса"
          />
          <Form.Control.Feedback type="invalid">
            {errors.question}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Вес вопроса</Form.Label>
          <Form.Control
            type="number"
            value={questionWeight}
            onChange={(e) => {
              handleValidateQuestionWeight(e);
              setQuestionWeight(e.target.value);
            }}
            isInvalid={!!errors.weight}
            placeholder="Введите вес вопроса"
          />
          <Form.Control.Feedback type="invalid">
            {errors.weight}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Соотнесения</h5>
          <Button variant="outline-primary" onClick={addMatch}>
            <PlusCircle className="me-2" />
            Добавить соотнесение
          </Button>
        </div>

        {errors.general && (
          <Alert variant="danger" className="mt-3">
            {errors.general}
          </Alert>
        )}

        <ListGroup variant="flush">
          {matches.map((match) => (
            <ListGroup.Item key={match.id} className="py-3">
              <Row className="g-3 align-items-center">
                <Col md={5}>
                  <Form.Control
                    value={match.left}
                    onChange={(e) =>
                      handleMatchChange(match.id, "left", e.target.value)
                    }
                    placeholder="Введите опцию"
                    isInvalid={!!errors[`left-${match.id}`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`left-${match.id}`]}
                  </Form.Control.Feedback>
                </Col>
                <Col md={5}>
                  <Form.Control
                    value={match.right}
                    onChange={(e) =>
                      handleMatchChange(match.id, "right", e.target.value)
                    }
                    placeholder="Введите опцию"
                    isInvalid={!!errors[`right-${match.id}`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`right-${match.id}`]}
                  </Form.Control.Feedback>
                </Col>
                <Col md={1}>
                  <Form.Control
                    type="number"
                    className="no-spinners"
                    value={match.weight}
                    onChange={(e) => {
                      handleValidateWeight(e);
                      handleMatchChange(match.id, "weight", e.target.value);
                    }}
                    placeholder="Вес"
                    onKeyDown={(e) => handleKeyDown(e, match.id, "weight", e.target.value)}
                    onWheel={handleWheel}
                    isInvalid={!!errors[`weight-${match.id}`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`weight-${match.id}`]}
                  </Form.Control.Feedback>
                </Col>
                <Col md={1} className="text-center">
                  <Button
                    variant="outline-danger"
                    onClick={() => deleteMatch(match.id)}
                    aria-label="Delete match"
                  >
                    <Trash />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="d-flex justify-content-end mt-4 gap-2">
          <Button variant="primary" onClick={handleSave}>
            Сохранить вопрос
          </Button>
          {showCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Отменить редактирование
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MatchingQuestionEditor;
