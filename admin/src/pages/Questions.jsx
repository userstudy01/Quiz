import { useState, useEffect } from "react";
import API from "../utils/api";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [activeView, setActiveView] = useState("bank");
  const [formMode, setFormMode] = useState("new_module");
  
  // 🔥 FIX 1: Set default section to "Theory" so it never saves as blank
  const [formData, setFormData] = useState({
    title: "",
    section: "Theory", 
    tags: "",
    questionText: "",
    solutionMarkdown: "",
  });
  
  const [editId, setEditId] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await API.get("/questions");
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openNewModuleForm = () => {
    setFormData((prev) => ({
      ...prev,
      title: "",
      section: "Theory", // 🔥 Reset explicitly to Theory
      questionText: "",
      solutionMarkdown: "",
    }));
    setFormMode("new_module");
    setEditId(null);
    setActiveView("form");
  };

  const openAddToModuleForm = (moduleName) => {
    const existingQuestion = questions.find((q) => q.title === moduleName);
    const existingTags = existingQuestion && existingQuestion.tags ? existingQuestion.tags.join(", ") : "";

    setFormData((prev) => ({
      ...prev,
      title: moduleName,
      tags: existingTags,
      section: "Theory", // 🔥 Reset explicitly to Theory
      questionText: "",
      solutionMarkdown: "",
    }));
    setFormMode("add_to_module");
    setEditId(null);
    setActiveView("form");
  };

  const handleEdit = (q) => {
    setFormData({
      title: q.title,
      section: q.section || "Theory", // 🔥 Fallback
      tags: q.tags.join(", "),
      questionText: q.questionText,
      solutionMarkdown: q.solutionMarkdown,
    });
    setFormMode("edit_question");
    setEditId(q._id);
    setActiveView("form");
  };

  const cancelForm = () => {
    setActiveView("bank");
    setEditId(null);
    setFormData({
      title: "",
      section: "Theory",
      tags: "",
      questionText: "",
      solutionMarkdown: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        section: formData.section || "Theory", // 🔥 Final safety check before saving
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
      };

      if (editId) {
        await API.put(`/questions/${editId}`, payload);
      } else {
        await API.post("/questions", payload);
      }

      fetchQuestions();
      setActiveView("bank");

      setFormData((prev) => ({
        ...prev,
        questionText: "",
        solutionMarkdown: "",
      }));
    } catch (error) {
      alert("Error saving question");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await API.delete(`/questions/${id}`);
        fetchQuestions();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const toggleTopic = (topicName) => {
    setExpandedTopics((prev) => ({ ...prev, [topicName]: !prev[topicName] }));
  };

  const groupedByCategory = questions.reduce((acc, q) => {
    const mainTag = (q.tags && q.tags.length > 0 && q.tags[0].trim() !== '') 
      ? q.tags[0].toUpperCase() 
      : "GENERAL";
      
    const topic = q.title || "Uncategorized";

    if (!acc[mainTag]) acc[mainTag] = {};
    if (!acc[mainTag][topic]) acc[mainTag][topic] = [];

    acc[mainTag][topic].push(q);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] flex flex-col pt-24 lg:pt-0">
      {activeView === "bank" ? (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
          {/* Header Section */}
          <div className="flex flex-col gap-4 mb-8 pb-4 border-b border-[#EAEAEA]">
            <h1 className="text-2xl font-black text-[#1A2533]">Question Bank</h1>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="bg-[#E5F1F0] text-[#00A896] text-[10px] px-3 py-2 rounded-xl shadow-sm font-bold whitespace-nowrap">
                  {questions.length} Items
                </div>
                <button
                  onClick={openNewModuleForm}
                  className="flex-1 bg-[#00A896] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span className="text-base">+</span> Deploy Module
                </button>
              </div>

              <button
                onClick={() => {
                  const firstCategory = Object.values(groupedByCategory)[0];
                  const firstTopic = firstCategory ? Object.keys(firstCategory)[0] : null;
                  if (firstTopic) openAddToModuleForm(firstTopic);
                  else openNewModuleForm();
                }}
                className="sm:hidden w-full bg-white border-2 border-dashed border-[#00A896] text-[#00A896] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
              >
                <span className="text-lg">+</span> Add New Question
              </button>
            </div>
          </div>

          <div className="max-w-6xl">
            {/* VIEW 1: THE CARDS GRID */}
            {!activeCategory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Object.entries(groupedByCategory).map(([category, topics]) => {
                  const moduleCount = Object.keys(topics).length;
                  const questionCount = Object.values(topics).flat().length;
                  return (
                    <div 
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className="bg-white border border-[#EAEAEA] rounded-[2rem] p-8 shadow-sm hover:shadow-md hover:border-[#00A896] transition-all cursor-pointer flex flex-col items-center text-center group"
                    >
                      <div className="w-16 h-16 bg-[#E5F1F0] text-[#00A896] rounded-2xl flex items-center justify-center font-black text-xl mb-4 group-hover:scale-110 transition-transform">
                        {category.substring(0, 2)}
                      </div>
                      <h2 className="text-lg font-black text-[#1A2533]">{category}</h2>
                      <p className="text-xs font-bold text-[#888888] mt-2 bg-[#F9F9F9] px-3 py-1 rounded-full border border-[#EAEAEA]">
                        {moduleCount} Modules • {questionCount} Qs
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VIEW 2: THE LIST OF MODULES */
              <div className="space-y-4 animate-fade-in">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="flex items-center gap-2 text-sm font-bold text-[#888888] hover:text-[#1A2533] mb-6 transition-colors"
                >
                  <span>←</span> Back to Folders
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xs font-black text-[#00A896] tracking-widest uppercase bg-[#E5F1F0] px-4 py-2 rounded-full border border-[#D9E9E8]">
                    {activeCategory} MODULES
                  </h2>
                  <div className="h-[1px] flex-1 bg-[#EAEAEA]"></div>
                </div>

                {Object.entries(groupedByCategory[activeCategory] || {}).map(([topic, qs]) => (
                  <div
                    key={topic}
                    className="bg-white border border-[#EAEAEA] rounded-[2rem] shadow-soft overflow-hidden transition-all hover:border-[#00A896]/40 hover:shadow-md"
                  >
                    <div
                      className="p-4 flex justify-between items-center cursor-pointer bg-[#F9F9F9]"
                      onClick={() => toggleTopic(topic)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm transition-all duration-300 ${expandedTopics[topic] ? "bg-[#00A896] text-white rotate-180" : "bg-white text-[#1A2533] border border-[#EAEAEA]"}`}
                        >
                          {expandedTopics[topic] ? "−" : "+"}
                        </div>
                        <h3 className="text-sm font-black text-[#1A2533] truncate leading-tight">
                          {topic}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden sm:block text-[10px] font-bold text-[#888888]">
                          {qs.length} Elements
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddToModuleForm(topic);
                          }}
                          className="hidden sm:block bg-[#1A2533] text-white px-4 py-1.5 rounded-lg text-[10px] font-bold shadow-sm hover:bg-[#2A3543]"
                        >
                          + Add Q
                        </button>
                      </div>
                    </div>

                    <div
                      className={`transition-all duration-500 ease-in-out ${expandedTopics[topic] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
                    >
                      <div className="p-5 space-y-3 bg-white border-t border-[#EAEAEA]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddToModuleForm(topic);
                          }}
                          className="w-full bg-[#E5F1F0] border-2 border-dashed border-[#00A896] text-[#00A896] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all mb-4 hover:bg-[#D9E9E8]"
                        >
                          <span className="text-lg">+</span> Add New Question to this Round
                        </button>

                        {qs.map((q, i) => {
                          // 🔥 FIX 2: Fallback variable ensures it always shows Theory if data is missing
                          const displaySection = q.section || "Theory"; 
                          
                          return (
                          <div
                            key={q._id}
                            className="p-5 bg-[#F9F9F9] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center border border-transparent hover:border-[#EAEAEA] hover:bg-white hover:shadow-sm transition-all group gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-[#888888] bg-white border border-[#EAEAEA] px-2 py-0.5 rounded shadow-sm">
                                  Q{i + 1}
                                </span>
                                
                                {/* 🔥 Uses the fallback displaySection variable here */}
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm ${displaySection === "Practical" ? "bg-[#EBF5FF] text-[#0A84FF]" : "bg-[#E5F1F0] text-[#00A896]"}`}
                                >
                                  {displaySection}
                                </span>

                                <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                                  {q.tags.join(", ")}
                                </span>
                              </div>
                              <p className="text-[15px] font-bold text-[#1A2533] leading-snug">
                                {q.questionText}
                              </p>
                            </div>

                            <div className="flex gap-2 shrink-0 self-end mt-2 md:mt-0">
                              <button
                                onClick={() => handleEdit(q)}
                                className="w-8 h-8 rounded-lg bg-white text-[#00A896] flex items-center justify-center shadow-sm border border-[#EAEAEA] hover:bg-[#00A896] hover:text-white transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(q._id)}
                                className="w-8 h-8 rounded-lg bg-white text-[#FF3B30] flex items-center justify-center shadow-sm border border-[#EAEAEA] hover:bg-[#FF3B30] hover:text-white transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Form View */
        <div className="h-full flex flex-col justify-center items-center p-4 bg-[#E5F1F0]/30 relative">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#00A896]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full max-w-5xl bg-white p-8 md:p-10 rounded-[3rem] border border-[#EAEAEA] shadow-2xl shadow-[#1A2533]/5 relative z-10">
            <div className="flex justify-between items-center mb-8 border-b border-[#EAEAEA] pb-5">
              <h2 className="text-3xl font-black text-[#1A2533]">
                {editId ? "Edit Element" : "Deploy New Element"}
              </h2>
              <button
                onClick={cancelForm}
                className="text-[#888888] font-bold text-sm hover:text-[#1A2533] transition-colors bg-[#F9F9F9] px-4 py-2 rounded-xl border border-[#EAEAEA]"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Round Name</label>
                  <input
                    type="text"
                    placeholder="Topic Name"
                    required
                    disabled={formMode === "add_to_module"}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white text-sm font-bold text-[#1A2533] disabled:opacity-60 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Category</label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
                    className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none text-sm font-bold text-[#1A2533] cursor-pointer focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
                  >
                    <option value="Theory">Theory Section</option>
                    <option value="Practical">Practical Section</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. ReactJS, Hooks, Advanced"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white text-sm font-bold text-[#1A2533] transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Question Details</label>
                <textarea
                  placeholder="Enter the exact question text..."
                  required
                  rows="2"
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none resize-none text-base font-medium text-[#1A2533] focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#00A896] ml-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00A896] rounded-full"></span> Expected Logic / Solution (Markdown supported)
                </label>
                <textarea
                  placeholder="Keywords or code logic for the AI engine to evaluate..."
                  required
                  rows="4"
                  value={formData.solutionMarkdown}
                  onChange={(e) => setFormData({ ...formData, solutionMarkdown: e.target.value })}
                  className="w-full p-4 bg-[#1A2533] text-[#E5F1F0] rounded-2xl border-none outline-none font-mono text-sm resize-none focus:ring-2 focus:ring-[#00A896] transition-all shadow-inner placeholder-[#888888]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-4 bg-[#00A896] hover:bg-[#009686] text-white rounded-2xl font-black text-base shadow-lg shadow-[#00A896]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {editId ? "Execute Update" : "Push to Database"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}