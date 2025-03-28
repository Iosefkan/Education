import { useState, useEffect } from 'react';
import { Table, Pagination, Form, Spinner } from 'react-bootstrap';

const PaginatedTable = ({ 
  data, 
  columns, 
  pageSizeOptions = [10, 25, 50],
  isLoading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);
  const [paginatedData, setPaginatedData] = useState([]);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <span>Показывать:</span>
          <Form.Select 
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{ width: '80px' }}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
          <span>записей</span>
        </div>
        
        <Pagination className="mb-0">
          <Pagination.Prev 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {renderPaginationItems()}
          <Pagination.Next 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </Spinner>
              </td>
            </tr>
          ) : (
            paginatedData.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key} width={column.width}>
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Показано с {((currentPage - 1) * itemsPerPage) + 1} по{' '}
          {Math.min(currentPage * itemsPerPage, data.length)} из {data.length} записей
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {renderPaginationItems()}
          <Pagination.Next 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    </div>
  );
};


export default PaginatedTable;