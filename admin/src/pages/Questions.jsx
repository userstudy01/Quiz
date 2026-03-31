// // import { useState, useEffect } from 'react';
// // import API from '../utils/api';

// // export default function Questions() {
// //   const [questions, setQuestions] = useState([]);

// //   // View State: 'bank' (List of questions) ya 'form' (Add/Edit screen)
// //   const [activeView, setActiveView] = useState('bank');

// //   // Form Mode: 'new_module', 'add_to_module', 'edit_question'
// //   const [formMode, setFormMode] = useState('new_module');

// //   const [formData, setFormData] = useState({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
// //   const [editId, setEditId] = useState(null);
// //   const [expandedTopics, setExpandedTopics] = useState({});

// //   const fetchQuestions = async () => {
// //     try {
// //       const { data } = await API.get('/questions');
// //       setQuestions(data);
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   useEffect(() => { fetchQuestions(); }, []);

// //   // ================= FORM ACTIONS =================

// //   const openNewModuleForm = () => {
// //     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
// //     setFormMode('new_module');
// //     setEditId(null);
// //     setActiveView('form');
// //   };

// //   const openAddToModuleForm = (moduleName) => {
// //     setFormData({ title: moduleName, section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
// //     setFormMode('add_to_module');
// //     setEditId(null);
// //     setActiveView('form');
// //   };

// //   const handleEdit = (q) => {
// //     setFormData({
// //       title: q.title,
// //       section: q.section || 'Theory',
// //       tags: q.tags.join(', '), 
// //       questionText: q.questionText,
// //       solutionMarkdown: q.solutionMarkdown
// //     });
// //     setFormMode('edit_question');
// //     setEditId(q._id);
// //     setActiveView('form');
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const cancelForm = () => {
// //     setActiveView('bank');
// //     setEditId(null);
// //     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };

// //       if (editId) {
// //         await API.put(`/questions/${editId}`, payload);
// //       } else {
// //         await API.post('/questions', payload);
// //         // Ensure that module is expanded so admin can see the newly added question
// //         setExpandedTopics(prev => ({ ...prev, [formData.title]: true }));
// //       }

// //       fetchQuestions();
// //       setActiveView('bank'); // Save hote hi wapas bank main aa jao
// //       window.scrollTo({ top: 0, behavior: 'smooth' });
// //     } catch (error) {
// //       alert('Error saving question');
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if(window.confirm('Are you sure you want to permanently delete this question?')) {
// //       await API.delete(`/questions/${id}`);
// //       fetchQuestions();
// //     }
// //   };

// //   const toggleTopic = (topicName) => {
// //     setExpandedTopics(prev => ({ ...prev, [topicName]: !prev[topicName] }));
// //   };

// //   const groupedQuestions = questions.reduce((acc, q) => {
// //     const topic = q.title || 'Uncategorized';
// //     if (!acc[topic]) acc[topic] = [];
// //     acc[topic].push(q);
// //     return acc;
// //   }, {});

// //   return (
// //     <div className="max-w-5xl mx-auto pb-20">

// //       {/* ================= VIEW 1: QUESTION BANK (MAIN SCREEN) ================= */}
// //       {activeView === 'bank' && (
// //         <div className="animate-fade-in">

// //           {/* 🔥 Master Header */}
// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-zinc-800 gap-4">
// //             <h2 className="text-2xl font-black text-white flex items-center gap-4">
// //               📚 Question Bank
// //               <span className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-sm px-4 py-1.5 rounded-lg font-mono">
// //                 {questions.length} Total Elements
// //               </span>
// //             </h2>
// //             <button 
// //               onClick={openNewModuleForm} 
// //               className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
// //             >
// //               <span className="text-xl">🚀</span> Deploy New Module
// //             </button>
// //           </div>

// //           {/* Module List */}
// //           <div className="space-y-6">
// //             {Object.keys(groupedQuestions).length === 0 ? (
// //               <div className="text-center p-16 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-mono text-sm bg-[#18181b]">
// //                 System is empty. Click 'Deploy New Module' to initialize database.
// //               </div>
// //             ) : (
// //               Object.entries(groupedQuestions).map(([topicName, topicQuestions]) => {
// //                 const isExpanded = expandedTopics[topicName];

// //                 return (
// //                   <div key={topicName} className="bg-[#18181b] rounded-2xl border border-zinc-800 shadow-lg overflow-hidden transition-all duration-300">

// //                     {/* 🔥 Module Header with "Add Question" Button */}
// //                     <div className="bg-[#09090b] p-5 flex justify-between items-center transition-colors group">

// //                       {/* Clickable Area for Accordion Expand/Collapse */}
// //                       <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleTopic(topicName)}>
// //                         <span className="flex items-center justify-center bg-zinc-800 text-zinc-400 font-mono text-xl w-8 h-8 rounded-lg border border-zinc-700">
// //                           {isExpanded ? '−' : '+'}
// //                         </span>
// //                         <h3 className="text-xl font-bold text-blue-400 select-none group-hover:text-blue-300 transition-colors">{topicName}</h3>
// //                       </div>

// //                       {/* Non-clickable Action Area */}
// //                       <div className="flex items-center gap-3">
// //                         <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-4 py-2.5 rounded-lg border border-zinc-800">
// //                           {topicQuestions.length} Qs
// //                         </span>
// //                         {/* 🔥 Magic Button: Add Question to THIS specific module */}
// //                         <button 
// //                           onClick={(e) => { e.stopPropagation(); openAddToModuleForm(topicName); }}
// //                           className="bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white text-xs px-4 py-2.5 rounded-lg transition-all font-bold border border-zinc-700 hover:border-emerald-500 flex items-center gap-1 shadow-sm"
// //                         >
// //                           <span className="text-sm">+</span> Add Element
// //                         </button>
// //                       </div>
// //                     </div>

// //                     {/* Expanded Questions */}
// //                     {isExpanded && (
// //                       <div className="p-6 space-y-4 border-t border-zinc-800 bg-[#18181b]">
// //                         {topicQuestions.map((q, index) => (
// //                           <div key={q._id} className="bg-[#09090b] p-5 border border-zinc-800 rounded-xl flex justify-between items-center hover:border-zinc-600 transition-colors">
// //                             <div className="flex-1 pr-6">
// //                               <div className="flex items-center gap-3 mb-3">
// //                                 <span className="text-[10px] font-black text-zinc-400 font-mono bg-zinc-800 px-3 py-1.5 rounded-md">Q{index + 1}</span>
// //                                 <span className={`text-[10px] uppercase font-black font-mono px-3 py-1.5 rounded-md border ${q.section === 'Practical' ? 'text-green-400 bg-green-950/30 border-green-900/50' : 'text-purple-400 bg-purple-950/30 border-purple-900/50'}`}>
// //                                   {q.section || 'Theory'}
// //                                 </span>
// //                                 <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">{q.tags.join(', ')}</span>
// //                               </div>
// //                               <h4 className="font-semibold text-zinc-100 text-[15px]">{q.questionText}</h4>
// //                             </div>

// //                             <div className="flex gap-2">
// //                               <button onClick={() => handleEdit(q)} className="text-yellow-500 hover:text-white font-bold text-xs px-5 py-2.5 bg-yellow-950/30 hover:bg-yellow-600 rounded-lg border border-yellow-900/50 transition-colors">
// //                                 Edit
// //                               </button>
// //                               <button onClick={() => handleDelete(q._id)} className="text-red-500 hover:text-white font-bold text-xs px-5 py-2.5 bg-red-950/30 hover:bg-red-600 rounded-lg border border-red-900/50 transition-colors">
// //                                 Delete
// //                               </button>
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* ================= VIEW 2: DYNAMIC FORM AREA ================= */}
// //       {activeView === 'form' && (
// //         <div className="bg-[#18181b] p-8 md:p-10 border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in">

// //           <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-800">
// //             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
// //               {formMode === 'new_module' && '🚀 Deploy Brand New Module'}
// //               {formMode === 'add_to_module' && <> Add Element to Module</>}
// //               {formMode === 'edit_question' && '✏️ Edit Existing Element'}
// //             </h2>
// //             <button onClick={cancelForm} className="text-zinc-400 hover:text-white font-mono text-sm px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800 transition-colors">
// //               ← Back to Bank
// //             </button>
// //           </div>

// //           <form onSubmit={handleSubmit}>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

// //               {/* 🔥 MAGIC: Round/Topic Name Input */}
// //               <div>
// //                 <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
// //                   Round / Topic Name
// //                   {formMode === 'add_to_module' && <span className="ml-2 text-emerald-500 normal-case font-mono">(Locked)</span>}
// //                 </label>
// //                 <input 
// //                   type="text" 
// //                   placeholder="e.g. Variables in JS" 
// //                   required 
// //                   value={formData.title} 
// //                   onChange={(e) => setFormData({...formData, title: e.target.value})} 
// //                   disabled={formMode === 'add_to_module'} // Agar is module main add kar rahe hain toh name change nahi kar sakte!
// //                   className={`w-full px-4 py-3.5 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none transition-all placeholder:text-zinc-600 
// //                     ${formMode === 'add_to_module' ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed opacity-80' : 'bg-[#09090b] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50'}`
// //                   } 
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2.5">Section Type</label>
// //                 <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full px-4 py-3.5 bg-[#09090b] border border-zinc-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all">
// //                   <option value="Theory">Theory Section</option>
// //                   <option value="Practical">Practical Section</option>
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2.5">Tags</label>
// //                 <input type="text" placeholder="e.g. React, Core" required value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-3.5 bg-[#09090b] border border-zinc-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-600" />
// //               </div>
// //             </div>

// //             <div className="space-y-8 mb-8">
// //               <div>
// //                 <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2.5">Question Details</label>
// //                 <textarea placeholder="Write the full question here..." required rows="3" value={formData.questionText} onChange={(e) => setFormData({...formData, questionText: e.target.value})} className="w-full px-4 py-4 bg-[#09090b] border border-zinc-800 rounded-xl text-sm text-white font-mono resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-600"></textarea>
// //               </div>

// //               <div>
// //                 <label className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
// //                   <span>Expected Solution</span>
// //                   <span className="text-zinc-600 normal-case font-medium">Use ```markdown``` for code blocks</span>
// //                 </label>
// //                 <textarea placeholder="Expected keywords or logic..." required rows="5" value={formData.solutionMarkdown} onChange={(e) => setFormData({...formData, solutionMarkdown: e.target.value})} className="w-full px-4 py-4 bg-[#09090b] border border-zinc-800 rounded-xl text-sm text-white font-mono resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-600"></textarea>
// //               </div>
// //             </div>

// //             <div className="flex gap-4 pt-8 border-t border-zinc-800/80">
// //               <button type="button" onClick={cancelForm} className="w-1/3 py-4 bg-[#09090b] hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl border border-zinc-700 transition-colors">
// //                 Cancel
// //               </button>
// //               <button type="submit" className={`flex-1 py-4 font-bold text-lg rounded-xl transition-all shadow-lg active:scale-[0.98] ${editId ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`}>
// //                 {editId ? 'Save Edits' : 'Save & Push to Database'}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       )}

// //     </div>
// //   );
// // }

// // import { useState, useEffect } from 'react';
// // import API from '../utils/api';

// // export default function Questions() {
// //   const [questions, setQuestions] = useState([]);

// //   // View State: 'bank' (List of questions) ya 'form' (Add/Edit screen)
// //   const [activeView, setActiveView] = useState('bank');

// //   // Form Mode: 'new_module', 'add_to_module', 'edit_question'
// //   const [formMode, setFormMode] = useState('new_module');

// //   const [formData, setFormData] = useState({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
// //   const [editId, setEditId] = useState(null);
// //   const [expandedTopics, setExpandedTopics] = useState({});

// //   // 🔥 NAYA: Theme State for Admin Panel
// //   const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'dark');

// //   // 🔥 NAYA: Theme Apply Effect
// //   useEffect(() => {
// //     localStorage.setItem('admin_theme', theme);
// //     const root = document.documentElement;
// //     if (theme === 'dark') {
// //       root.classList.add('dark');
// //       root.style.colorScheme = 'dark';
// //     } else {
// //       root.classList.remove('dark');
// //       root.style.colorScheme = 'light';
// //     }
// //   }, [theme]);

// //   const fetchQuestions = async () => {
// //     try {
// //       const { data } = await API.get('/questions');
// //       setQuestions(data);
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   useEffect(() => { fetchQuestions(); }, []);

// //   // ================= FORM ACTIONS =================

// //   const openNewModuleForm = () => {
// //     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
// //     setFormMode('new_module');
// //     setEditId(null);
// //     setActiveView('form');
// //   };

// //   const openAddToModuleForm = (moduleName) => {
// //     setFormData({ title: moduleName, section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
// //     setFormMode('add_to_module');
// //     setEditId(null);
// //     setActiveView('form');
// //   };

// //   const handleEdit = (q) => {
// //     setFormData({
// //       title: q.title,
// //       section: q.section || 'Theory',
// //       tags: q.tags.join(', '), 
// //       questionText: q.questionText,
// //       solutionMarkdown: q.solutionMarkdown
// //     });
// //     setFormMode('edit_question');
// //     setEditId(q._id);
// //     setActiveView('form');
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const cancelForm = () => {
// //     setActiveView('bank');
// //     setEditId(null);
// //     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };

// //       if (editId) {
// //         await API.put(`/questions/${editId}`, payload);
// //       } else {
// //         await API.post('/questions', payload);
// //         setExpandedTopics(prev => ({ ...prev, [formData.title]: true }));
// //       }

// //       fetchQuestions();
// //       setActiveView('bank'); 
// //       window.scrollTo({ top: 0, behavior: 'smooth' });
// //     } catch (error) {
// //       alert('Error saving question');
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if(window.confirm('Are you sure you want to permanently delete this question?')) {
// //       await API.delete(`/questions/${id}`);
// //       fetchQuestions();
// //     }
// //   };

// //   const toggleTopic = (topicName) => {
// //     setExpandedTopics(prev => ({ ...prev, [topicName]: !prev[topicName] }));
// //   };

// //   const groupedQuestions = questions.reduce((acc, q) => {
// //     const topic = q.title || 'Uncategorized';
// //     if (!acc[topic]) acc[topic] = [];
// //     acc[topic].push(q);
// //     return acc;
// //   }, {});

// //   return (
// //     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20">

// //       {/* 🔥 GLOBAL ADMIN HEADER */}
// //       <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
// //         <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
// //           <div className="flex items-center gap-3">
// //             <span className="text-xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">Admin<span className="text-slate-900 dark:text-white">OS</span></span>
// //             <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">v2.0</span>
// //           </div>
// //           <button 
// //             onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
// //             className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-inner"
// //           >
// //             {theme === 'light' ? '🌙' : '☀️'}
// //           </button>
// //         </div>
// //       </header>

// //       <div className="max-w-5xl mx-auto px-6 pt-10">

// //         {/* ================= VIEW 1: QUESTION BANK (MAIN SCREEN) ================= */}
// //         {activeView === 'bank' && (
// //           <div className="animate-fade-in">

// //             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
// //               <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
// //                 📚 Question Bank
// //                 <span className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-sm px-4 py-1.5 rounded-lg font-mono shadow-sm">
// //                   {questions.length} Elements
// //                 </span>
// //               </h2>
// //               <button 
// //                 onClick={openNewModuleForm} 
// //                 className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 active:scale-95"
// //               >
// //                 <span className="text-xl">🚀</span> Deploy New Module
// //               </button>
// //             </div>

// //             <div className="space-y-6">
// //               {Object.keys(groupedQuestions).length === 0 ? (
// //                 <div className="text-center p-16 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500 font-mono text-sm bg-white dark:bg-slate-900 shadow-sm">
// //                   System is empty. Click 'Deploy New Module' to initialize database.
// //                 </div>
// //               ) : (
// //                 Object.entries(groupedQuestions).map(([topicName, topicQuestions]) => {
// //                   const isExpanded = expandedTopics[topicName];

// //                   return (
// //                     <div key={topicName} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300">

// //                       <div className="bg-slate-50 dark:bg-slate-800/40 p-5 flex justify-between items-center transition-colors group border-b border-transparent dark:border-transparent">

// //                         <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleTopic(topicName)}>
// //                           <span className="flex items-center justify-center bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xl w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
// //                             {isExpanded ? '−' : '+'}
// //                           </span>
// //                           <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 select-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{topicName}</h3>
// //                         </div>

// //                         <div className="flex items-center gap-3">
// //                           <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
// //                             {topicQuestions.length} Qs
// //                           </span>
// //                           <button 
// //                             onClick={(e) => { e.stopPropagation(); openAddToModuleForm(topicName); }}
// //                             className="bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-4 py-2.5 rounded-lg transition-all font-bold border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 flex items-center gap-1 shadow-sm"
// //                           >
// //                             <span className="text-sm">+</span> Add Element
// //                           </button>
// //                         </div>
// //                       </div>

// //                       {isExpanded && (
// //                         <div className="p-6 space-y-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
// //                           {topicQuestions.map((q, index) => (
// //                             <div key={q._id} className="bg-slate-50 dark:bg-slate-950 p-5 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-colors gap-4">
// //                               <div className="flex-1">
// //                                 <div className="flex items-center gap-3 mb-3">
// //                                   <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">Q{index + 1}</span>
// //                                   <span className={`text-[10px] uppercase font-black font-mono px-3 py-1.5 rounded-md border ${q.section === 'Practical' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-900/50' : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50'}`}>
// //                                     {q.section || 'Theory'}
// //                                   </span>
// //                                   <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">{q.tags.join(', ')}</span>
// //                                 </div>
// //                                 <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-[15px]">{q.questionText}</h4>
// //                               </div>

// //                               <div className="flex gap-2 w-full md:w-auto">
// //                                 <button onClick={() => handleEdit(q)} className="flex-1 md:flex-none text-amber-700 dark:text-amber-400 hover:text-white font-bold text-xs px-5 py-2.5 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-500 dark:hover:bg-amber-600 rounded-lg border border-amber-200 dark:border-amber-900/50 transition-colors shadow-sm">
// //                                   Edit
// //                                 </button>
// //                                 <button onClick={() => handleDelete(q._id)} className="flex-1 md:flex-none text-rose-700 dark:text-rose-400 hover:text-white font-bold text-xs px-5 py-2.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-500 dark:hover:bg-rose-600 rounded-lg border border-rose-200 dark:border-rose-900/50 transition-colors shadow-sm">
// //                                   Delete
// //                                 </button>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* ================= VIEW 2: DYNAMIC FORM AREA ================= */}
// //         {activeView === 'form' && (
// //           <div className="bg-white dark:bg-slate-900 p-8 md:p-10 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl animate-fade-in">

// //             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
// //               <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
// //                 {formMode === 'new_module' && '🚀 Deploy Brand New Module'}
// //                 {formMode === 'add_to_module' && <><span className="text-emerald-500">➕</span> Add Element to Module</>}
// //                 {formMode === 'edit_question' && '✏️ Edit Existing Element'}
// //               </h2>
// //               <button onClick={cancelForm} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-mono text-sm px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shadow-sm">
// //                 ← Back to Bank
// //               </button>
// //             </div>

// //             <form onSubmit={handleSubmit}>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

// //                 {/* Round/Topic Name Input */}
// //                 <div>
// //                   <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">
// //                     Round / Topic Name
// //                     {formMode === 'add_to_module' && <span className="ml-2 text-emerald-600 dark:text-emerald-400 normal-case font-mono">(Locked)</span>}
// //                   </label>
// //                   <input 
// //                     type="text" 
// //                     placeholder="e.g. Variables in JS" 
// //                     required 
// //                     value={formData.title} 
// //                     onChange={(e) => setFormData({...formData, title: e.target.value})} 
// //                     disabled={formMode === 'add_to_module'} 
// //                     className={`w-full px-4 py-3.5 border rounded-xl text-sm focus:outline-none transition-all font-medium
// //                       ${formMode === 'add_to_module' ? 'bg-slate-100 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed' : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner'}`
// //                     } 
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">Section Type</label>
// //                   <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full px-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-inner font-medium cursor-pointer">
// //                     <option value="Theory">Theory Section</option>
// //                     <option value="Practical">Practical Section</option>
// //                   </select>
// //                 </div>

// //                 <div>
// //                   <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">Tags (Comma Separated)</label>
// //                   <input type="text" placeholder="e.g. React, Core" required value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium" />
// //                 </div>
// //               </div>

// //               <div className="space-y-8 mb-8">
// //                 <div>
// //                   <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">Question Details</label>
// //                   <textarea placeholder="Write the full question here..." required rows="3" value={formData.questionText} onChange={(e) => setFormData({...formData, questionText: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white font-mono resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"></textarea>
// //                 </div>

// //                 <div>
// //                   <label className="flex justify-between items-center text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">
// //                     <span>Expected Solution / Verification Logic</span>
// //                     <span className="text-slate-400 dark:text-slate-500 normal-case font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">Use ```markdown```</span>
// //                   </label>
// //                   <textarea placeholder="Expected keywords or code logic..." required rows="5" value={formData.solutionMarkdown} onChange={(e) => setFormData({...formData, solutionMarkdown: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white font-mono resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"></textarea>
// //                 </div>
// //               </div>

// //               <div className="flex flex-col-reverse md:flex-row gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
// //                 <button type="button" onClick={cancelForm} className="w-full md:w-1/4 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl border border-slate-300 dark:border-slate-700 transition-colors shadow-sm">
// //                   Cancel
// //                 </button>
// //                 <button type="submit" className={`flex-1 py-4 font-black text-lg rounded-xl transition-all shadow-lg active:scale-[0.98] ${editId ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'}`}>
// //                   {editId ? 'Save Updates' : 'Deploy to Database'}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         )}

// //       </div>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from 'react';
// import API from '../utils/api';

// export default function Questions() {
//   const [questions, setQuestions] = useState([]);

//   // View State: 'bank' (List of questions) ya 'form' (Add/Edit screen)
//   const [activeView, setActiveView] = useState('bank');

//   // Form Mode: 'new_module', 'add_to_module', 'edit_question'
//   const [formMode, setFormMode] = useState('new_module');

//   const [formData, setFormData] = useState({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//   const [editId, setEditId] = useState(null);
//   const [expandedTopics, setExpandedTopics] = useState({});

//   // 🔥 THEME STATE
//   const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'light');

//   // 🔥 THEME EFFECT
//   useEffect(() => {
//     localStorage.setItem('admin_theme', theme);
//     const root = document.documentElement;
//     if (theme === 'dark') {
//       root.classList.add('dark');
//       root.style.colorScheme = 'dark';
//     } else {
//       root.classList.remove('dark');
//       root.style.colorScheme = 'light';
//     }
//   }, [theme]);

//   const fetchQuestions = async () => {
//     try {
//       const { data } = await API.get('/questions');
//       setQuestions(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => { fetchQuestions(); }, []);

//   // ================= FORM ACTIONS =================

//   const openNewModuleForm = () => {
//     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//     setFormMode('new_module');
//     setEditId(null);
//     setActiveView('form');
//   };

//   const openAddToModuleForm = (moduleName) => {
//     setFormData({ title: moduleName, section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//     setFormMode('add_to_module');
//     setEditId(null);
//     setActiveView('form');
//   };

//   const handleEdit = (q) => {
//     setFormData({
//       title: q.title,
//       section: q.section || 'Theory',
//       tags: q.tags.join(', '), 
//       questionText: q.questionText,
//       solutionMarkdown: q.solutionMarkdown
//     });
//     setFormMode('edit_question');
//     setEditId(q._id);
//     setActiveView('form');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const cancelForm = () => {
//     setActiveView('bank');
//     setEditId(null);
//     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };

//       if (editId) {
//         await API.put(`/questions/${editId}`, payload);
//       } else {
//         await API.post('/questions', payload);
//         setExpandedTopics(prev => ({ ...prev, [formData.title]: true }));
//       }

//       fetchQuestions();
//       setActiveView('bank'); 
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (error) {
//       alert('Error saving question');
//     }
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm('Are you sure you want to permanently delete this question?')) {
//       await API.delete(`/questions/${id}`);
//       fetchQuestions();
//     }
//   };

//   const toggleTopic = (topicName) => {
//     setExpandedTopics(prev => ({ ...prev, [topicName]: !prev[topicName] }));
//   };

//   const groupedQuestions = questions.reduce((acc, q) => {
//     const topic = q.title || 'Uncategorized';
//     if (!acc[topic]) acc[topic] = [];
//     acc[topic].push(q);
//     return acc;
//   }, {});

//   return (
//     <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-300 font-sans">

//       {/* 🔥 TOP HEADER */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
//           <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your assessment modules and question bank.</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
//             className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
//           >
//             {theme === 'light' ? '🌙' : '☀️'}
//           </button>
//           <button onClick={openNewModuleForm} className="bg-emerald-800 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm flex items-center gap-2">
//             <span className="text-lg leading-none">+</span> Deploy Module
//           </button>
//         </div>
//       </div>

//       {/* ================= VIEW 1: QUESTION BANK ================= */}
//       {activeView === 'bank' && (
//         <div className="animate-fade-in">

//           {/* Dashboard Stats Cards (Like your image) */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//             <div className="bg-emerald-800 text-white p-6 rounded-3xl shadow-sm">
//               <p className="text-emerald-100 text-sm font-medium mb-2">Total Questions</p>
//               <h2 className="text-4xl font-bold">{questions.length}</h2>
//             </div>
//             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
//               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Active Modules</p>
//               <h2 className="text-4xl font-bold text-slate-800 dark:text-white">{Object.keys(groupedQuestions).length}</h2>
//             </div>
//             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
//               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Database Status</p>
//               <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mt-2">
//                 <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Online
//               </h2>
//             </div>
//           </div>

//           <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Question Bank</h3>

//           <div className="space-y-4">
//             {Object.keys(groupedQuestions).length === 0 ? (
//               <div className="text-center p-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-slate-500 bg-white dark:bg-slate-900">
//                 No modules deployed. Click 'Deploy Module' to start.
//               </div>
//             ) : (
//               Object.entries(groupedQuestions).map(([topicName, topicQuestions]) => {
//                 const isExpanded = expandedTopics[topicName];

//                 return (
//                   <div key={topicName} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">

//                     <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => toggleTopic(topicName)}>
//                       <div className="flex items-center gap-4">
//                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${isExpanded ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
//                           {isExpanded ? '−' : '+'}
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-bold text-slate-800 dark:text-white">{topicName}</h3>
//                           <p className="text-xs text-slate-500 font-medium">{topicQuestions.length} Items Inside</p>
//                         </div>
//                       </div>

//                       <button 
//                         onClick={(e) => { e.stopPropagation(); openAddToModuleForm(topicName); }}
//                         className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1"
//                       >
//                         + Add Element
//                       </button>
//                     </div>

//                     {isExpanded && (
//                       <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 space-y-3">
//                         {topicQuestions.map((q, index) => (
//                           <div key={q._id} className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
//                             <div>
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Q{index + 1}</span>
//                                 <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${q.section === 'Practical' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
//                                   {q.section || 'Theory'}
//                                 </span>
//                                 <span className="text-[10px] font-bold text-slate-400 uppercase">{q.tags.join(', ')}</span>
//                               </div>
//                               <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{q.questionText}</h4>
//                             </div>

//                             <div className="flex gap-2">
//                               <button onClick={() => handleEdit(q)} className="text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
//                                 Edit
//                               </button>
//                               <button onClick={() => handleDelete(q._id)} className="text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
//                                 Delete
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       )}

//       {/* ================= VIEW 2: DYNAMIC FORM ================= */}
//       {activeView === 'form' && (
//         <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm animate-fade-in max-w-4xl">

//           <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
//             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
//               {formMode === 'new_module' && 'Deploy New Module'}
//               {formMode === 'add_to_module' && 'Add Element to Module'}
//               {formMode === 'edit_question' && 'Edit Question'}
//             </h2>
//             <button onClick={cancelForm} className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium text-sm px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
//               Cancel & Back
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
//                   Topic Name {formMode === 'add_to_module' && <span className="text-emerald-500 normal-case">(Locked)</span>}
//                 </label>
//                 <input 
//                   type="text" 
//                   required 
//                   value={formData.title} 
//                   onChange={(e) => setFormData({...formData, title: e.target.value})} 
//                   disabled={formMode === 'add_to_module'} 
//                   className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-all
//                     ${formMode === 'add_to_module' 
//                       ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed' 
//                       : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'}`
//                   } 
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Section Type</label>
//                 <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none transition-all cursor-pointer">
//                   <option value="Theory">Theory</option>
//                   <option value="Practical">Practical</option>
//                 </select>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Tags (Comma Separated)</label>
//                 <input type="text" placeholder="e.g. JavaScript, Core" required value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none transition-all" />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Question Details</label>
//               <textarea placeholder="Write the full question here..." required rows="3" value={formData.questionText} onChange={(e) => setFormData({...formData, questionText: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none transition-all"></textarea>
//             </div>

//             <div>
//               <label className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
//                 <span>Expected Solution</span>
//                 <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-[10px]">Markdown Supported</span>
//               </label>
//               <textarea placeholder="Keywords or Logic..." required rows="5" value={formData.solutionMarkdown} onChange={(e) => setFormData({...formData, solutionMarkdown: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none transition-all"></textarea>
//             </div>

//             <div className="pt-4 flex justify-end">
//               <button type="submit" className="bg-emerald-800 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-sm font-bold transition-all shadow-sm">
//                 {editId ? 'Save Edits' : 'Save Question'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import API from '../utils/api';

// export default function Questions() {
//   const [questions, setQuestions] = useState([]);

//   // View State: 'bank' (List of questions) ya 'form' (Add/Edit screen)
//   const [activeView, setActiveView] = useState('bank');

//   // Form Mode: 'new_module', 'add_to_module', 'edit_question'
//   const [formMode, setFormMode] = useState('new_module');

//   const [formData, setFormData] = useState({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//   const [editId, setEditId] = useState(null);
//   const [expandedTopics, setExpandedTopics] = useState({});

//   useEffect(() => {
//     // Standard precise data toolbox mode only. Grey color removed ☀️
//     document.documentElement.classList.remove('dark');
//   }, []);

//   const fetchQuestions = async () => {
//     try {
//       const { data } = await API.get('/questions');
//       setQuestions(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => { fetchQuestions(); }, []);

//   // ================= FORM ACTIONS =================

//   const openNewModuleForm = () => {
//     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//     setFormMode('new_module');
//     setEditId(null);
//     setActiveView('form');
//   };

//   const openAddToModuleForm = (moduleName) => {
//     setFormData({ title: moduleName, section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//     setFormMode('add_to_module');
//     setEditId(null);
//     setActiveView('form');
//   };

//   const handleEdit = (q) => {
//     setFormData({
//       title: q.title,
//       section: q.section || 'Theory',
//       tags: q.tags.join(', '), 
//       questionText: q.questionText,
//       solutionMarkdown: q.solutionMarkdown
//     });
//     setFormMode('edit_question');
//     setEditId(q._id);
//     setActiveView('form');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const cancelForm = () => {
//     setActiveView('bank');
//     setEditId(null);
//     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };

//       if (editId) {
//         await API.put(`/questions/${editId}`, payload);
//       } else {
//         await API.post('/questions', payload);
//         // Ensure that module is expanded so admin can see the newly added question
//         setExpandedTopics(prev => ({ ...prev, [formData.title]: true }));
//       }

//       fetchQuestions();
//       setActiveView('bank'); 
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (error) {
//       alert('Error saving question');
//     }
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm('Are you sure you want to permanently delete this question?')) {
//       await API.delete(`/questions/${id}`);
//       fetchQuestions();
//     }
//   };

//   const toggleTopic = (topicName) => {
//     setExpandedTopics(prev => ({ ...prev, [topicName]: !prev[topicName] }));
//   };

//   const groupedQuestions = questions.reduce((acc, q) => {
//     const topic = q.title || 'Uncategorized';
//     if (!acc[topic]) acc[topic] = [];
//     acc[topic].push(q);
//     return acc;
//   }, {});

//   return (
//     <div className="w-full max-w-7xl mx-auto p-4 md:p-6 text-gray-900 bg-white transition-colors font-sans">

//       {/* ================= VIEW 1: QUESTION BANK (MAIN SCREEN) ================= */}
//       {activeView === 'bank' && (
//         <div className="animate-fade-in space-y-5">

//           {/* 🔥 MASTER HEADER (Compact, with terminologies and counters, no glows) */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
//             <div>
//               <h1 className="text-2xl font-black text-gray-950 flex items-center gap-3">
//                 📚 analytical data toolbox
//                 <span className="bg-gray-50 text-gray-600 border border-gray-100 text-xs px-3 py-1 rounded-md font-mono">
//                   {questions.length} Total Elements
//                 </span>
//               </h1>
//               <p className="text-xs font-medium text-gray-600 mt-1 select-none">Assessment elements analytical bank.</p>
//             </div>
//             <button 
//               onClick={openNewModuleForm} 
//               className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 text-sm"
//             >
//               <span>🚀</span> Deploy New Module
//             </button>
//           </div>

//           {/* Module List (Tightened spacing from frontend aesthetic) */}
//           <div className="space-y-4">
//             {Object.keys(groupedQuestions).length === 0 ? (
//               <div className="text-center p-16 border-2 border-dashed border-gray-200 rounded-3xl text-gray-500 font-mono text-sm bg-gray-50 p-10 mt-10">
//                 analytical reference repo empty. Execute 'Deploy New Module' command to initialize.
//               </div>
//             ) : (
//               Object.entries(groupedQuestions).map(([topicName, topicQuestions]) => {
//                 const isExpanded = expandedTopics[topicName];

//                 return (
//                   <div key={topicName} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">

//                     {/* 🔥 Compact Module Header */}
//                     <div className="bg-gray-50 p-4 flex justify-between items-center transition-colors group">

//                       <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleTopic(topicName)}>
//                         <span className="flex items-center justify-center bg-white text-gray-500 font-mono text-xl w-8 h-8 rounded-lg border border-gray-200 shadow-sm">
//                           {isExpanded ? '−' : '+'}
//                         </span>
//                         <h3 className="text-lg font-bold text-gray-950 select-none group-hover:text-emerald-700 transition-colors leading-tight">{topicName}</h3>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <span className="text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
//                           {topicQuestions.length} Elements
//                         </span>
//                         <button 
//                           onClick={(e) => { e.stopPropagation(); openAddToModuleForm(topicName); }}
//                           className="bg-white hover:bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg transition-all font-bold border border-emerald-100 hover:border-emerald-300 flex items-center gap-1 shadow-sm"
//                         >
//                           <span className="text-sm">+</span> Add Element
//                         </button>
//                       </div>
//                     </div>

//                     {/* Expanded Questions */}
//                     {isExpanded && (
//                       <div className="p-4 space-y-3 border-t border-gray-100 bg-white ">
//                         {topicQuestions.map((q, index) => (
//                           <div key={q._id} className="bg-gray-50 hover:bg-white p-4 border border-gray-100 hover:border-gray-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between transition-colors gap-3 group">
//                             <div className="flex-1 pr-4">
//                               <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
//                                 <span className="text-[10px] font-black text-gray-600 font-mono bg-white px-2 py-1.5 rounded-md border border-gray-200 shadow-sm">Q{index + 1}</span>
//                                 <span className={`text-[10px] uppercase font-bold font-mono px-2.5 py-1.5 rounded-md ${q.section === 'Practical' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-600'}`}>
//                                   {q.section || 'Theory'}
//                                 </span>
//                                 <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">{q.tags.join(', ')}</span>
//                               </div>
//                               <h4 className="font-semibold text-gray-900 text-sm leading-snug">{q.questionText}</h4>
//                             </div>

//                             <div className="flex gap-2 group-hover:opacity-100 transition-opacity opacity-0 md:opacity-100">
//                               <button onClick={() => handleEdit(q)} className="text-yellow-700 hover:text-white font-bold text-xs px-3 py-1.5 bg-yellow-50 hover:bg-yellow-500 rounded-lg border border-yellow-100 transition-colors">
//                                 Edit
//                               </button>
//                               <button onClick={() => handleDelete(q._id)} className="text-red-700 hover:text-white font-bold text-xs px-3 py-1.5 bg-red-50 hover:bg-red-500 rounded-lg border border-red-100 transition-colors">
//                                 Delete
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       )}

//       {/* ================= VIEW 2: DYNAMIC FORM AREA (Compact Toolbox feel) ================= */}
//       {activeView === 'form' && (
//         <div className="bg-white p-6 md:p-8 border border-gray-100 rounded-3xl shadow-lg animate-fade-in max-w-4xl selection:bg-teal-100">

//           <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 selection:">
//             <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-950">
//               {formMode === 'new_module' && '🚀 Deploy New Module Element'}
//               {formMode === 'add_to_module' && <><span className="text-emerald-600">➕</span> Add Element to Module</>}
//               {formMode === 'edit_question' && '✏️ Edit Reference Concept'}
//             </h2>
//             <button onClick={cancelForm} className="text-gray-600 hover:text-gray-950 font-mono text-sm px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 transition-colors shadow-sm">
//               ← Back to Bank
//             </button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 selection:bg-teal-100 selection:selection:">

//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 select-none">
//                   Round / Topic Name
//                   {formMode === 'add_to_module' && <span className="ml-2 text-emerald-600 normal-case font-mono">(Locked)</span>}
//                 </label>
//                 <input 
//                   type="text" 
//                   placeholder="e.g. Variables in JS" 
//                   required 
//                   value={formData.title} 
//                   onChange={(e) => setFormData({...formData, title: e.target.value})} 
//                   disabled={formMode === 'add_to_module'} // Agar is module main add kar rahe hain toh name change nahi kar sakte!
//                   className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 leading-relaxed focus:outline-none transition-all placeholder:text-gray-400
//                     ${formMode === 'add_to_module' ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed opacity-90' : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 shadow-inner'}`
//                   } 
//                 />
//               </div>

//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 select-none">Section Type // MODULE</label>
//                 <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg text-sm outline-none transition-all cursor-pointer shadow-inner">
//                   <option value="Theory">Theory Section</option>
//                   <option value="Practical">Practical Section</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 select-none">Tags // ANALYTICS</label>
//                 <input type="text" placeholder="e.g. React, Core" required value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg text-sm placeholder:text-gray-400 outline-none transition-all shadow-inner" />
//               </div>
//             </div>

//             <div className="space-y-6 mb-8 selection:">
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 select-none">Question details // REFERENCE</label>
//                 <textarea placeholder="Write the question here..." required rows="3" value={formData.questionText} onChange={(e) => setFormData({...formData, questionText: e.target.value})} className="w-full px-4 py-3 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-300 rounded-lg outline-none resize-none text-base text-gray-900 font-mono placeholder:text-gray-400 transition-all shadow-inner leading-relaxed"></textarea>
//               </div>

//               <div>
//                 <label className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 select-none leading-snug sticky top-48 bg-white py-1">
//                   <span>REFERENCE LOGIC // VERIFICATION concept</span>
//                   <span className="text-gray-500 normal-case font-mono bg-gray-100 px-2.5 py-0.5 rounded shadow-inner ">Use ```markdown```</span>
//                 </label>
//                 <textarea placeholder="KEYWORDS OR TECHNICAL REFERENCE CODE LOGIC..." required rows="5" value={formData.solutionMarkdown} onChange={(e) => setFormData({...formData, solutionMarkdown: e.target.value})} className="w-full px-4 py-3 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-300 rounded-lg outline-none resize-none text-base text-gray-900 font-mono placeholder:text-gray-400 transition-all shadow-inner leading-relaxed selection:"></textarea>
//               </div>
//             </div>

//             <div className="flex gap-4 pt-6 border-t border-gray-100 flex-col-reverse md:flex-row">
//               <button type="button" onClick={cancelForm} className="w-full md:w-1/3 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl border border-gray-200 transition-colors shadow-sm text-sm">
//                 SYSTEM REBOOT // Exit
//               </button>
//               <button type="submit" className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] ${editId ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
//                 {editId ? 'Save Session Edits & Update Repo' : 'Save Session // Save & Deploy'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import API from '../utils/api';

// export default function Questions() {
//   const [questions, setQuestions] = useState([]);
//   const [activeView, setActiveView] = useState('bank'); 
//   const [formMode, setFormMode] = useState('new_module');
//   const [formData, setFormData] = useState({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//   const [editId, setEditId] = useState(null);
//   const [expandedTopics, setExpandedTopics] = useState({});

//   useEffect(() => {
//     document.documentElement.classList.remove('dark');
//   }, []);

//   const fetchQuestions = async () => {
//     try {
//       const { data } = await API.get('/questions');
//       setQuestions(data);
//     } catch (error) { console.error(error); }
//   };

//   useEffect(() => { fetchQuestions(); }, []);

//   const openNewModuleForm = () => {
//     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//     setFormMode('new_module');
//     setEditId(null);
//     setActiveView('form');
//   };

//   const openAddToModuleForm = (moduleName) => {
//     setFormData({ title: moduleName, section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//     setFormMode('add_to_module');
//     setEditId(null);
//     setActiveView('form');
//   };

//   const handleEdit = (q) => {
//     setFormData({
//       title: q.title,
//       section: q.section || 'Theory',
//       tags: q.tags.join(', '), 
//       questionText: q.questionText,
//       solutionMarkdown: q.solutionMarkdown
//     });
//     setFormMode('edit_question');
//     setEditId(q._id);
//     setActiveView('form');
//   };

//   const cancelForm = () => {
//     setActiveView('bank');
//     setEditId(null);
//     setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };
//       if (editId) {
//         await API.put(`/questions/${editId}`, payload);
//       } else {
//         await API.post('/questions', payload);
//       }
//       fetchQuestions();
//       setActiveView('bank');
//     } catch (error) { alert('Error saving question'); }
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm('Are you sure you want to delete this?')) {
//         try {
//             await API.delete(`/questions/${id}`);
//             fetchQuestions();
//         } catch (err) { alert("Delete failed"); }
//     }
//   };

//   const toggleTopic = (topicName) => {
//     setExpandedTopics(prev => ({ ...prev, [topicName]: !prev[topicName] }));
//   };

//   const groupedQuestions = questions.reduce((acc, q) => {
//     const topic = q.title || 'Uncategorized';
//     if (!acc[topic]) acc[topic] = [];
//     acc[topic].push(q);
//     return acc;
//   }, {});

//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-900">
//       {activeView === 'bank' ? (
//         <div className="p-4 md:p-8 max-w-7xl mx-auto">
//           {/* Header Section */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-50 pb-6">
//             <h1 className="text-3xl font-black flex items-center gap-3">
//               Question Bank 
//               <span className="bg-emerald-50 text-emerald-600 text-xs px-3 py-1 rounded-full">{questions.length} Qs</span>
//             </h1>
//             <button onClick={openNewModuleForm} className="w-full sm:w-auto bg-emerald-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-emerald-800 transition-all">+ Deploy Module</button>
//           </div>

//           {/* Module List */}
//           <div className="space-y-4">
//             {Object.entries(groupedQuestions).map(([topic, qs]) => (
//               <div key={topic} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden transition-all hover:border-emerald-200">
//                 <div className="p-5 flex flex-wrap justify-between items-center cursor-pointer bg-slate-50/50 gap-4" onClick={() => toggleTopic(topic)}>
//                   <div className="flex items-center gap-4">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${expandedTopics[topic] ? 'bg-emerald-900 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
//                       {expandedTopics[topic] ? '−' : '+'}
//                     </div>
//                     <h3 className="text-xl font-bold text-slate-800">{topic}</h3>
//                   </div>
//                   <div className="flex items-center gap-3 ml-auto sm:ml-0">
//                     <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-100">{qs.length} Elements</span>
//                     <button onClick={(e) => { e.stopPropagation(); openAddToModuleForm(topic); }} className="bg-emerald-900 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-800 shadow-sm">+ Add Q</button>
//                   </div>
//                 </div>

//                 {expandedTopics[topic] && (
//                   <div className="p-4 md:p-6 space-y-3 bg-white border-t border-slate-50">
//                     {qs.map((q, i) => (
//                       <div key={q._id} className="p-4 bg-slate-50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-transparent hover:border-emerald-100 hover:bg-emerald-50/20 transition-all">
//                         <div className="flex-1">
//                           <div className="flex flex-wrap items-center gap-2 mb-2">
//                             <span className="text-[10px] font-black bg-white px-2 py-1 rounded shadow-sm border border-slate-100 text-slate-500">Q{i+1}</span>
//                             {/* 🔥 RESTORED BADGES */}
//                             <span className={`text-[10px] font-black px-2 py-1 rounded border shadow-sm ${q.section === 'Practical' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
//                                 {q.section === 'Practical' ? 'PRACTICAL' : 'THEORY'}
//                             </span>
//                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{q.tags.join(', ')}</span>
//                           </div>
//                           <p className="text-base font-bold text-slate-700 leading-snug">{q.questionText}</p>
//                         </div>
//                         {/* 🔥 RESTORED ACTION BUTTONS */}
//                         <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
//                           <button onClick={() => handleEdit(q)} className="text-emerald-700 font-bold text-xs uppercase tracking-wider hover:underline">Edit</button>
//                           <button onClick={() => handleDelete(q._id)} className="text-red-500 font-bold text-xs uppercase tracking-wider hover:underline">Delete</button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         /* FORM VIEW - Responsive & Compact */
//         <div className="min-h-screen p-4 flex flex-col justify-center items-center bg-slate-50/30">
//           <div className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border border-slate-100">
//             <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-5">
//                <h2 className="text-2xl font-black text-slate-900">{editId ? 'Edit Element' : 'Deploy New Element'}</h2>
//                <button onClick={cancelForm} className="text-slate-400 font-bold text-sm hover:text-red-500 transition-colors">Cancel & Back</button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[11px] font-black uppercase text-slate-400 ml-2">Round Name</label>
//                   <input type="text" placeholder="Topic Name" required disabled={formMode === 'add_to_module'} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
//                     className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-900/10 text-base font-medium" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[11px] font-black uppercase text-slate-400 ml-2">Category</label>
//                   <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} 
//                     className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-base font-medium cursor-pointer">
//                     <option value="Theory">Theory Section</option>
//                     <option value="Practical">Practical Section</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[11px] font-black uppercase text-slate-400 ml-2">Tags</label>
//                 <input type="text" placeholder="e.g. JavaScript, ES6" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} 
//                   className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-base font-medium" />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[11px] font-black uppercase text-slate-400 ml-2">Question Details</label>
//                 <textarea placeholder="Ask something..." required rows="2" value={formData.questionText} onChange={e => setFormData({...formData, questionText: e.target.value})} 
//                   className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none resize-none text-base font-medium" />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[11px] font-black uppercase text-slate-400 ml-2">Reference Answer</label>
//                 <textarea placeholder="Keywords for evaluation..." required rows="4" value={formData.solutionMarkdown} onChange={e => setFormData({...formData, solutionMarkdown: e.target.value})} 
//                   className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-mono text-base resize-none" />
//               </div>

//               <button type="submit" className="w-full py-5 mt-4 bg-emerald-900 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-900/30 active:scale-[0.98] transition-all">
//                 {editId ? 'Save Edits' : 'Push to Database'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import API from '../utils/api';

export default function Questions() {
    const [questions, setQuestions] = useState([]);
    const [activeView, setActiveView] = useState('bank');
    const [formMode, setFormMode] = useState('new_module');
    const [formData, setFormData] = useState({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
    const [editId, setEditId] = useState(null);
    const [expandedTopics, setExpandedTopics] = useState({});

    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    const fetchQuestions = async () => {
        try {
            const { data } = await API.get('/questions');
            setQuestions(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchQuestions(); }, []);

    //   const openNewModuleForm = () => {
    //   setFormData(prev => ({ ...prev, title: '', section: 'Theory', questionText: '', solutionMarkdown: '' }));
    //   setFormMode('new_module');
    //   setEditId(null);
    //   setActiveView('form');
    // };

    const openNewModuleForm = () => {
        // prev use karne se Tags reset nahi honge
        setFormData(prev => ({ ...prev, title: '', section: 'Theory', questionText: '', solutionMarkdown: '' }));
        setFormMode('new_module');
        setEditId(null);
        setActiveView('form');
    };

    const openAddToModuleForm = (moduleName) => {
        setFormData({ title: moduleName, section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
        setFormMode('add_to_module');
        setEditId(null);
        setActiveView('form');
    };

    const handleEdit = (q) => {
        setFormData({
            title: q.title,
            section: q.section || 'Theory',
            tags: q.tags.join(', '),
            questionText: q.questionText,
            solutionMarkdown: q.solutionMarkdown
        });
        setFormMode('edit_question');
        setEditId(q._id);
        setActiveView('form');
    };

    const cancelForm = () => {
        setActiveView('bank');
        setEditId(null);
        setFormData({ title: '', section: 'Theory', tags: '', questionText: '', solutionMarkdown: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };
            if (editId) {
                await API.put(`/questions/${editId}`, payload);
            } else {
                await API.post('/questions', payload);
            }
            fetchQuestions();
            setActiveView('bank');
        } catch (error) { alert('Error saving question'); }

        // Success hone ke baad (setActiveView('bank') ke baad)
        // Success ke baad Title aur Tags ko bacha kar rakho
        setFormData(prev => ({ ...prev, questionText: '', solutionMarkdown: '' }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            try {
                await API.delete(`/questions/${id}`);
                fetchQuestions();
            } catch (err) { alert("Delete failed"); }
        }
    };

    const toggleTopic = (topicName) => {
        setExpandedTopics(prev => ({ ...prev, [topicName]: !prev[topicName] }));
    };

    const groupedQuestions = questions.reduce((acc, q) => {
        const topic = q.title || 'Uncategorized';
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(q);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] flex flex-col pt-24 lg:pt-0">
            {activeView === 'bank' ? (
                <div className="p-6 md:p-8 h-full overflow-y-auto">
                    {/* Header Section */}
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 mb-8 pb-4 border-b border-[#EAEAEA]">
                        {/* Line 1: Title Only */}
                        <h1 className="text-2xl font-black text-[#1A2533]">Question Bank</h1>

                        {/* Line 2: Items and Deploy Button side-by-side */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="bg-[#E5F1F0] text-[#00A896] text-[10px] px-3 py-2 rounded-xl shadow-sm font-bold whitespace-nowrap">
                                {questions.length} Items
                            </div>
                            <button onClick={openNewModuleForm} className="flex-1 bg-[#00A896] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all">
                                <span className="text-base">+</span> Deploy Module
                            </button>
                        </div>

                        {/* Line 3: Quick Add Question (Only for Mobile) */}
                        <button
                            onClick={openNewModuleForm}
                            className="sm:hidden w-full border-2 border-dashed border-[#00A896] text-[#00A896] py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-[#00A896]/5 transition-all"
                        >
                            + Add New Question
                        </button>
                    </div>

                    {/* Module List */}
                    <div className="space-y-4 max-w-6xl">
                        {Object.entries(groupedQuestions).map(([topic, qs]) => (
                            <div key={topic} className="bg-white border border-[#EAEAEA] rounded-[2rem] shadow-soft overflow-hidden transition-all hover:border-[#00A896]/40 hover:shadow-md">

                                {/* Topic Header */}
                                {/* Topic Header */}
                                <div className="p-4 flex justify-between items-center cursor-pointer bg-[#F9F9F9]" onClick={() => toggleTopic(topic)}>
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Smaller Fixed Circle for Mobile */}
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm transition-all duration-300 ${expandedTopics[topic] ? 'bg-[#00A896] text-white rotate-180' : 'bg-white text-[#1A2533] border border-[#EAEAEA]'}`}>
                                            {expandedTopics[topic] ? '−' : '+'}
                                        </div>
                                        <h3 className="text-sm font-black text-[#1A2533] truncate leading-tight">{topic}</h3>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="hidden sm:block text-[10px] font-bold text-[#888888]">{qs.length} Elements</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openAddToModuleForm(topic); }}
                                            className="hidden sm:block bg-[#1A2533] text-white px-4 py-1.5 rounded-lg text-[10px] font-bold shadow-sm"
                                        >
                                            + Add Q
                                        </button>
                                    </div>
                                </div>

                                {/* Questions List (Expanded View) */}
                                <div className={`transition-all duration-500 ease-in-out ${expandedTopics[topic] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <div className="p-5 space-y-3 bg-white border-t border-[#EAEAEA]">
                                        {qs.map((q, i) => (
                                            <div key={q._id} className="p-5 bg-[#F9F9F9] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center border border-transparent hover:border-[#EAEAEA] hover:bg-white hover:shadow-sm transition-all group gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-black text-[#888888] bg-white border border-[#EAEAEA] px-2 py-0.5 rounded shadow-sm">Q{i + 1}</span>
                                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm ${q.section === 'Practical' ? 'bg-[#EBF5FF] text-[#0A84FF]' : 'bg-[#E5F1F0] text-[#00A896]'}`}>
                                                            {q.section}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">{q.tags.join(', ')}</span>
                                                    </div>
                                                    <p className="text-[15px] font-bold text-[#1A2533] leading-snug">{q.questionText}</p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 shrink-0 self-end mt-2 md:mt-0">
                                                    <button onClick={() => handleEdit(q)} className="w-8 h-8 rounded-lg bg-white text-[#00A896] flex items-center justify-center shadow-sm border border-[#EAEAEA] active:bg-[#00A896] active:text-white">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(q._id)} className="w-8 h-8 rounded-lg bg-white text-[#FF3B30] flex items-center justify-center shadow-sm border border-[#EAEAEA] active:bg-[#FF3B30] active:text-white">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Add button for Mobile inside expanded view */}
                                        <button onClick={(e) => { e.stopPropagation(); openAddToModuleForm(topic); }} className="w-full sm:hidden bg-[#FDFDFD] border border-dashed border-[#EAEAEA] text-[#1A2533] px-5 py-3 rounded-xl text-xs font-bold hover:border-[#00A896] hover:text-[#00A896] transition-all">
                                            + Add New Question
                                        </button>
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
                                {editId ? 'Edit Element' : 'Deploy New Element'}
                            </h2>
                            <button onClick={cancelForm} className="text-[#888888] font-bold text-sm hover:text-[#1A2533] transition-colors bg-[#F9F9F9] px-4 py-2 rounded-xl border border-[#EAEAEA]">
                                ✕ Cancel
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Row 1: Name, Category, Tags */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Round Name</label>
                                    <input type="text" placeholder="Topic Name" required disabled={formMode === 'add_to_module'} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white text-sm font-bold text-[#1A2533] disabled:opacity-60 transition-all shadow-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Category</label>
                                    <select
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none text-sm font-bold text-[#1A2533] cursor-pointer focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
                                    >
                                        <option value="Theory">Theory Section</option>
                                        <option value="Practical">Practical Section</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Tags (Comma separated)</label>
                                    <input type="text" placeholder="e.g. JS, Core, Advanced" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white text-sm font-bold text-[#1A2533] transition-all shadow-sm" />
                                </div>
                            </div>

                            {/* Row 2: Question Text */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-[#1A2533] ml-1">Question Details</label>
                                <textarea placeholder="Enter the exact question text..." required rows="2" value={formData.questionText} onChange={e => setFormData({ ...formData, questionText: e.target.value })}
                                    className="w-full p-4 bg-[#F9F9F9] rounded-2xl border border-[#EAEAEA] outline-none resize-none text-base font-medium text-[#1A2533] focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm" />
                            </div>

                            {/* Row 3: Solution/Logic */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-[#00A896] ml-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#00A896] rounded-full"></span> Expected Logic / Solution (Markdown supported)
                                </label>
                                <textarea placeholder="Keywords or code logic for the AI engine to evaluate..." required rows="4" value={formData.solutionMarkdown} onChange={e => setFormData({ ...formData, solutionMarkdown: e.target.value })}
                                    className="w-full p-4 bg-[#1A2533] text-[#E5F1F0] rounded-2xl border-none outline-none font-mono text-sm resize-none focus:ring-2 focus:ring-[#00A896] transition-all shadow-inner placeholder-[#888888]" />
                            </div>

                            {/* Action Button */}
                            <button type="submit" className="w-full py-4 mt-4 bg-[#00A896] hover:bg-[#009686] text-white rounded-2xl font-black text-base shadow-lg shadow-[#00A896]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                {editId ? 'Execute Update' : 'Push to Database'}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}