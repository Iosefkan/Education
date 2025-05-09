import React, { useState, useEffect } from "react";
import { Pagination, Form } from "react-bootstrap";

const PaginatedData = ({
  data,
  length,
  columns,
  pageSizeOptions = [10, 25, 50],
  isLoading = false,
  children
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);
  const [paginatedData, setPaginatedData] = useState([]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    if (!isLoading && (currentPage - 1) * itemsPerPage >= data.length){
        setCurrentPage(currentPage - 1);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, itemsPerPage, setCurrentPage, isLoading]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
            style={{ width: "80px" }}
          >
            {pageSizeOptions.map((option) => (
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

      {React.cloneElement(children, {
        data: paginatedData,
        isLoading,
        columns,
        length,
        itemsPerPage,
        currentPage,
      })}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Показано с {(currentPage - 1) * itemsPerPage + 1} по{" "}
          {Math.min(currentPage * itemsPerPage, data.length)} из {data.length}{" "}
          записей
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

export default PaginatedData;
