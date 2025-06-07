import { Accordion, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserProtocols = ({ practTitle, userProtocol }) => {
  const navigate = useNavigate();
  const handleSelectProtocol = (testResultId, username, tryNumber) => {
    navigate("/testProtocol", {
      state: {
        testResultId,
        username,
        practName: practTitle,
        tryNumber: tryNumber,
      },
    });
  };
  return (
    <div className="mb-3 shadow" style={{ borderRadius: "20px" }}>
      <Accordion defaultActiveKey={[]} className="mb-5">
        <style>
          {`.accordion-button:not(.collapsed) {
                background-color: transparent !important;
                box-shadow: none !important;
                }
                .accordion-button:focus {
                box-shadow: none !important;
                border-color: transparent !important;
                }`}
        </style>
        <Accordion.Item eventKey={"0"} className="border-0">
          <Accordion.Header className="borderless mb-3 d-flex justify-content-between gap-2">
            <div className="fw-bold">
              Выполнивший студент: {userProtocol.name}
              <br />
              {userProtocol.isGraded && (
                <div className="fw-bold">
                  Итоговая оценка за тест и задания: {userProtocol.grade}
                </div>
              )}
              {!userProtocol.isGraded && (
                <div className="fw-bold">Итоговая оценка не получена</div>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body
            className="p-3 d-flex flex-column justify-content-start gap-2"
            style={{ borderTop: 0 }}
          >
            {userProtocol.testProtocols?.map((prot) => (
              <Card
                key={prot.id}
                className="hover-overlay mb-3"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleSelectProtocol(prot.id, prot.name, prot.tryNumber)
                }
              >
                <Card.Header className="mb-0">
                  <Card.Title>Попытка прохождения теста №{prot.tryNumber}</Card.Title>
                </Card.Header>
                <Card.Body>
                  Оценка за тест: {prot.grade}
                  <br />
                  Выполнено: {prot.score.toFixed(2)}/{prot.maxScore.toFixed(2)},{" "}
                  {((prot.score / prot.maxScore) * 100).toFixed(2)}%
                </Card.Body>
              </Card>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default UserProtocols;
