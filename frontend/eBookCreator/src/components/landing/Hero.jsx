import { ArrowRight, Sparkles, BookOpen, Zap, PenTool, Layout, Rocket, RotateCw, CheckCircle, Gift } from "lucide-react";
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom";
// Use the provided image imports
import image1 from "../../assets/image1.png"; 
import image2 from "../../assets/image2.png"; 

// --- Reusable Components ---

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-pink-50">
    <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 border-t-4 border-peach-300 bg-white rounded-xl shadow-lg">
    <div className="w-10 h-10 bg-peach-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);


const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white">

      <section className="bg-gradient-to-br from-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">

 
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Intuitive AI Publishing Toolkit
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Design and Launch <span className="text-pink-600">eBooks</span> Effortlessly
            </h1>


            <p className="text-gray-600 text-lg lg:text-xl max-w-xl">
              From initial idea to a professionally designed book, our platform handles the writing, formatting, and export in minutes.
            </p>

       
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-flex items-center gap-2 px-8 py-3 bg-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-pink-300/50 hover:bg-pink-700 transition transform hover:-translate-y-0.5"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Your Book Free"}
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-pink-600 text-pink-600 rounded-xl font-semibold text-lg hover:bg-pink-50 transition"
              >
                View Pricing
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 pt-4 flex flex-wrap gap-12 border-t border-pink-200">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-pink-700">65K+</div>
                <div className="text-gray-500 text-sm">Books Created</div>
              </div>
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-pink-700">4.9/5</div>
                <div className="text-gray-500 text-sm">User Satisfaction</div>
              </div>
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-pink-700">10min</div>
                <div className="text-gray-500 text-sm">Avg. Draft Time</div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative order-first lg:order-last">
            <img
              src={image1}
              alt="AI Ebook Creator Dashboard Mockup"
              className="w-full rounded-2xl shadow-2xl object-cover transform hover:scale-[1.01] transition duration-500 shadow-pink-200/50"
            />
            
            <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 bg-white rounded-xl shadow-2xl p-4 flex items-center gap-4 border border-pink-100 hidden sm:flex">
              <div className="w-12 h-12 bg-pink-100 flex items-center justify-center rounded-full">
                <BookOpen className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <div className="text-gray-900 font-semibold">Ready to Publish</div>
                <div className="text-gray-500 text-sm">PDF & ePub Formats</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Your Complete Ebook Creation Toolkit
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              We eliminate the busywork so you can focus 100% on sharing your message.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={PenTool}
              title="AI Co-Pilot"
              description="Overcome writer's block instantly. Our smart AI suggests content, rewrites passages, and expands your ideas."
            />
            <FeatureCard
              icon={Layout}
              title="Intuitive Design Editor"
              description="Customize professional templates with drag-and-drop ease. No design skills or coding necessary."
            />
            <FeatureCard
              icon={Zap}
              title="Instant Formatting"
              description="Converts your work into clean, industry-standard ePub and PDF files, optimized for all reading devices."
            />
            <FeatureCard
              icon={Gift}
              title="Built-in Cover Designer"
              description="Access a library of cover templates and design tools to create a captivating book cover in minutes."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-pink-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="order-last lg:order-first">
              <img
                src={image2}
                alt="Ebook content editing interface"
                className="w-full rounded-2xl shadow-2xl shadow-pink-200/50"
              />
            </div>
            
            <div className="space-y-10">
              <h2 className="text-4xl font-extrabold text-gray-900">
                Publishing Simplified in 3 Steps
              </h2>
              
              <StepCard
                number={1}
                title="Input Your Concept"
                description="Give us a brief topic or upload your existing draft. Our AI structures your manuscript automatically."
              />
              <StepCard
                number={2}
                title="Review & Polish"
                description="Use the intuitive editor to refine the AI's output, adjust the design, and add your personal touch."
              />
              <StepCard
                number={3}
                title="Export & Share"
                description="Generate flawless PDF and ePub files instantly, ready for sale on major platforms like Amazon KDP."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;