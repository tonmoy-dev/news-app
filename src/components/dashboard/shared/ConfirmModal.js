import { Modal } from 'antd';

const ConfirmModal = ({ modalOpen, onClose, title, onConfirm }) => {

  return (
    <>
      <Modal
        title={`${title}`}
        centered
        open={modalOpen}
        onOk={() => {
          onConfirm();
          onClose(false);
        }}
        onCancel={() => onClose(false)}
        okText={"Yes"}
        cancelText={"No"}
      >
      </Modal>
    </>
  );
};
export default ConfirmModal;