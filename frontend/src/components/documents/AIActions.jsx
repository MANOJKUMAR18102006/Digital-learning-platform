import React, { useState } from 'react';
import { Sparkles, FileText, Lightbulb, ChevronDown, ChevronUp, BookOpen, Network, Wand2, ArrowRight } from 'lucide-react';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Mermaid from '../common/Mermaid';

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
            // Clean markdown code blocks if the LLM included them
            const cleanMindmap = response.data.replace(/```mermaid/g, '').replace(/```/g, '').trim();
            setMindmap(cleanMindmap);
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
        <div className="p-2 sm:p-4 space-y-6">
            {/* Quick Summary Section */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
                            <FileText className="h-6 w-6" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Executive Summary</p>
                            <p className="text-xs font-medium text-slate-400">High-level overview of the document</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {summary && (
                            <button onClick={() => setSummaryOpen(!summaryOpen)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                                {summaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        )}
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingSummary}
                            className="group flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-60"
                        >
                            {loadingSummary ? (
                                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Wand2 className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
                            )}
                            {loadingSummary ? 'Synthesizing...' : summary ? 'Refresh' : 'Generate'}
                        </button>
                    </div>
                </div>
                {summary && summaryOpen && (
                    <div className="px-6 pb-6 border-t border-slate-50 pt-5 text-sm text-slate-700 leading-relaxed bg-slate-50/20">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <MarkdownRenderer content={summary} />
                        </div>
                    </div>
                )}
            </div>

            {/* AI Conceptualization Section */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="px-6 py-5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 shadow-inner">
                            <Lightbulb className="h-6 w-6" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Conceptual Assistant</p>
                            <p className="text-xs font-medium text-slate-400">Get deep intuition on any topic</p>
                        </div>
                        {explanation && (
                            <button onClick={() => setExplanationOpen(!explanationOpen)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                                {explanationOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleExplainConcept} className="flex gap-2">
                        <div className="relative flex-1 group">
                           <input
                                type="text"
                                value={concept}
                                onChange={(e) => setConcept(e.target.value)}
                                placeholder="What concept should I explain?"
                                className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/5 transition-all group-hover:bg-white"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loadingExplanation || !concept.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-purple-500/10 active:scale-95 disabled:opacity-60"
                        >
                            {loadingExplanation ? (
                                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                            )}
                            {loadingExplanation ? 'Explaining...' : 'Explain'}
                        </button>
                    </form>
                </div>
                {explanation && explanationOpen && (
                    <div className="px-6 pb-6 border-t border-slate-50 pt-5 bg-slate-50/20">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                            <div className="flex items-center gap-1.5 mb-4 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50/50 w-fit px-2 py-0.5 rounded">
                               Topic: {concept}
                            </div>
                            <div className="prose prose-purple prose-sm max-w-none">
                                <MarkdownRenderer content={explanation} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Structural Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Study Notes Card */}
                <div className="bg-white border border-slate-200/80 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col h-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 text-blue-600">
                                        <BookOpen className="h-5 w-5" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 tracking-tight">Structured Notes</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic Extraction</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerateNotes}
                                    disabled={loadingNotes}
                                    className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-90 disabled:opacity-60"
                                    title="Generate Notes"
                                >
                                    {loadingNotes ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                                    )}
                                </button>
                            </div>
                            
                            <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
                                Automatically extract hierarchy and bullet points for structured revision.
                            </p>

                            {notes && (
                                <button 
                                    onClick={() => setNotesOpen(!notesOpen)}
                                    className="w-full py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                                >
                                    {notesOpen ? 'Hide Content' : 'View Full Notes'}
                                    {notesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            )}
                        </div>

                        {notes && notesOpen && (
                            <div className="flex-1 bg-slate-50 p-6 border-t border-slate-100 overflow-y-auto max-h-[300px] custom-scrollbar">
                                <div className="prose prose-blue prose-sm max-w-none">
                                    <MarkdownRenderer content={notes} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mind Map Card */}
                <div className="bg-white border border-slate-200/80 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col h-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-orange-50 text-orange-600">
                                        <Network className="h-5 w-5" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 tracking-tight">Visual Mind Map</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semantic Tree</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerateMindmap}
                                    disabled={loadingMindmap}
                                    className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-90 disabled:opacity-60"
                                    title="Generate Mindmap"
                                >
                                    {loadingMindmap ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Network className="h-4 w-4" strokeWidth={2.5} />
                                    )}
                                </button>
                            </div>
                            
                            <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
                                Transform text into interactive visual hierarchies for spatial learners.
                            </p>

                            {mindmap && (
                                <button 
                                    onClick={() => setMindmapOpen(!mindmapOpen)}
                                    className="w-full py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
                                >
                                    {mindmapOpen ? 'Hide Map' : 'View Full Map'}
                                    {mindmapOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            )}
                        </div>

                        {mindmap && mindmapOpen && (
                            <div className="flex-1 bg-slate-900 p-4 border-t border-slate-800 overflow-hidden">
                                <div className="h-full rounded-2xl bg-slate-800/50 p-2 overflow-hidden flex items-center justify-center relative shadow-inner">
                                    <Mermaid chart={mindmap} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIActions;