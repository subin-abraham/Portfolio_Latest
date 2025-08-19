import React, { useState } from 'react';
import InputField from './InputField';
import ActionButton from './ActionButton';
import { FaEdit, FaTimes, FaSave } from 'react-icons/fa';

interface AboutSectionProps {
  about: {
    title: string;
    content: string;
  };
  setAbout: (about: { title: string; content: string }) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ about, setAbout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(about);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = () => {
    setAbout(editData);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">About Section</h2>
        {!isEditing ? (
          <ActionButton 
            onClick={() => setIsEditing(true)}
            icon={<FaEdit />}
            label="Edit Content"
          />
        ) : (
          <div className="flex gap-3">
            <ActionButton 
              onClick={() => setIsEditing(false)}
              icon={<FaTimes />}
              label="Cancel"
              variant="secondary"
            />
            <ActionButton 
              onClick={handleSave}
              icon={<FaSave />}
              label="Save Changes"
            />
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <InputField 
            label="Title"
            name="title"
            type="text"
            value={editData.title}
            onChange={handleChange}
          />
          <InputField 
            label="Content"
            name="content"
            type="textarea"
            value={editData.content}
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{about.title}</h3>
          <p className="text-gray-700 whitespace-pre-line">{about.content}</p>
        </div>
      )}
    </div>
  );
};

export default AboutSection;