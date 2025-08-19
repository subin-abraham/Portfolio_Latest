import React from 'react';
import InputField from './InputField';
import ActionButton from './ActionButton';
import { FaTimes, FaSave } from 'react-icons/fa';

interface Field {
  name: string;
  label: string;
  type: string;
  options?: string[];
}

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  itemData: Record<string, any>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
  isSaving: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  fields, 
  itemData, 
  onChange,
  onSave,
  isSaving
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="space-y-4">
            {fields.map(field => (
              <InputField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={itemData[field.name] || ''}
                onChange={onChange}
                options={field.options}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <ActionButton 
              onClick={onClose}
              icon={<FaTimes />}
              label="Cancel"
              variant="secondary"
            />
            <ActionButton 
              onClick={onSave}
              icon={<FaSave />}
              label={isSaving ? "Saving..." : "Save Changes"}
              disabled={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;