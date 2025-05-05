import Layout from "../components/Layout";
import PaginatedData from "../components/PaginatedData"
import CreateUserModal from "../components/sidebars/CreateUserModal";
import { Button, Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useState, useEffect } from "react";
import { getUsers, createUser, canDeleteUser, deleteUser } from "../services/users.service";
import UserTable from "../components/UserTable";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateModel, setCreateShowModal] = useState(false);
    const [canDeleteSelectedUser, setCanDeleteSelectedUser] = useState(false);

    useEffect(() => {
        async function initUsers(){
            const recUsers = await getUsers();
            console.log(recUsers);
            setUsers(recUsers)
        }
        initUsers();
    }, [setUsers])
  
    const handleDelete = async (userId) => {
      if (!canDeleteSelectedUser){
        return;
      }
      const isSuccess = await deleteUser(userId);
      if (isSuccess){
        setUsers(users.filter(user => user.id !== userId));
      }
      setShowDeleteModal(false);
    };

    const handleAddUser = async (userData) => {
        console.log(userData);
        const isSuccess = await createUser(userData.login, userData.password, userData.lastName, userData.firstName, userData.middleName, userData.role);
        if (isSuccess){
            setUsers(await getUsers());
        }
        setShowDeleteModal(false);
    }
  
    const openDeleteModal = async (user) => {
      const canDelete = await canDeleteUser(user.id);
      setCanDeleteSelectedUser(canDelete);
      console.log(canDelete);
      setSelectedUser(user);
      setShowDeleteModal(true);
    };

    const columns = [
      { key: 'login', header: 'Логин', width: '20%' },
      { key: 'lastName', header: 'Фамилия', width: '20%' },
      { key: 'firstName', header: 'Имя', width: '20%' },
      { key: 'middleName', header: 'Отчество', width: '20%' },
      { key: 'role', header: 'Роль', width: '15%' },
      { 
        key: 'id', 
        header: 'Удаление',
        width: '5%',
        render: (item) => (
           <Button
            variant="outline-danger"
            className="flex-shrink-0"
            onClick={() => openDeleteModal(item)}
            aria-label="Delete user"
          >
            <Trash />
          </Button>
        )
      }
    ];
  
    return (
      <Layout isAdmin={true}>
        <Button className="mb-4" onClick={() => setCreateShowModal(true)}>Добавить пользователя</Button>
        <PaginatedData
          data={users}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          isLoading={false}
        >
          <UserTable/>
        </PaginatedData>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Подтверждение удаления</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {canDeleteSelectedUser ? `Вы уверены, что хотите удалить пользователя ${selectedUser?.login}?` : 'Данного пользователя нельзя удалить'}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Отменить
            </Button>
            <Button disabled={!canDeleteSelectedUser} variant="danger" onClick={() => handleDelete(selectedUser?.id)}>
                Удалить
            </Button>
          </Modal.Footer>
        </Modal>

        <CreateUserModal 
          show={showCreateModel}
          onHide={() => setCreateShowModal(false)}
          onCreateUser={(userData) => handleAddUser(userData)}
        />
      </Layout>
    );
  };

export default AdminPage;
