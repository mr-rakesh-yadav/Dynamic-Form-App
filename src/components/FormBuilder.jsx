import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Checkbox,
  Radio,
  Space,
  Card,
} from "antd";
import { v4 as uuidv4 } from "uuid";
import InputForm from "./InputForm";

/**
 * FormBuilder component allows users to dynamically create a form with various field types.
 */
const FormBuilder = () => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState({ label: "", type: "text" });

  /**
   * Handled adding a new form field.
   */
  const handleAddField = (newFieldValue) => {
    setFields([
      ...fields,
      { ...newFieldValue, id: uuidv4(), name: `field${fields.length}` },
    ]);
    setCurrentField({ label: "", type: "text" });
    setIsModalVisible(false);
  };

  /**
   * Handled removing a form field based on its ID.
   */
  const handleRemoveField = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
  };

  /**
   * Handled form submission with validation.
   */
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      // If validation is successful, you can proceed with form submission
      const formData = {
        fields: fields.map((field) => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type,
          options: field.options,
        })),
        formValues: values,
      };

      // Log the form data or send it to your server
      console.log("Form Data as JSON:", JSON.stringify(formData, null, 2));

      message.success("Form submitted successfully!");
    } catch (error) {
      // Handled validation errors
      console.error("Form validation failed:", error);

      // You can display a notification or other error handling mechanisms
      message.error("Form validation failed. Please check the fields.");
    }
  };

  /**
   * Shows the modal for adding a new form field.
   */
  const showModal = () => {
    setIsModalVisible(true);
  };

  /**
   * Handled the cancellation of the modal for adding a new form field.
   */
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  /**
   * Renders the appropriate input component based on the field type.
   */
  const renderInputComponent = (field) => {
    switch (field.type) {
      case "text":
        return <Input placeholder={"Please Enter"} />;
      case "textarea":
        return <Input.TextArea placeholder={"Please Enter"} />;
      case "dropdown":
        const dropdownOptions = field.options.map((item) => ({
          label: item.label,
          value: item.label,
        }));
        return (
          <Select placeholder={"Please select"} options={dropdownOptions} />
        );
      case "checkbox":
        const checkboxOptions = field.options.map((item) => item.label);
        return <Checkbox.Group options={checkboxOptions} value={[]} />;
      case "radio":
        const radioOptions = field.options.map((item) => item.label);
        return <Radio.Group options={radioOptions} value={""} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="flex-column">
        <Space direction="vertical" className="with-90-pr" size={16}>
          <Card
            title="Dynamic Form Generator"
            extra={
              <Button type="primary" onClick={showModal} className="m-auto">
                Add Field
              </Button>
            }
            className="card-container"
          >
            {fields.map((field) => (
              <div key={field.id} className="flex-row">
                <Form.Item
                  label={field.label}
                  name={field.name}
                  rules={[{ required: true, message: "Field is required" }]}
                  className="with-90-pr"
                >
                  {renderInputComponent(field)}
                </Form.Item>
                <Button
                  type="button"
                  className="m-auto"
                  onClick={() => handleRemoveField(field.id)}
                >
                  X
                </Button>
              </div>
            ))}
          </Card>
        </Space>
        <Button
          className="from-submit-button"
          disabled={fields.length !== 0 ? false : true}
          type="primary"
          htmlType="submit"
        >
          Submit Form
        </Button>
      </Form>
      <InputForm
        isModalVisible={isModalVisible}
        handleAddField={(newFieldValue) => handleAddField(newFieldValue)}
        handleModalCancel={handleModalCancel}
        currentField={currentField}
        setCurrentField={setCurrentField}
      />
    </div>
  );
};

export default FormBuilder;
