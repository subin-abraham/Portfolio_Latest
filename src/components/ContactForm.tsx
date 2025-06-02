import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/subinkunnuvilayil@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for reaching out. I'll get back to you within 24-48 hours.",
        });
        setFormData({
          name: '',
          email: '',
          projectType: '',
          budget: '',
          timeline: '',
          message: ''
        });
      } else {
        toast({
          title: "Submission Failed",
          description: "Please try again later.",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            Contact
          </div>
          <h2 className="font-heading text-4xl font-bold text-navy mb-6">
            Get In <span className="text-accent">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your next project? I'd love to hear about your ideas and discuss how we can work together to bring them to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="font-heading text-2xl font-semibold text-navy mb-6">
              Let's Start a Conversation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Full Name"
                  />
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Email Address"
                  />
                </div>
              </div>

              {/* Project Type & Budget */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Project Type</option>
                    <option value="website-redesign">Website Redesign</option>
                    <option value="new-landing-page">New Landing Page</option>
                    <option value="web-application">Web Application</option>
                    <option value="e-commerce">E-commerce Site</option>
                    <option value="maintenance">Website Maintenance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="under-1000">Under 5000</option>
                    <option value="1000-3000">5000 - 10,000</option>
                    <option value="3000-5000">10,000 - 20,000</option>
                    <option value="5000-10000">20,000 - 30,000</option>
                    <option value="over-10000">30,000+</option>
                    <option value="discuss">Let's Discuss</option>
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-month">Within 1 Month</option>
                  <option value="1-3-months">1-3 Months</option>
                  <option value="3-6-months">3-6 Months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                  placeholder="Project Details"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent-hover transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            <h3 className="font-heading text-2xl font-semibold text-navy mb-6">Let's Connect</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>
            <div className="flex flex-col gap-6 text-gray-700">
              <div className="flex items-center gap-3">
                <Mail className="text-accent" />
                <a href="mailto:subinabraham63@gmail.com" className="hover:text-accent transition">subinabraham63@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-accent" />
                <a href="tel:+917356211346" className="hover:text-accent transition">+91 7356211346</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-accent" />
                <address className="not-italic">Kollam, Kerala, India</address>
              </div>
            </div>
            {/* <div className="flex space-x-6 mt-8 text-gray-600">
              <a href="https://github.com/subin-abraham" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/in/subinabraham63" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">
                <Linkedin className="w-6 h-6" />
              </a>
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactForm;
