import React, { useState } from 'react';
import { Sparkles, FileText, Lightbulb, ChevronDown, ChevronUp, BookOpen, Network } from 'lucide-react';
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
    const [notes, setNotes] = useState(null);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [notesOpen, setNotesOpen] = useState(false);
    const [mindmap, setMindmap] = useState(null);
    const [loadingMindmap, setLoadingMindmap] = useState(false);
    const [mindmapOpen, setMindmapOpen] = useState(false);

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

    const handleGenerateNotes = async () => {
        setLoadingNotes(true);
        try {
            const response = await aiService.generateNotes(documentId);
            setNotes(response.data);
            setNotesOpen(true);
            toast.success('Study notes generated!');
        } catch (error) {
            toast.error(error.message || 'Failed to generate study notes.');
        } finally {
            setLoadingNotes(false);
        }
    };

    const handleGenerateMindmap = async () => {
        setLoadingMindmap(true);
        try {
            const response = await aiService.generateMindmap(documentId);
            setMindmap(response.data);
            setMindmapOpen(true);
            toast.success('Mind map generated!');
        } catch (error) {
            toast.error(error.message || 'Failed to generate mind map.');
        } finally {
            setLoadingMindmap(false);
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

            {/* Study Notes Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 bg-slate-50/30 font-sans">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-50 text-blue-500">
                            <BookOpen className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 tracking-tight">AI Study Notes</p>
                            <p className="text-xs text-slate-400">Structured bullet points for easy revision</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {notes && (
                            <button onClick={() => setNotesOpen(!notesOpen)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                {notesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        )}
                        <button
                            onClick={handleGenerateNotes}
                            disabled={loadingNotes}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-60"
                        >
                            {loadingNotes ? (
                                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                            )}
                            {loadingNotes ? 'Architecting...' : notes ? 'Update Notes' : 'Create Notes'}
                        </button>
                    </div>
                </div>
                {notes && notesOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-5 bg-white">
                        <div className="prose prose-slate prose-sm max-w-none">
                            <MarkdownRenderer content={notes} />
                        </div>
                    </div>
                )}
            </div>
            {/* Mind Map Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 bg-slate-50/30 font-sans">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-orange-50 text-orange-500">
                            <Network className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 tracking-tight">AI Mind Map</p>
                            <p className="text-xs text-slate-400">Hierarchical visual tree of concepts</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {mindmap && (
                            <button onClick={() => setMindmapOpen(!mindmapOpen)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                {mindmapOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        )}
                        <button
                            onClick={handleGenerateMindmap}
                            disabled={loadingMindmap}
                            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-60"
                        >
                            {loadingMindmap ? (
                                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                            )}
                            {loadingMindmap ? 'Mapping...' : mindmap ? 'Update Map' : 'Generate Map'}
                        </button>
                    </div>
                </div>
                {mindmap && mindmapOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-5 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                        <div className="prose prose-orange prose-sm max-w-none">
                            <MarkdownRenderer content={mindmap} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIActions;