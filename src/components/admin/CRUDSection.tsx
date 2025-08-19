import React, { useState } from 'react';
import ActionButton from './ActionButton';
import CustomModal from './CustomModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Field {
  name: string;
  label: string;
  type: string;
  options?: string[];
}

interface CRUDSectionProps {
  title: string;
  items: any[];
  fields: Field[];
  onAdd: (item: any) => void;
  onEdit: (id: number | string, updated: any) => void;
  onDelete: (id: number | string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const CRUDSection: React.FC<CRUDSectionProps> = ({ 
  title, 
  items, 
  fields, 
  onAdd, 
  onEdit, 
  onDelete,
  showToast
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentItem, setCurrentItem] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const handleOpenAddModal = () => {
    setModalType('add');
    setCurrentItem({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setModalType('edit');
    setCurrentItem(item);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        if (modalType === 'add') {
          onAdd(currentItem);
          showToast(`${title} added successfully`, 'success');
        } else {
          if (editingId !== null) {
            onEdit(editingId, currentItem);
            showToast(`${title} updated successfully`, 'success');
          }
        }
      } catch (error) {
        showToast(`Error saving ${title.toLowerCase()}`, 'error');
      } finally {
        setIsSaving(false);
        setIsModalOpen(false);
      }
    }, 1000);
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      try {
        onDelete(id);
        showToast(`${title} deleted successfully`, 'success');
      } catch (error) {
        showToast(`Error deleting ${title.toLowerCase()}`, 'error');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <ActionButton 
          onClick={handleOpenAddModal}
          icon={<FaPlus />}
          label="Add New"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {fields.map(field => (
                  <th key={field.name} className="text-left px-6 py-4 text-gray-600 font-medium">
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {fields.map(field => (
                    <td key={`${item.id}-${field.name}`} className="px-6 py-4">
                      {field.type === 'textarea' ? (
                        <div className="line-clamp-2 text-gray-700">{item[field.name]}</div>
                      ) : (
                        <span className="text-gray-700">{item[field.name]}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4 text-gray-300">
              <div className="inline-block p-4 bg-gray-100 rounded-full">
                <FaPlus className="text-2xl" />
              </div>
            </div>
            <p>No items found. Add your first item to get started.</p>
          </div>
        )}
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'add' ? `Add New ${title}` : `Edit ${title}`}
        fields={fields}
        itemData={currentItem}
        onChange={handleChange}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default CRUDSection;