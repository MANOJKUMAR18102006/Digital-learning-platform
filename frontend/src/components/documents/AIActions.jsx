import React, { useState } from 'react';
import { Sparkles, FileText, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../common/MarkdownRenderer';

const AIActions = ({ documentId }) => {
    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [concept, setConcept] = useState('');
    const [explanation, setExplanation] = useState(null);
    const [loadingExplanation, setLoadingExplanation] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [explanationOpen, setExplanationOpen] = useState(false);

    const handleGenerateSummary = async () => {
        setLoadingSummary(true);
        try {
            const data = await aiService.generateSummary(documentId);
            setSummary(data?.summary || data);
            setSummaryOpen(true);
            toast.success('Summary generated!');
        } catch (error) {
            toast.error(error.message || 'Failed to generate summary.');
        } finally {
            setLoadingSummary(false);
        }
    };

    const handleExplainConcept = async (e) => {
        e.preventDefault();
        if (!concept.trim()) return;
        setLoadingExplanation(true);
        try {
            const data = await aiService.explainConcept(documentId, concept);
            setExplanation(data?.data?.explanation || data);
            setExplanationOpen(true);
            toast.success('Explanation generated!');
        } catch (error) {
            toast.error(error.message || 'Failed to explain concept.');
        } finally {
            setLoadingExplanation(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Summary Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-50 text-emerald-500">
                            <FileText className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Document Summary</p>
                            <p className="text-xs text-slate-400">Generate a concise summary of this document</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {summary && (
                            <button onClick={() => setSummaryOpen(!summaryOpen)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                {summaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        )}
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingSummary}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-xl transition-colors disabled:opacity-60"
                        >
                            {loadingSummary ? (
                                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                            )}
                            {loadingSummary ? 'Generating...' : summary ? 'Regenerate' : 'Generate'}
                        </button>
                    </div>
                </div>
                {summary && summaryOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 text-sm text-slate-700 leading-relaxed">
                        <MarkdownRenderer content={summary} />
                    </div>
                )}
            </div>

            {/* Explain Concept Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-purple-50 text-purple-500">
                            <Lightbulb className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Explain a Concept</p>
                            <p className="text-xs text-slate-400">Get a detailed explanation of any concept in this document</p>
                        </div>
                    </div>
                    <form onSubmit={handleExplainConcept} className="flex gap-2">
                        <input
                            type="text"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            placeholder="e.g. machine learning, photosynthesis..."
                            className="flex-1 h-10 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/10 transition-all bg-slate-50"
                        />
                        <button
                            type="submit"
                            disabled={loadingExplanation || !concept.trim()}
                            className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-xl transition-colors disabled:opacity-60"
                        >
                            {loadingExplanation ? (
                                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                            )}
                            {loadingExplanation ? 'Explaining...' : 'Explain'}
                        </button>
                    </form>
                </div>
                {explanation && explanationOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 text-sm text-slate-700 leading-relaxed">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{concept}</p>
                            <button onClick={() => setExplanationOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                                <ChevronUp className="h-4 w-4" />
                            </button>
                        </div>
                        <MarkdownRenderer content={explanation} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIActions;