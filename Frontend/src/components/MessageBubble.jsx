import { Card, Badge } from 'react-bootstrap';
import { Clock } from 'react-bootstrap-icons';

const MessageBubble = ({ 
  message,
  timestamp,
  variant = 'light',
  borderless = false,
  className,
  style
}) => {
  const formatTimestamp = (date) => {
    return new Date(date).toLocaleString('ru-RU', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card
      border={borderless ? null : variant}
      bg={variant}
      text={variant === 'light' ? 'dark' : 'white'}
      className={`mb-3 ${className}`}
      style={{ 
        maxWidth: '600px',
        minWidth: '400px',
        borderRadius: '20px',
        ...style 
      }}
    >
      <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-bottom-0 mb-0 pb-0">
        <div >
        </div>
        <Badge pill bg={variant} text={variant === 'light' ? 'dark' : 'white'}>
          <Clock className="me-1 mb-1" />
          {formatTimestamp(timestamp)}
        </Badge>
      </Card.Header>
      
      <Card.Body className="pt-0">
        <Card.Text>{message}</Card.Text>
      </Card.Body>
    </Card>
  );
};


export default MessageBubble;