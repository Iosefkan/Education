import { useState, useEffect } from 'react';
import { Accordion, Form, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import SingleChoiceQuestion from "../components/questions/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../components/questions/MultipleChoiceQuestion";
import MatchingQuestion from "../components/questions/MatchingQuestion";
import ShortAnswerQuestion from "../components/questions/ShortAnswerQuestion";

const AccordionMultiSelect = ({ options, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  useEffect(() => {
    const firstSelected = options.filter(opt => opt.isSelected).map((opt) => opt.id);
    setSelectedItems(firstSelected);
  }, [options, setSelectedItems])
  

  const filteredOptions = options.filter(option =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedOptions = showSelectedOnly 
    ? filteredOptions.filter(option => selectedItems.includes(option.id))
    : filteredOptions;

  const handleSelect = (itemId) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    setSelectedItems(newSelection);
    onSelectionChange(newSelection);
  };

  const toggleAccordion = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const handleSelectAll = () => {
    const allVisibleIds = displayedOptions.map(opt => opt.id);
    const newSelection = selectedItems.length === allVisibleIds.length ? 
      [] : 
      [...new Set([...selectedItems, ...allVisibleIds])];
    
    setSelectedItems(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light p-2">
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative flex-grow-1">
            <Form.Control
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-5"
            />
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          </div>
            <Button
              variant={showSelectedOnly ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setShowSelectedOnly(!showSelectedOnly)}
              title="Toggle selected only"
            >
              Выбранные
            </Button>
          <Badge pill bg="primary">{selectedItems.length}</Badge>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="px-3 py-2 border-bottom">
          <Button
            variant="link"
            size="sm"
            className="text-primary p-0"
            onClick={handleSelectAll}
          >
            {selectedItems.length === displayedOptions.length ? 
              'Отменить выбор всех' : 
              'Выбрать все видимые'}
          </Button>
        </div>

        <Accordion activeKey={expandedItem} flush>
          <div style={{ maxHeight: '860px', overflowY: 'auto' }}>
            {displayedOptions.map(option => (
              <Accordion.Item 
                key={option.id} 
                eventKey={option.id}
                className="border-0 border-bottom"
              >
                <ListGroup.Item 
                  action 
                  onClick={() => toggleAccordion(option.id)}
                  className="d-flex align-items-center p-0"
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <Form.Check
                      type="checkbox"
                      checked={selectedItems.includes(option.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelect(option.id);
                      }}
                      className="ms-2 me-2"
                    />
                    <Accordion.Button 
                      as="div" 
                      className="flex-grow-1 shadow-none"
                    >
                      <div>
                        <span className="fw-semibold">{option.text}</span>
                      </div>
                    </Accordion.Button>
                  </div>
                </ListGroup.Item>

                <Accordion.Body className="pt-3 pb-3">
                {option.type == 1 ? 
                  (<SingleChoiceQuestion
                  key={option.id}
                  questionId={option.id}
                  questionText={option.text}
                  options={option.body.options}
                  isReadonly={true}
                  />)
                  : option.type == 2 ? 
                  (<MultipleChoiceQuestion
                  key={option.id}
                  questionId={option.id}
                  questionText={option.text}
                  options={option.body.options}
                  isReadonly={true}
                  />)
                  : option.type == 3 ? 
                  (<MatchingQuestion
                  key={option.id}
                  questionId={option.id}
                  questionText={option.text}
                  leftItems={option.body.leftItems}
                  rightItems={option.body.rightItems}
                  isReadonly={true}
                  />)
                  : option.type == 4 ? 
                  (<ShortAnswerQuestion
                  key={option.id}
                  questionId={option.id}
                  questionText={option.text}
                  isReadonly={true}
                  />) : (<></>)}
                </Accordion.Body>
              </Accordion.Item>
            ))}

            {displayedOptions.length === 0 && (
              <div className="text-center py-3 text-muted">
                {showSelectedOnly ? 'Нет выбранных' : 'Нет совпадений'}
              </div>
            )}
          </div>
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default AccordionMultiSelect;