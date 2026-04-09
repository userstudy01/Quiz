export default function QuestionCard({ 
  question, 
  index, 
  answer, 
  evaluation, 
  attempts, 
  isLocked, 
  isHistoryMode, 
  onTextChange, 
  onEvaluate, 
  MAX_ATTEMPTS 
}) {
  return (
    <div id={question._id} className="relative">
      <div className={`bg-white p-6 md:p-8 rounded-3xl transition-all border-2 ${
        isLocked 
          ? (evaluation?.points === 1 ? 'border-[#30D158] bg-[#E5FAF0]' : 'border-[#FF3B30] bg-[#FFF1F0]') 
          : 'border-[#EAEAEA]'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full font-black text-sm bg-[#E5F1F0] text-[#00A896]">
            {index + 1}
          </span>
          {evaluation && (
            <span className={`text-[11px] font-bold px-4 py-1.5 rounded-full ${
              evaluation.points === 1 ? 'bg-[#30D158] text-white' : 'bg-[#FF3B30] text-white'
            }`}>
              {evaluation.status}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-[#1A2533] mb-5">{question.questionText}</h3>

        <textarea
          className={`w-full p-4 bg-[#F9F9F9] rounded-xl outline-none resize-none text-base mb-5 ${isLocked && !isHistoryMode ? 'opacity-70 cursor-not-allowed' : ''}`}
          rows="3"
          placeholder="Share your understanding here..."
          value={answer || ""}
          onChange={(e) => onTextChange(question._id, e.target.value)}
          disabled={isLocked && !isHistoryMode}
        />

        {(!isLocked || isHistoryMode) && (
          <button
            onClick={() => onEvaluate(question._id, question.solutionMarkdown, answer)}
            className="w-full py-3.5 rounded-xl text-sm font-black bg-[#00A896] text-white shadow-md active:scale-95 transition-all"
          >
            {isHistoryMode ? 'Re-verify' : 'Check Understanding'}
          </button>
        )}

        {isLocked && (
          <div className="mt-4 pt-4 border-t-2 border-[#EAEAEA]">
            <h4 className="text-xs text-[#888888] uppercase font-black mb-2">Core Concept</h4>
            <div className="text-sm text-[#00A896] bg-[#E5F1F0] p-4 rounded-xl font-mono whitespace-pre-wrap">
              {question.solutionMarkdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}