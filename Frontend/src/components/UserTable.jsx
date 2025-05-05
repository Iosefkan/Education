import { Table, Spinner } from "react-bootstrap";

const UserTable = ({ data, columns, isLoading = false }) => {
  return (
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
          data.map((item, index) => (
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
  );
};

export default UserTable;
