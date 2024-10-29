
import { Modal } from 'antd';

const CustomModal = ({ modalOpen, onModalOpen, children, title }) => {

    return (
        <>
            <Modal
                title={title}
                centered
                width={"1000px"}
                open={modalOpen}
                onOk={() => onModalOpen(false)}
                onCancel={() => onModalOpen(false)}
                footer={null}
                okText={"Delete"}
            >
                {children}
            </Modal>
        </>
    );
};
export default CustomModal;