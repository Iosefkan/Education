import { useState } from "react";
import { Button, Accordion } from "react-bootstrap";
import CreateCommentModal from "./sidebars/CreateCommentModal";
import MessageBubble from "./MessageBubble";

const FileWithComments = ({ file, onAddComment, onAccept }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateComment = (commentText) => {
    onAddComment(file.id, commentText);
    setShowModal(false);
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
            <div className="flex-grow-1">
              <div className="fw-bold">
                Выполнивший студент: {file.fullName}
                {file.isAccepted && <span className="me-2 text-primary"> (принято)</span>}
                {!file.isAccepted && file.isUpdated && <span className="me-2 text-primary"> (обновлено)</span>}
              </div>
              <a href={file.path} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </div>
            {!file.isAccepted && (
              <div className="d-flex justify-content-end gap-3 me-4">
                <Button onClick={onAccept}>Принять работу</Button>
                <Button onClick={() => setShowModal(true)}>
                  Добавить комментарий
                </Button>
              </div>
            )}
          </Accordion.Header>
          <Accordion.Body
            className="p-3 d-flex flex-column justify-content-start gap-2"
            style={{ borderTop: 0 }}
          >
            {file.comments?.map((comment) => (
              <MessageBubble
                key={comment.id}
                message={comment.text}
                timestamp={comment.created}
                variant={comment.isGenerated ? "primary" : "light"}
                className={comment.isGenerated ? "align-self-center text-center mx-auto" : ""}
                style={comment.isGenerated ? { minWidth: "200px", maxWidth: "300px" } : {}}
              />
            ))}
            {file.comments == null ||
              (file.comments.length === 0 && <div>Нет комментариев</div>)}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <CreateCommentModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreate={handleCreateComment}
      />
    </div>
  );
};

export default FileWithComments;
