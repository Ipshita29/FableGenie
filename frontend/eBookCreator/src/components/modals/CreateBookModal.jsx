import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Sparkles,
  Trash2,
  ArrowLeft,
  BookOpen,
  Hash,
  Lightbulb,
  Palette,
} from "lucide-react";
import Modal from "../ui/Modal";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import axiosInstance from "../../utlis/axiosInstance";
import { API_PATHS } from "../../utlis/apiPaths";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [bookTitle, setBookTitle] = useState("");
  const [numChapters, setNumChapters] = useState(5);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  const [chapters, setChapters] = useState([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isFinalizingBook, setIsFinalizingBook] = useState(false);
 
  const chaptersContainerRef = useRef(null);

  const resetModal = () => {
    setStep(1);
    setBookTitle("");
    setNumChapters(5);
    setAiTopic("");
    setAiStyle("Informative");
    setChapters([]);
    setIsGeneratingOutline(false);
    setIsFinalizingBook(false);
  };

  const handleGenerateOutline = async () => {
    // logic to generate AI outline
    if (!bookTitle||!numChapters){
      toast.error("Please provide a title and Number of Chapters")
      return;
    }
    setIsGeneratingOutline(true)
    try{
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE,{
        topic:bookTitle,
        description:aiTopic||"",
        style:aiStyle,
        numChapters:numChapters
      })
      setChapters(response.data.outline)
      setStep(2)
      toast.success("Outline generated! Review and make changes")
    }
    catch(error){toast.error(
      error.response?.data?.message || "Failed to generate outline."
    )}
    finally{
      setIsGeneratingOutline(false)
    }
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  const handleDeleteChapter = (index) => {
    if (chapters.length === 1) return;
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      {
        title: `Chapter ${chapters.length + 1}`,
        description: "",
      },
    ]);
  };

  const handleFinalizeBook = async () => {
    if (!bookTitle||chapters.length===0){
      toast.error("Book title and at least one chapter are required")
      return;
    }
    setIsFinalizingBook(true)
    try{
      const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK,{
        title:bookTitle,
        author:user.name || "Unknown Author",
        chapters:chapters
      })
      toast.success("eBook created successfully!")
      onBookCreated(response.data._id)
      onClose()
      resetModal()
    }
    catch(error){console.log("TESR__",bookTitle,chapters)
      toast.error(
      error.response?.data?.message || "Failed to generate outline."
    )
    }
    finally{
      setIsFinalizingBook(false)
    }
  };

  useEffect(() => {
    if (step === 2 && chaptersContainerRef.current) {
      const scrollableDiv = chaptersContainerRef.current;
      scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chapters.length, step]);

  

  return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                resetModal();
            }}
            title="Create New eBook"
            >
            {step===1 && (
              <div className="">
              <div className="">
                <div className="">
                  <div className="">1</div>
                  <div className=""></div>
                  <div className="">2</div>
                </div>
              </div>
              <InputField
              icon={BookOpen}
              label="Book Title"
              placeholder="Enter your book title..."
              value={bookTitle}
              onChange={(e)=>setBookTitle(e.target.value)}
              />
               <InputField
              icon={Hash}
              label="Number of Chapters"
              type="number"
              placeholder="5"
              value={numChapters}
              onChange={(e)=>setNumChapters(parseInt(e.target.value)||1)}
              />
               <InputField
              icon={Lightbulb}
              label="Topic (Optional)"
              placeholder="Specific Topic for AI generation..."
              value={aiTopic}
              onChange={(e)=>setAiTopic(e.target.value)}
              />
              <SelectField
              icon={Palette}
              label="Writing Style"
              value={aiStyle}
              onChange={(e)=>setAiStyle(e.target.value)}
              options={[
                "Informative",
                "StoryTelling",
                "Casual",
                "Professional",
                "Humorous"
              ]}/>
              <div className="">
                <Button onClick={handleGenerateOutline}
                isLoading={isGeneratingOutline}
                icon={Sparkles}>
                  Generate Outline with AI
                </Button>
              </div>
              </div>

              
            )}
            {step === 2 && (
            <div className="space-y-6">
              {/* ✅ Progress Indicator */}
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full font-bold">
                    ✔️
                  </div>
                  <div className="w-16 h-1 bg-green-500"></div>
                  <div className="w-8 h-8 flex items-center justify-center bg-yellow-400 text-white rounded-full font-bold">
                    2
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">Review Chapters</h3>
                <span className="text-sm text-gray-500">
                  {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
                </span>
              </div>
              <div
                ref={chaptersContainerRef}
                className="max-h-64 overflow-y-auto border rounded-lg bg-white p-4 shadow-inner"
              >
                {chapters.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                    <BookOpen className="w-10 h-10 mb-2 text-gray-400" />
                    <p className="text-sm">No Chapters Yet</p>
                  </div>
                ) : (
                  chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 mb-2 bg-amber-50 border border-amber-100 rounded-lg shadow-sm hover:bg-amber-100 transition"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Chapter {index + 1}: {chapter.title || "Untitled Chapter"}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {chapter.description || "No description available."}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteChapter(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  icon={ArrowLeft}
                  onClick={() => setStep(1)}
                >Back</Button>
                

                <div className="flex space-x-3">
                  <Button
                    icon={Plus}
                    onClick={handleAddChapter}
                  >Add Chapter</Button>

                  <Button
                    icon={Sparkles}
                    onClick={handleFinalizeBook}
                    disabled={isFinalizingBook}
                  >{isFinalizingBook ? "Creating..." : "Create eBook"}</Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
  );
};

export default CreateBookModal;
