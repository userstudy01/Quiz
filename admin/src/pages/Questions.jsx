import { useState, useEffect } from "react";
import API from "../utils/api";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [activeView, setActiveView] = useState("bank");
  const [formMode, setFormMode] = useState("new_module");
  const [formData, setFormData] = useState({
    title: "",
    section: "",
    tags: "",
    questionText: "",
    solutionMarkdown: "",
  });
  const [editId, setEditId] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});

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

  //   const openNewModuleForm = () => {
  //   setFormData(prev => ({ ...prev, title: '', section: 'Theory', questionText: '', solutionMarkdown: '' }));
  //   setFormMode('new_module');
  //   setEditId(null);
  //   setActiveView('form');
  // };

  const openNewModuleForm = () => {
    // prev use karne se Tags reset nahi honge
    setFormData((prev) => ({
      ...prev,
      title: "",
      section: "",
      questionText: "",
      solutionMarkdown: "",
    }));
    setFormMode("new_module");
    setEditId(null);
    setActiveView("form");
  };

  const openAddToModuleForm = (moduleName) => {
    // 🔥 prev use kiya taaki Tags aur Section yaad rahe (Sticky Memory)
    setFormData((prev) => ({
      ...prev,
      title: moduleName,
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
      section: q.section,
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
      section: "",
      tags: "",
      questionText: "",
      solutionMarkdown: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔥 Strict Payload generation
      const payload = {
        ...formData,
        section: formData.section ,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
      };

      console.log("83 REACT BHEJ RAHA HAI:", payload); // Console check karne ke liye

      if (editId) {
        await API.put(`/questions/${editId}`, payload);
      } else {
        await API.post("/questions", payload);
      }

      fetchQuestions();
      setActiveView("bank");

      // Form Success ke baad reset karein (Par Section aur Tags ko bacha kar rakhein)
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

  const groupedQuestions = questions.reduce((acc, q) => {
    const topic = q.title || "Uncategorized";
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(q);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] flex flex-col pt-24 lg:pt-0">
      {activeView === "bank" ? (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
          {/* Header Section */}
          {/* Header Section */}
          <div className="flex flex-col gap-4 mb-8 pb-4 border-b border-[#EAEAEA]">
            {/* Line 1: Title Only */}
            <h1 className="text-2xl font-black text-[#1A2533]">
              Question Bank
            </h1>

            {/* Line 2: Items and Deploy Button side-by-side */}
            <div className="flex flex-col gap-3">
              {/* Row: Items and Deploy Module */}
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

              {/* 🔥 FIXED: Ab ye button hamesha Deploy Module ke niche dikhega (Mobile View) */}
              {/* 🔥 sm:hidden ensures it ONLY shows on Mobile, not on Desktop */}
              <button
                onClick={() => {
                  const firstTopic = Object.keys(groupedQuestions)[0];
                  if (firstTopic) openAddToModuleForm(firstTopic);
                  else openNewModuleForm();
                }}
                className="sm:hidden w-full bg-white border-2 border-dashed border-[#00A896] text-[#00A896] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
              >
                <span className="text-lg">+</span> Add New Question
              </button>
            </div>
          </div>

          {/* Module List */}
          <div className="space-y-4 max-w-6xl">
            {Object.entries(groupedQuestions).map(([topic, qs]) => (
              <div
                key={topic}
                className="bg-white border border-[#EAEAEA] rounded-[2rem] shadow-soft overflow-hidden transition-all hover:border-[#00A896]/40 hover:shadow-md"
              >
                {/* Topic Header */}
                {/* Topic Header */}
                <div
                  className="p-4 flex justify-between items-center cursor-pointer bg-[#F9F9F9]"
                  onClick={() => toggleTopic(topic)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Smaller Fixed Circle for Mobile */}
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
                      className="hidden sm:block bg-[#1A2533] text-white px-4 py-1.5 rounded-lg text-[10px] font-bold shadow-sm"
                    >
                      + Add Q
                    </button>
                  </div>
                </div>

                {/* Questions List (Expanded View) */}
                <div
                  className={`transition-all duration-500 ease-in-out ${expandedTopics[topic] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
                >
                  <div className="p-5 space-y-3 bg-white border-t border-[#EAEAEA]">
                    {qs.map((q, i) => (
                      <div
                        key={q._id}
                        className="p-5 bg-[#F9F9F9] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center border border-transparent hover:border-[#EAEAEA] hover:bg-white hover:shadow-sm transition-all group gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-[#888888] bg-white border border-[#EAEAEA] px-2 py-0.5 rounded shadow-sm">
                              Q{i + 1}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm ${q.section === "Practical" ? "bg-[#EBF5FF] text-[#0A84FF]" : "bg-[#E5F1F0] text-[#00A896]"}`}
                            >
                            {/* {console.log("25" , q.section)} */}
                              {q.section}
                            </span>
                            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                              {q.tags.join(", ")}
                            </span>
                          </div>
                          <p className="text-[15px] font-bold text-[#1A2533] leading-snug">
                            {q.questionText}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 shrink-0 self-end mt-2 md:mt-0">
                          <button
                            onClick={() => handleEdit(q)}
                            className="w-8 h-8 rounded-lg bg-white text-[#00A896] flex items-center justify-center shadow-sm border border-[#EAEAEA] active:bg-[#00A896] active:text-white"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(q._id)}
                            className="w-8 h-8 rounded-lg bg-white text-[#FF3B30] flex items-center justify-center shadow-sm border border-[#EAEAEA] active:bg-[#FF3B30] active:text-white"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Add button for Mobile inside expanded view */}
                    <div
                      className={`transition-all duration-500 ease-in-out ${expandedTopics[topic] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
                    >
                      <div className="p-5 space-y-3 bg-white border-t border-[#EAEAEA]">
                        {/* 🔥 NEW: Button ab List ke sabse UPER aayega */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddToModuleForm(topic);
                          }}
                          className="w-full bg-[#E5F1F0] border-2 border-dashed border-[#00A896] text-[#00A896] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all mb-4"
                        >
                          <span className="text-lg">+</span> Add New Question to
                          this Round
                        </button>

                        {/* Baaki ki list yahan se shuru hogi */}
                        {qs.map((q, i) => (
                          <div
                            key={q._id}
                            className="p-5 bg-[#F9F9F9] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center border border-transparent hover:border-[#EAEAEA] hover:bg-white hover:shadow-sm transition-all group gap-4"
                          >
                            {/* ... (Aapka existing question list code) ... */}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 🔥 COMPACT FORM VIEW 🔥 */
        <div className="h-full flex flex-col justify-center items-center p-4 bg-[#E5F1F0]/30 relative">
          {/* Subtle background element */}
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
              {/* Row 1: Name, Category, Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">
                    Round Name
                  </label>
                  <input
                    type="text"
                    placeholder="Topic Name"
                    required
                    disabled={formMode === "add_to_module"}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white text-sm font-bold text-[#1A2533] disabled:opacity-60 transition-all shadow-sm"
                  />
                </div>
                {/* <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Category</label>
                                    <select
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none text-sm font-bold text-[#1A2533] cursor-pointer focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
                                    >
                                        <option value="Theory">Theory Section</option>
                                        <option value="Practical">Practical Section</option>
                                    </select>
                                </div> */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">
                    Category
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({ ...prev, section: val }));
                    }}
                    className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none text-sm font-bold text-[#1A2533] cursor-pointer focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
                  >
                    <option value="Theory">Theory Section</option>
                    <option value="Practical">Practical Section</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JS, Core, Advanced"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white text-sm font-bold text-[#1A2533] transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Row 2: Question Text */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">
                  Question Details
                </label>
                <textarea
                  placeholder="Enter the exact question text..."
                  required
                  rows="2"
                  value={formData.questionText}
                  onChange={(e) =>
                    setFormData({ ...formData, questionText: e.target.value })
                  }
                  className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none resize-none text-base font-medium text-[#1A2533] focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Row 3: Solution/Logic */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#00A896] ml-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00A896] rounded-full"></span>{" "}
                  Expected Logic / Solution (Markdown supported)
                </label>
                <textarea
                  placeholder="Keywords or code logic for the AI engine to evaluate..."
                  required
                  rows="4"
                  value={formData.solutionMarkdown}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      solutionMarkdown: e.target.value,
                    })
                  }
                  className="w-full p-4 bg-[#1A2533] text-[#E5F1F0] rounded-2xl border-none outline-none font-mono text-sm resize-none focus:ring-2 focus:ring-[#00A896] transition-all shadow-inner placeholder-[#888888]"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-4 mt-4 bg-[#00A896] hover:bg-[#009686] text-white rounded-2xl font-black text-base shadow-lg shadow-[#00A896]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {editId ? "Execute Update" : "Push to Database"}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
