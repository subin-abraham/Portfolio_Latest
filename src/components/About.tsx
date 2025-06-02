import React from 'react';

const About = () => {
  const journey = [
    {
      year: 'Programming Origins',
      content: `I began my journey in the world of technology with a degree in Electronics and Communication. Although my academic focus was initially driven by curiosity in electronics, I soon discovered my true passion lay in software development. I loved creating innovative solutions and shaping digital experiences—an interest that continues to fuel my work today.`,
    },
    {
      year: 'Finding My Way to Web',
      content: `Following my studies, an internship opened the door to the software industry as a front-end engineer. This pivotal experience bridged the gap between my academic background and the dynamic world of web technologies. Now, I specialize in front-end development using JavaScript, TypeScript, Angular, React, Bootstrap, and Tailwind CSS.`,
    },
    {
      year: 'Life Beyond Coding',
      content: `While coding is at the heart of what I do, I’m inspired by continuous learning. Every project is an opportunity to explore new tools and techniques—this portfolio itself is a playground where I experiment with Next.js and Tailwind. This mindset nurtures creativity that I bring to every project.`,
    },
    {
      year: 'These Days',
      content: `Currently, I focus on mastering modern front-end technologies and refining my craft. I create user-friendly, responsive web applications that deliver exceptional user experiences, staying updated with the latest trends and best practices.`,
    },
    {
      year: 'Future Aspirations',
      content: `Looking ahead, I aim to become a full-stack engineer. I have an intermediate grasp of backend technologies such as Node.js, MongoDB, and SQL, and am actively enhancing these skills to build robust end-to-end solutions that make a real impact.`,
    }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Personal Story (Intro & CTA) */}
          <div data-aos="fade-right">
            <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              About Me
            </div>

            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-8">
              Passionate About Creating{' '}
              <span className="text-accent">Digital Experiences</span>
            </h2>

            <p className="text-gray-700 text-base leading-relaxed mb-8">
              I'm an Electronics & Communication Engineer turned Front-End Developer with 3+ years of experience building modern web applications. I specialize in React, TypeScript, and creating responsive, user-friendly interfaces.
            </p>
            <p className="text-gray-700 text-base leading-relaxed mb-8">
              Currently working full-time at TechCorp Solutions while launching my freelance business to help bring digital visions to life.
            </p>

            <button
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="mt-6 btn-primary px-6 py-3 rounded-md text-white bg-accent hover:bg-accent-dark transition"
            >
              Let's Work Together
            </button>
          </div>

          {/* Right Column - Timeline with cards on both sides */}
          <div data-aos="fade-left" data-aos-delay="200" className="relative">
            {/* Vertical timeline line */}
            <div className="absolute top-0 bottom-0 left-1/2 border-l-4 border-accent transform -translate-x-1/2"></div>

            <div className="space-y-16">
              {journey.map(({ year, content }, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-2 gap-6 items-center"
                >
                  {/* Left Card */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full max-w-[320px] mx-auto">
                    <h4 className="font-semibold text-lg text-accent mb-2">{year}</h4>
                    <p className="text-gray-700">{content}</p>
                  </div>

                  {/* Right Card */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full max-w-[320px] mx-auto">
                    <h4 className="font-semibold text-lg text-accent mb-2">{year}</h4>
                    <p className="text-gray-700">{content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
