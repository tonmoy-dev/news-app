
import { Button, Modal } from 'antd';

const VerticallyCenteredModal = ({ modalOpen, setModalOpen }) => {

    return (
        <>
            <Modal
                title="Do you want to delete?"
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
                okText={"Delete"}
            >
                It will be parmanently deleted.
            </Modal>
        </>
    );
};
export default VerticallyCenteredModal;