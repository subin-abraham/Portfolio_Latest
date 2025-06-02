import React from 'react';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';

const Experience = () => {
  const workExperience = [
    {
      title: 'Front-End Engineer',
      company: 'Polus Solutions',
      location: 'Trivandrum, India',
      period: '2022 - Present',
      description:
        'Leading frontend development for enterprise SaaS applications using React, TypeScript, and modern web technologies.',
      achievements: [
        'Improved application performance by 40%',
        'Led team of 4 developers',
        'Implemented CI/CD pipelines',
      ],
    },
    {
      title: 'Front-End Intern',
      company: 'Luminar Technolab',
      location: 'Kochi, India',
      period: '2021 - 2022',
      description:
        'Developed responsive web applications and collaborated with design teams to create pixel-perfect user interfaces.',
      achievements: [
        'Built 15+ responsive websites',
        'Reduced load times by 30%',
        'Mentored junior developers',
      ],
    },
  ];

  const education = [
    {
      degree: 'B.Tech in Electronics & Communication Engineering',
      institution: 'KTU University',
      location: 'Trivandrum, India',
      period: '2018 - 2022',
      grade: 'CGPA: 6.9/10',
      description: 'Strong foundation in electronics, programming, and problem-solving skills.',
    },
  ];

  return (
    <section
      id="experience"
      className="py-16 bg-gray-50 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            Experience & Education
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Professional <span className="text-accent">Journey</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            My career progression and educational background in technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div data-aos="fade-right">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-accent/10 p-3 rounded-full">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-navy">
                Work Experience
              </h3>
            </div>

            <div className="space-y-6">
              {workExperience.map((job, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div>
                      <h4 className="font-heading text-xl font-semibold text-navy">
                        {job.title}
                      </h4>
                      <p className="text-accent font-medium">{job.company}</p>
                    </div>
                    <div className="text-sm text-gray-500 mt-2 sm:mt-0 sm:text-right">
                      <div className="flex items-center gap-1 justify-start sm:justify-end">
                        <Calendar className="w-4 h-4" />
                        {job.period}
                      </div>
                      <div className="flex items-center gap-1 justify-start sm:justify-end mt-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {job.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div data-aos="fade-left" data-aos-delay="200">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-accent/10 p-3 rounded-full">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-navy">
                Education
              </h3>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent"
                >
                  <div className="mb-3">
                    <h4 className="font-heading text-xl font-semibold text-navy mb-2">
                      {edu.degree}
                    </h4>
                    <p className="text-accent font-medium">{edu.institution}</p>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-4 h-4" />
                      {edu.period}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-4 h-4" />
                      {edu.location}
                    </div>
                    <div className="font-medium text-accent">{edu.grade}</div>
                  </div>
                  <p className="text-gray-600">{edu.description}</p>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-heading text-lg font-semibold text-navy mb-4">
                Certifications & Courses
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">React Developer Certification</span>
                  <span className="text-sm text-gray-500">2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Advanced JavaScript & ES6+</span>
                  <span className="text-sm text-gray-500">2022</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Responsive Web Design</span>
                  <span className="text-sm text-gray-500">2021</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
