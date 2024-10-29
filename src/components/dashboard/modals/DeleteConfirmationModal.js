import { Modal } from 'antd';

const DeleteConfirmationModal = ({ modalOpen, onModalOpen, title, onDelete }) => {

    return (
        <>
            <Modal
                title={`${title}`}
                centered
                open={modalOpen}
                onOk={() => {
                    onDelete();
                    onModalOpen(false);
                }}
                onCancel={() => onModalOpen(false)}
                okText={"Delete"}
            >
                It will be parmanently deleted.
            </Modal>
        </>
    );
};
export default DeleteConfirmationModal;