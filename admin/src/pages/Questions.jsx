// import { useState, useEffect } from "react";
// import API from "../utils/api";

// export default function Questions() {
//   const [questions, setQuestions] = useState([]);
//   const [activeView, setActiveView] = useState("bank");
//   const [formMode, setFormMode] = useState("new_module");
  
//   // 🔥 FIX 1: Set default section to "Theory" so it never saves as blank
//   const [formData, setFormData] = useState({
//     title: "",
//     section: "Theory", 
//     tags: "",
//     questionText: "",
//     solutionMarkdown: "",
//   });
  
//   const [editId, setEditId] = useState(null);
//   const [expandedTopics, setExpandedTopics] = useState({});
//   const [activeCategory, setActiveCategory] = useState(null);

//   useEffect(() => {
//     document.documentElement.classList.remove("dark");
//   }, []);

//   const fetchQuestions = async () => {
//     try {
//       const { data } = await API.get("/questions");
//       setQuestions(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   const openNewModuleForm = () => {
//     setFormData((prev) => ({
//       ...prev,
//       title: "",
//       section: "Theory", // 🔥 Reset explicitly to Theory
//       questionText: "",
//       solutionMarkdown: "",
//     }));
//     setFormMode("new_module");
//     setEditId(null);
//     setActiveView("form");
//   };

//   const openAddToModuleForm = (moduleName) => {
//     const existingQuestion = questions.find((q) => q.title === moduleName);
//     const existingTags = existingQuestion && existingQuestion.tags ? existingQuestion.tags.join(", ") : "";

//     setFormData((prev) => ({
//       ...prev,
//       title: moduleName,
//       tags: existingTags,
//       section: "Theory", // 🔥 Reset explicitly to Theory
//       questionText: "",
//       solutionMarkdown: "",
//     }));
//     setFormMode("add_to_module");
//     setEditId(null);
//     setActiveView("form");
//   };

//   const handleEdit = (q) => {
//     setFormData({
//       title: q.title,
//       section: q.section || "Theory", // 🔥 Fallback
//       tags: q.tags.join(", "),
//       questionText: q.questionText,
//       solutionMarkdown: q.solutionMarkdown,
//     });
//     setFormMode("edit_question");
//     setEditId(q._id);
//     setActiveView("form");
//   };

//   const cancelForm = () => {
//     setActiveView("bank");
//     setEditId(null);
//     setFormData({
//       title: "",
//       section: "Theory",
//       tags: "",
//       questionText: "",
//       solutionMarkdown: "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...formData,
//         section: formData.section || "Theory", // 🔥 Final safety check before saving
//         tags: formData.tags
//           ? formData.tags.split(",").map((t) => t.trim())
//           : [],
//       };

//       if (editId) {
//         await API.put(`/questions/${editId}`, payload);
//       } else {
//         await API.post("/questions", payload);
//       }

//       fetchQuestions();
//       setActiveView("bank");

//       setFormData((prev) => ({
//         ...prev,
//         questionText: "",
//         solutionMarkdown: "",
//       }));
//     } catch (error) {
//       alert("Error saving question");
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this?")) {
//       try {
//         await API.delete(`/questions/${id}`);
//         fetchQuestions();
//       } catch (err) {
//         alert("Delete failed");
//       }
//     }
//   };

//   const toggleTopic = (topicName) => {
//     setExpandedTopics((prev) => ({ ...prev, [topicName]: !prev[topicName] }));
//   };

//   const groupedByCategory = questions.reduce((acc, q) => {
//     const mainTag = (q.tags && q.tags.length > 0 && q.tags[0].trim() !== '') 
//       ? q.tags[0].toUpperCase() 
//       : "GENERAL";
      
//     const topic = q.title || "Uncategorized";

//     if (!acc[mainTag]) acc[mainTag] = {};
//     if (!acc[mainTag][topic]) acc[mainTag][topic] = [];

//     acc[mainTag][topic].push(q);
//     return acc;
//   }, {});

//   return (
//     <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] flex flex-col pt-24 lg:pt-0">
//       {activeView === "bank" ? (
//         <div className="p-6 md:p-8 h-full overflow-y-auto">
//           {/* Header Section */}
//           <div className="flex flex-col gap-4 mb-8 pb-4 border-b border-[#EAEAEA]">
//             <h1 className="text-2xl font-black text-[#1A2533]">Question Bank</h1>

//             <div className="flex flex-col gap-3">
//               <div className="flex items-center justify-between gap-3">
//                 <div className="bg-[#E5F1F0] text-[#00A896] text-[10px] px-3 py-2 rounded-xl shadow-sm font-bold whitespace-nowrap">
//                   {questions.length} Items
//                 </div>
//                 <button
//                   onClick={openNewModuleForm}
//                   className="flex-1 bg-[#00A896] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
//                 >
//                   <span className="text-base">+</span> Deploy Module
//                 </button>
//               </div>

//               <button
//                 onClick={() => {
//                   const firstCategory = Object.values(groupedByCategory)[0];
//                   const firstTopic = firstCategory ? Object.keys(firstCategory)[0] : null;
//                   if (firstTopic) openAddToModuleForm(firstTopic);
//                   else openNewModuleForm();
//                 }}
//                 className="sm:hidden w-full bg-white border-2 border-dashed border-[#00A896] text-[#00A896] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
//               >
//                 <span className="text-lg">+</span> Add New Question
//               </button>
//             </div>
//           </div>

//           <div className="max-w-6xl">
//             {/* VIEW 1: THE CARDS GRID */}
//             {!activeCategory ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {Object.entries(groupedByCategory).map(([category, topics]) => {
//                   const moduleCount = Object.keys(topics).length;
//                   const questionCount = Object.values(topics).flat().length;
//                   return (
//                     <div 
//                       key={category}
//                       onClick={() => setActiveCategory(category)}
//                       className="bg-white border border-[#EAEAEA] rounded-[2rem] p-8 shadow-sm hover:shadow-md hover:border-[#00A896] transition-all cursor-pointer flex flex-col items-center text-center group"
//                     >
//                       <div className="w-16 h-16 bg-[#E5F1F0] text-[#00A896] rounded-2xl flex items-center justify-center font-black text-xl mb-4 group-hover:scale-110 transition-transform">
//                         {category.substring(0, 2)}
//                       </div>
//                       <h2 className="text-lg font-black text-[#1A2533]">{category}</h2>
//                       <p className="text-xs font-bold text-[#888888] mt-2 bg-[#F9F9F9] px-3 py-1 rounded-full border border-[#EAEAEA]">
//                         {moduleCount} Modules • {questionCount} Qs
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               /* VIEW 2: THE LIST OF MODULES */
//               <div className="space-y-4 animate-fade-in">
//                 <button 
//                   onClick={() => setActiveCategory(null)}
//                   className="flex items-center gap-2 text-sm font-bold text-[#888888] hover:text-[#1A2533] mb-6 transition-colors"
//                 >
//                   <span>←</span> Back to Folders
//                 </button>

//                 <div className="flex items-center gap-4 mb-6">
//                   <h2 className="text-xs font-black text-[#00A896] tracking-widest uppercase bg-[#E5F1F0] px-4 py-2 rounded-full border border-[#D9E9E8]">
//                     {activeCategory} MODULES
//                   </h2>
//                   <div className="h-[1px] flex-1 bg-[#EAEAEA]"></div>
//                 </div>

//                 {Object.entries(groupedByCategory[activeCategory] || {}).map(([topic, qs]) => (
//                   <div
//                     key={topic}
//                     className="bg-white border border-[#EAEAEA] rounded-[2rem] shadow-soft overflow-hidden transition-all hover:border-[#00A896]/40 hover:shadow-md"
//                   >
//                     <div
//                       className="p-4 flex justify-between items-center cursor-pointer bg-[#F9F9F9]"
//                       onClick={() => toggleTopic(topic)}
//                     >
//                       <div className="flex items-center gap-3 min-w-0">
//                         <div
//                           className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm transition-all duration-300 ${expandedTopics[topic] ? "bg-[#00A896] text-white rotate-180" : "bg-white text-[#1A2533] border border-[#EAEAEA]"}`}
//                         >
//                           {expandedTopics[topic] ? "−" : "+"}
//                         </div>
//                         <h3 className="text-sm font-black text-[#1A2533] truncate leading-tight">
//                           {topic}
//                         </h3>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <span className="hidden sm:block text-[10px] font-bold text-[#888888]">
//                           {qs.length} Elements
//                         </span>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openAddToModuleForm(topic);
//                           }}
//                           className="hidden sm:block bg-[#1A2533] text-white px-4 py-1.5 rounded-lg text-[10px] font-bold shadow-sm hover:bg-[#2A3543]"
//                         >
//                           + Add Q
//                         </button>
//                       </div>
//                     </div>

//                     <div
//                       className={`transition-all duration-500 ease-in-out ${expandedTopics[topic] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
//                     >
//                       <div className="p-5 space-y-3 bg-white border-t border-[#EAEAEA]">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openAddToModuleForm(topic);
//                           }}
//                           className="w-full bg-[#E5F1F0] border-2 border-dashed border-[#00A896] text-[#00A896] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all mb-4 hover:bg-[#D9E9E8]"
//                         >
//                           <span className="text-lg">+</span> Add New Question to this Round
//                         </button>

//                         {qs.map((q, i) => {
//                           // 🔥 FIX 2: Fallback variable ensures it always shows Theory if data is missing
//                           const displaySection = q.section || "Theory"; 
                          
//                           return (
//                           <div
//                             key={q._id}
//                             className="p-5 bg-[#F9F9F9] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center border border-transparent hover:border-[#EAEAEA] hover:bg-white hover:shadow-sm transition-all group gap-4"
//                           >
//                             <div className="flex-1">
//                               <div className="flex flex-wrap items-center gap-2 mb-2">
//                                 <span className="text-[10px] font-black text-[#888888] bg-white border border-[#EAEAEA] px-2 py-0.5 rounded shadow-sm">
//                                   Q{i + 1}
//                                 </span>
                                
//                                 {/* 🔥 Uses the fallback displaySection variable here */}
//                                 <span
//                                   className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm ${displaySection === "Practical" ? "bg-[#EBF5FF] text-[#0A84FF]" : "bg-[#E5F1F0] text-[#00A896]"}`}
//                                 >
//                                   {displaySection}
//                                 </span>

//                                 <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
//                                   {q.tags.join(", ")}
//                                 </span>
//                               </div>
//                               <p className="text-[15px] font-bold text-[#1A2533] leading-snug">
//                                 {q.questionText}
//                               </p>
//                             </div>

//                             <div className="flex gap-2 shrink-0 self-end mt-2 md:mt-0">
//                               <button
//                                 onClick={() => handleEdit(q)}
//                                 className="w-8 h-8 rounded-lg bg-white text-[#00A896] flex items-center justify-center shadow-sm border border-[#EAEAEA] hover:bg-[#00A896] hover:text-white transition-colors"
//                               >
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
//                                 </svg>
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(q._id)}
//                                 className="w-8 h-8 rounded-lg bg-white text-[#FF3B30] flex items-center justify-center shadow-sm border border-[#EAEAEA] hover:bg-[#FF3B30] hover:text-white transition-colors"
//                               >
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                                 </svg>
//                               </button>
//                             </div>
//                           </div>
//                         )})}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         /* Form View */
//         <div className="h-full flex flex-col justify-center items-center p-4 bg-[#E5F1F0]/30 relative">
//           <div className="absolute top-10 right-10 w-96 h-96 bg-[#00A896]/10 rounded-full blur-3xl pointer-events-none"></div>

//           <div className="w-full max-w-5xl bg-white p-8 md:p-10 rounded-[3rem] border border-[#EAEAEA] shadow-2xl shadow-[#1A2533]/5 relative z-10">
//             <div className="flex justify-between items-center mb-8 border-b border-[#EAEAEA] pb-5">
//               <h2 className="text-3xl font-black text-[#1A2533]">
//                 {editId ? "Edit Element" : "Deploy New Element"}
//               </h2>
//               <button
//                 onClick={cancelForm}
//                 className="text-[#888888] font-bold text-sm hover:text-[#1A2533] transition-colors bg-[#F9F9F9] px-4 py-2 rounded-xl border border-[#EAEAEA]"
//               >
//                 ✕ Cancel
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Round Name</label>
//                   <input
//                     type="text"
//                     placeholder="Topic Name"
//                     required
//                     disabled={formMode === "add_to_module"}
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white text-sm font-bold text-[#1A2533] disabled:opacity-60 transition-all shadow-sm"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Category</label>
//                   <select
//                     name="section"
//                     value={formData.section}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
//                     className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none text-sm font-bold text-[#1A2533] cursor-pointer focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
//                   >
//                     <option value="Theory">Theory Section</option>
//                     <option value="Practical">Practical Section</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Tags (Comma separated)</label>
//                   <input
//                     type="text"
//                     placeholder="e.g. ReactJS, Hooks, Advanced"
//                     value={formData.tags}
//                     onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
//                     className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white text-sm font-bold text-[#1A2533] transition-all shadow-sm"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Question Details</label>
//                 <textarea
//                   placeholder="Enter the exact question text..."
//                   required
//                   rows="2"
//                   value={formData.questionText}
//                   onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
//                   className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none resize-none text-base font-medium text-[#1A2533] focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black uppercase tracking-wider text-[#00A896] ml-1 flex items-center gap-2">
//                   <span className="w-1.5 h-1.5 bg-[#00A896] rounded-full"></span> Expected Logic / Solution (Markdown supported)
//                 </label>
//                 <textarea
//                   placeholder="Keywords or code logic for the AI engine to evaluate..."
//                   required
//                   rows="4"
//                   value={formData.solutionMarkdown}
//                   onChange={(e) => setFormData({ ...formData, solutionMarkdown: e.target.value })}
//                   className="w-full p-4 bg-[#1A2533] text-[#E5F1F0] rounded-2xl border-none outline-none font-mono text-sm resize-none focus:ring-2 focus:ring-[#00A896] transition-all shadow-inner placeholder-[#888888]"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-4 mt-4 bg-[#00A896] hover:bg-[#009686] text-white rounded-2xl font-black text-base shadow-lg shadow-[#00A896]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//               >
//                 {editId ? "Execute Update" : "Push to Database"}
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import API from "../utils/api";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [activeView, setActiveView] = useState("bank");
  const [formMode, setFormMode] = useState("new_module");
  
  // 🔥 Set default section to "Theory" so it never saves as blank
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
      section: "Theory", 
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
      section: "Theory", 
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
      section: q.section || "Theory", 
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
        section: formData.section || "Theory", 
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
    <div className="min-h-screen bg-[#F4F5F9] font-sans text-slate-800 flex flex-col pt-24 lg:pt-0">
      {activeView === "bank" ? (
        <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Question Bank</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Manage, categorize, and deploy your quiz modules.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="bg-white border border-slate-200 text-purple-600 text-sm px-4 py-2.5 rounded-xl shadow-sm font-bold whitespace-nowrap w-full sm:w-auto text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                {questions.length} Items Total
              </div>
              <button
                onClick={openNewModuleForm}
                className="w-full sm:w-auto flex-1 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Deploy Module
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
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
                      className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group hover:-translate-y-1 relative overflow-hidden"
                    >
                      {/* Subtle background glow on hover */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-xl mb-5 group-hover:scale-110 transition-transform shadow-inner relative z-10">
                        {/* Use SVG Folder Icon for premium look */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                      </div>
                      <h2 className="text-lg font-bold text-slate-800 relative z-10">{category}</h2>
                      <p className="text-xs font-semibold text-slate-500 mt-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 relative z-10">
                        {moduleCount} Modules • {questionCount} Qs
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VIEW 2: THE LIST OF MODULES */
              <div className="space-y-4 animate-fade-in max-w-5xl">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 mb-6 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Back to Folders
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xs font-black text-purple-700 tracking-widest uppercase bg-purple-100 px-4 py-2 rounded-lg border border-purple-200 shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    {activeCategory} MODULES
                  </h2>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                </div>

                {Object.entries(groupedByCategory[activeCategory] || {}).map(([topic, qs]) => (
                  <div
                    key={topic}
                    className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden transition-all hover:border-purple-300"
                  >
                    <div
                      className="p-5 flex justify-between items-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                      onClick={() => toggleTopic(topic)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${expandedTopics[topic] ? "bg-purple-600 text-white rotate-180" : "bg-white text-slate-700 border border-slate-200"}`}
                        >
                          {expandedTopics[topic] ? (
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
                          ) : (
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-800 truncate leading-tight">
                          {topic}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex text-[11px] font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                          {qs.length} Elements
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddToModuleForm(topic);
                          }}
                          className="hidden sm:flex bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                          Add Q
                        </button>
                      </div>
                    </div>

                    <div
                      className={`transition-all duration-500 ease-in-out ${expandedTopics[topic] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden bg-white`}
                    >
                      <div className="p-5 space-y-3 border-t border-slate-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddToModuleForm(topic);
                          }}
                          className="w-full bg-purple-50 hover:bg-purple-100 border-2 border-dashed border-purple-300 text-purple-700 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all mb-4"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                          Add New Question to this Round
                        </button>

                        {qs.map((q, i) => {
                          const displaySection = q.section || "Theory"; 
                          
                          return (
                          <div
                            key={q._id}
                            className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-purple-200 hover:shadow-md transition-all group gap-4 relative overflow-hidden"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-purple-400 transition-colors"></div>
                            
                            <div className="flex-1 pl-2">
                              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded shadow-sm">
                                  Q{i + 1}
                                </span>
                                
                                {/* Refined Section Tags */}
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                                    displaySection === "Practical" 
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                      : "bg-indigo-50 text-indigo-600 border-indigo-200"
                                  }`}
                                >
                                  {displaySection}
                                </span>

                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                  {q.tags.join(", ")}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-slate-800 leading-snug pr-4">
                                {q.questionText}
                              </p>
                            </div>

                            <div className="flex gap-2 shrink-0 self-end md:self-center mt-2 md:mt-0">
                              <button
                                onClick={() => handleEdit(q)}
                                className="w-9 h-9 rounded-xl bg-slate-50 text-indigo-500 flex items-center justify-center border border-slate-200 hover:bg-indigo-500 hover:text-white transition-all shadow-sm hover:shadow-md"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(q._id)}
                                className="w-9 h-9 rounded-xl bg-slate-50 text-rose-500 flex items-center justify-center border border-slate-200 hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-md"
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
        /* ================== FORM VIEW ================== */
        <div className="h-full flex flex-col justify-center items-center p-4 lg:p-10 relative overflow-y-auto">
          {/* Background Decorative Blob */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full max-w-4xl bg-white p-8 md:p-10 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 relative z-10">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {editId ? "Edit Element" : "Deploy New Element"}
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">Fill in the details below to update the module.</p>
              </div>
              <button
                onClick={cancelForm}
                className="text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 ml-1">Round Name</label>
                  <input
                    type="text"
                    placeholder="Topic Name"
                    required
                    disabled={formMode === "add_to_module"}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 focus:bg-white text-sm font-semibold text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 ml-1">Category</label>
                  <div className="relative">
                    <select
                      name="section"
                      value={formData.section}
                      onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
                      className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-semibold text-slate-800 cursor-pointer focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 focus:bg-white transition-all shadow-sm appearance-none"
                    >
                      <option value="Theory">Theory Section</option>
                      <option value="Practical">Practical Section</option>
                    </select>
                    <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 ml-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. ReactJS, Hooks"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 focus:bg-white text-sm font-semibold text-slate-800 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 ml-1">Question Details</label>
                <textarea
                  placeholder="Enter the exact question text..."
                  required
                  rows="3"
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none resize-none text-sm font-semibold text-slate-800 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Enhanced Markdown Terminal Editor */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-600 ml-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  Expected Logic / Solution (Markdown supported)
                </label>
                <div className="rounded-xl overflow-hidden shadow-inner border border-slate-800">
                  <div className="bg-slate-900 px-4 py-2 flex gap-2 border-b border-slate-800 items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">solution.md</span>
                  </div>
                  <textarea
                    placeholder="// Keywords or code logic for the AI engine to evaluate..."
                    required
                    rows="5"
                    value={formData.solutionMarkdown}
                    onChange={(e) => setFormData({ ...formData, solutionMarkdown: e.target.value })}
                    className="w-full p-4 bg-slate-950 text-slate-300 border-none outline-none font-mono text-sm resize-none focus:ring-0 transition-all placeholder-slate-700 leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md shadow-purple-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {editId ? "Execute Update" : "Push to Database"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}