import React from 'react';
import { Button, Modal } from 'antd';


const DataViewModal = ({ open, onClose, data }) => {
  // Function to format keys
  const formatKey = (key) => {
    return key
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  // Pre-process the data to format keys and skip 'id'
  const formattedData = Object.entries(data)
    .filter(([key]) => key !== 'id') // Skip the 'id' field
    .map(([key, value]) => ({
      formattedKey: formatKey(key),
      value: typeof value === 'string' && value.length > 100
        ? `${value.slice(0, 100)}...` // Slice string value if it's too long
        : value,
    }));

  return (
    <Modal
      centered
      title={
        <span className="text-xl font-medium">
          {data.title || data.name || `Details`}
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width="80%"
      style={{ maxWidth: '1000px' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-5">
        {formattedData.length > 0 ? (
          formattedData.map(({ formattedKey, value }) => (
            <div key={formattedKey} className="flex justify-start gap-1">
              <span className="font-semibold">{`${formattedKey}:`}</span>
              <span className="ml-2">{value}</span>
            </div>
          ))
        ) : (
          <p>No data available.</p> // Fallback message if no data is available
        )}
      </div>

      <div className='flex justify-end'>
        <Button type="primary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default DataViewModal;
