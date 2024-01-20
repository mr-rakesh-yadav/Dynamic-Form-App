import React, { useEffect, useState } from "react";
import { Form, Input, Select, Modal } from "antd";
import { formFieldTypes } from "../constants/formFieldTypes";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

/**
 * InputForm component allows users to add new form fields dynamically.
 */
const InputForm = ({ isModalVisible, handleAddField, handleModalCancel }) => {
  // State to manage the current form field being added
  const [currentField, setCurrentField] = useState({
    id: uuidv4(),
    label: "",
    type: "text",
    options: null,
  });

  /**
   * Handled input change for field label and type.
   */
  const handleInputChange = (key, value) => {
    setCurrentField({ ...currentField, [key]: value });
  };

  /**
   * Handled input change for field options.
   */
  const handleOptionsChange = (e) => {
    const options = e.target.value.split(",").map((item) => {
      return { label: item.trim(), type: "text" };
    });
    setCurrentField({ ...currentField, options });
  };

  /**
   * Reset the current form field when the modal becomes visible.
   */
  useEffect(() => {
    if (isModalVisible) {
      setCurrentField({
        id: uuidv4(),
        label: "",
        type: "text",
        options: null,
      });
    }
  }, [isModalVisible]);

  return (
    <Modal
      title="Add Field"
      open={isModalVisible}
      onOk={() => handleAddField(currentField)}
      onCancel={handleModalCancel}
    >
      <Form>
        <Form.Item label="Field Label">
          <Input
            value={currentField.label}
            onChange={(e) => handleInputChange("label", e.target.value)}
            placeholder="Enter label"
          />
        </Form.Item>
        <Form.Item label="Field Type">
          <Select
            value={currentField.type}
            onChange={(value) => handleInputChange("type", value)}
          >
            {Object.keys(formFieldTypes).map((type) => (
              <Option key={type} value={type}>
                {formFieldTypes[type].label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {(currentField.type === "dropdown" ||
          currentField.type === "checkbox" ||
          currentField.type === "radio") && (
          <Form.Item label="Options">
            <Input
              onChange={handleOptionsChange}
              placeholder="Enter Options with comma separated"
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default InputForm;