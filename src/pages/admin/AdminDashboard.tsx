// src/components/AdminDashboard/AdminDashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import DashboardHeader from '../../components/admin/DashboardHeader';
import DashboardHome from '../../components/admin/DashboardHome';
import AboutSection from '../../components/admin/AboutSection';
import CRUDSection from '../../components/admin/CRUDSection';
import Toast from '../../components/admin/Toast';

import { 
  FaBriefcase, FaCode, FaUser, 
  FaLaptopCode, FaBlog, FaCogs 
} from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  
  // Sample data for demonstration
  const [experiences, setExperiences] = useState([
    { id: 1, company: 'Tech Innovations', role: 'Senior Developer', period: '2020 - Present', description: 'Leading development teams' },
    { id: 2, company: 'Digital Solutions', role: 'Frontend Developer', period: '2018 - 2020', description: 'Building responsive UIs' }
  ]);
  
  const [skills, setSkills] = useState([
    { id: 1, name: 'React', category: 'Frontend', level: 90 },
    { id: 2, name: 'Node.js', category: 'Backend', level: 85 }
  ]);
  
  const [about, setAbout] = useState({
    title: 'My Journey',
    content: 'I am a passionate developer with 5+ years of experience creating innovative web solutions...'
  });
  
  const [projects, setProjects] = useState([
    { id: 1, title: 'E-commerce Platform', category: 'Featured', description: 'Full-featured online store', technologies: 'React, Node, MongoDB' },
    { id: 2, title: 'Portfolio Website', category: 'Other', description: 'Personal portfolio site', technologies: 'React, Tailwind CSS' }
  ]);
  
  const [blogs, setBlogs] = useState([
    { id: 1, title: 'Modern Web Development', date: '2023-06-15', excerpt: 'Exploring the latest trends...' },
    { id: 2, title: 'State Management in React', date: '2023-05-22', excerpt: 'Comparing state management solutions...' }
  ]);
  
  const [services, setServices] = useState([
    { id: 1, title: 'Web Development', description: 'Custom web applications', icon: 'code' },
    { id: 2, title: 'UI/UX Design', description: 'User-centered design solutions', icon: 'design' }
  ]);
  
  const stats = {
    experiences: experiences.length,
    skills: skills.length,
    projects: projects.length,
    blogs: blogs.length
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome stats={stats} />;
      
      case 'experience':
        return (
          <CRUDSection 
            title="Experience"
            items={experiences}
            fields={[
              { name: 'company', label: 'Company', type: 'text' },
              { name: 'role', label: 'Role', type: 'text' },
              { name: 'period', label: 'Period', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' }
            ]}
            onAdd={(newExp) => setExperiences([...experiences, { ...newExp, id: Date.now() }])}
            onEdit={(id, updated) => setExperiences(experiences.map(e => e.id === id ? {...e, ...updated} : e))}
            onDelete={(id) => setExperiences(experiences.filter(e => e.id !== id))}
            showToast={showToast}
          />
        );
      
      case 'skills':
        return (
          <CRUDSection 
            title="Skills"
            items={skills}
            fields={[
              { name: 'name', label: 'Skill Name', type: 'text' },
              { name: 'category', label: 'Category', type: 'text' },
              { name: 'level', label: 'Proficiency (%)', type: 'number' }
            ]}
            onAdd={(newSkill) => setSkills([...skills, { ...newSkill, id: Date.now() }])}
            onEdit={(id, updated) => setSkills(skills.map(s => s.id === id ? {...s, ...updated} : s))}
            onDelete={(id) => setSkills(skills.filter(s => s.id !== id))}
            showToast={showToast}
          />
        );
      
      case 'about':
        return <AboutSection about={about} setAbout={setAbout} />;
      
      case 'projects':
        return (
          <CRUDSection 
            title="Projects"
            items={projects}
            fields={[
              { name: 'title', label: 'Project Title', type: 'text' },
              { name: 'category', label: 'Category', type: 'select', options: ['Featured', 'Other'] },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'technologies', label: 'Technologies', type: 'text' }
            ]}
            onAdd={(newProject) => setProjects([...projects, { ...newProject, id: Date.now() }])}
            onEdit={(id, updated) => setProjects(projects.map(p => p.id === id ? {...p, ...updated} : p))}
            onDelete={(id) => setProjects(projects.filter(p => p.id !== id))}
            showToast={showToast}
          />
        );
      
      case 'blogs':
        return (
          <CRUDSection 
            title="Blogs"
            items={blogs}
            fields={[
              { name: 'title', label: 'Blog Title', type: 'text' },
              { name: 'date', label: 'Publish Date', type: 'date' },
              { name: 'excerpt', label: 'Excerpt', type: 'textarea' }
            ]}
            onAdd={(newBlog) => setBlogs([...blogs, { ...newBlog, id: Date.now() }])}
            onEdit={(id, updated) => setBlogs(blogs.map(b => b.id === id ? {...b, ...updated} : b))}
            onDelete={(id) => setBlogs(blogs.filter(b => b.id !== id))}
            showToast={showToast}
          />
        );
      
      case 'services':
        return (
          <CRUDSection 
            title="Services"
            items={services}
            fields={[
              { name: 'title', label: 'Service Title', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'icon', label: 'Icon Name', type: 'text' }
            ]}
            onAdd={(newService) => setServices([...services, { ...newService, id: Date.now() }])}
            onEdit={(id, updated) => setServices(services.map(s => s.id === id ? {...s, ...updated} : s))}
            onDelete={(id) => setServices(services.filter(s => s.id !== id))}
            showToast={showToast}
          />
        );
      
      default:
        return <div className="p-6">Select a section to manage</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="relative z-50 h-full">
            <Sidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          activeTab={activeTab} 
          toggleSidebar={() => setIsSidebarOpen(true)}
        />
        
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;