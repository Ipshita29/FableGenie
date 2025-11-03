// Testimonials.jsx

import { Star } from "lucide-react";

// Placeholder data for testimonials
const testimonialsData = [
  {
    quote: "I finished my first book in a weekend! The AI co-pilot is a game-changer for overcoming writer's block. The design editor made my final PDF look professionally published.",
    name: "Sarah L.",
    title: "Entrepreneur & Author",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "We use this platform exclusively for our lead magnet eBooks. The instant formatting and beautiful templates save my marketing team dozens of hours every month.",
    name: "Mark T.",
    title: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "As a self-publisher, the export options for both ePub and PDF are flawless. This tool provides the highest quality output I've seen outside of a professional design firm.",
    name: "Aisha H.",
    title: "Freelance Writer",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

// Reusable Testimonial Card Component
const TestimonialCard = ({ quote, name, title, avatar }) => (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-pink-100/70 flex flex-col h-full hover:shadow-2xl transition duration-300 transform hover:scale-[1.01]">
    
    {/* Star Rating */}
    <div className="flex space-x-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>

    {/* Quote */}
    <p className="text-xl text-gray-700 italic mb-6 flex-grow">
      "{quote}"
    </p>

    {/* Author Info */}
    <div className="flex items-center pt-4 border-t border-pink-50">
      <img
        className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-pink-200"
        src={avatar}
        alt={`Avatar of ${name}`}
      />
      <div>
        <p className="font-bold text-gray-900 text-lg">{name}</p>
        <p className="text-pink-600 text-sm">{title}</p>
      </div>
    </div>
  </div>
);


const Testimonials = () => {
  return (
    // Section ID allows Navbar to link directly to this section
    <section id="Testimonials" className="py-20 lg:py-32 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-pink-600 uppercase tracking-widest mb-2">
            Loved By Authors
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Don't Just Take Our Word For It
          </h2>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            See what thousands of successful authors and businesses are saying about their publishing experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
              avatar={testimonial.avatar}
            />
          ))}
        </div>

        {/* Footer CTA (Optional: Add a final nudge to sign up) */}
        <div className="mt-16 pt-10 border-t border-pink-200 text-center">
            <a
                href="/signup"
                className="inline-flex items-center px-8 py-3 bg-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-pink-300/50 hover:bg-pink-700 transition transform hover:-translate-y-0.5"
            >
                Start Your Book Free Today
            </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;