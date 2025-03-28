import { useEffect, useState } from 'react';
import { Form, Card, ListGroup, Badge, Button } from 'react-bootstrap';

const MultiSelectSearch = ({ options, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [selected, setSelected] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  useEffect(() => {
    const firstSelected = options.filter(opt => opt.isEnrolled).map((opt) => opt.value);
    setSelected(firstSelected);
  }, [options, setSelected])
  
  const filteredOptions = options.filter(option => {
    const matchesSearch = option.label.toLowerCase().includes(searchTerm.toLowerCase());
    const isSelected = selected.includes(option.value);
    return showSelectedOnly ? isSelected && matchesSearch : matchesSearch;
  });

  const displayedOptions = showSelectedOnly 
    ? filteredOptions.filter(option => selected.includes(option.value))
    : filteredOptions;

  const handleToggle = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    
    setSelected(newSelected);
    onSelectionChange(newSelected);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light p-2">
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            className="flex-grow-1 border-0"
          />
          <Button
            variant={showSelectedOnly ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setShowSelectedOnly(!showSelectedOnly)}
            title="Toggle selected only"
          >
            Записанные
          </Button>
          <Badge pill bg="primary">
            {selected.length}
          </Badge>
        </div>
      </Card.Header>
      
      <Card.Body className="p-0">
        <ListGroup variant="flush" style={{ 
          maxHeight: '860px',
          overflowY: 'auto',
          minHeight: '48px'
        }}>
          {displayedOptions.map(option => (
            <ListGroup.Item
              key={option.value}
              action
              onClick={() => handleToggle(option.value)}
              active={selected.includes(option.value)}
              className="py-2 px-3"
            >
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  readOnly
                  className="me-2"
                />
                <span className="text-truncate">{option.label}</span>
              </div>
            </ListGroup.Item>
          ))}
          
          {displayedOptions.length === 0 && (
            <ListGroup.Item className="text-muted py-2 px-3">
              {showSelectedOnly ? 'Нет записанных студентов' : 'Нет совпадений'}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default MultiSelectSearch;