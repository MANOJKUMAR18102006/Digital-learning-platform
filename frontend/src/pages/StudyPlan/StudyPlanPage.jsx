import React, { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import documentService from '../../services/documentService';
import PageHeader from '../../components/common/PageHeader';
import { FileText, Sparkles, Calendar, Clock, BookOpen, Target, Download, Share2, Plus, Minus, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/common/Card';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import toast from 'react-hot-toast';

const StudyPlanPage = () => {
    const [loading, setLoading] = useState(false);
    const [studyPlan, setStudyPlan] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [formData, setFormData] = useState({
        documentId: '',
        hours: 4,
        weakTopics: '',
        strongTopics: '',
        examDate: '',
        performanceData: 'Average score of 75% in recent quizzes',
        nDays: 7
    });

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const docs = await documentService.getDocuments();
                setDocuments(docs || []);
            } catch (err) {
                toast.error('Failed to load documents');
            }
        };
        fetchDocs();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await aiService.generateStudyPlan(formData);
            setStudyPlan(response.data);
            toast.success('Your personalized study plan is ready!');
        } catch (error) {
            toast.error(error.message || 'Failed to generate study plan');
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => (
        <Card className="max-w-4xl mx-auto overflow-hidden border-none shadow-2xl shadow-emerald-500/10 rounded-[2.5rem] bg-white">
            <div className="bg-slate-900 px-10 py-12 text-white relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="bg-emerald-500/20 p-3 rounded-2xl backdrop-blur-md border border-emerald-500/30">
                            <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                        </div>
                        <div>
                             <h2 className="text-3xl font-black tracking-tight leading-none mb-1">AI Study Architect</h2>
                             <span className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-400">Intelligence-Driven Scheduling</span>
                        </div>
                    </div>
                    <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">Transform your learning goals into a high-performance roadmap with precision planning and algorithmic optimization.</p>
                </div>
            </div>
            
            <form onSubmit={handleGenerate} className="p-10 space-y-10 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column - Fundamental Params */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-[10px] font-black text-slate-400 border border-slate-200">1</span>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Foundation</h3>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Time Per Day */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-wider ml-1">
                                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                        Study Hours Daily
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            name="hours"
                                            value={formData.hours}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="16"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-black text-slate-900 pr-12 group-hover:bg-slate-100/50"
                                            required
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs uppercase tracking-tighter">Hrs</span>
                                    </div>
                                </div>

                                {/* Number of Days */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-wider ml-1">
                                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                        Plan Duration
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            name="nDays"
                                            value={formData.nDays}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="30"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-black text-slate-900 pr-14 group-hover:bg-slate-100/50"
                                            required
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs uppercase tracking-tighter">Days</span>
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-wider ml-1">
                                        <Target className="w-3.5 h-3.5 text-rose-500" />
                                        Target Deadline
                                    </label>
                                    <input
                                        type="date"
                                        name="examDate"
                                        value={formData.examDate}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Source & Performance */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-[10px] font-black text-slate-400 border border-slate-200">2</span>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Context</h3>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Document Selection */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-wider ml-1">
                                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                                        Reference Material
                                    </label>
                                    <div className="relative group">
                                        <select
                                            name="documentId"
                                            value={formData.documentId}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900 appearance-none cursor-pointer pr-12"
                                            required
                                        >
                                            <option value="">Select a document...</option>
                                            {documents.map(doc => (
                                                <option key={doc._id} value={doc._id}>{doc.title}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Minus className="rotate-90" size={12} />
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Context */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-wider ml-1">
                                        <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                                        Performance Insight
                                    </label>
                                    <textarea
                                        name="performanceData"
                                        value={formData.performanceData}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium text-slate-700 min-h-[120px] resize-none text-sm"
                                        placeholder="e.g. Scores 80% on MCQ but struggles with theory"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topics - Full Width */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-slate-100">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">
                            <Minus className="w-3.5 h-3.5 text-rose-500" strokeWidth={3} />
                            Critical focus areas
                        </label>
                        <textarea
                            name="weakTopics"
                            value={formData.weakTopics}
                            onChange={handleInputChange}
                            placeholder="e.g. Differential Equations, Thermodynamics"
                            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-rose-500 focus:bg-white transition-all outline-none min-h-[140px] resize-none text-slate-900 font-bold placeholder:text-slate-300 shadow-inner"
                            required
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">
                            <Plus className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                            Strength factors
                        </label>
                        <textarea
                            name="strongTopics"
                            value={formData.strongTopics}
                            onChange={handleInputChange}
                            placeholder="e.g. Statistical Analysis, Mechanics"
                            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-emerald-500 focus:bg-white transition-all outline-none min-h-[140px] resize-none text-slate-900 font-bold placeholder:text-slate-300 shadow-inner"
                            required
                        />
                    </div>
                </div>

                <div className="pt-8 footer">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full group relative flex items-center justify-center gap-4 py-6 bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all duration-500 shadow-2xl shadow-slate-900/20 hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <Spinner className="w-5 h-5 border-white" />
                                <span>Generating Masterplan...</span>
                            </div>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 group-hover:scale-125 transition-all duration-500" />
                                <span>Construct Master Study Plan</span>
                                <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform duration-500" />
                            </>
                        )}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-6 leading-none">Powered by Gemini Intelligent Learning Engine</p>
                </div>
            </form>
        </Card>
    );


    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        if (!studyPlan) return;
        
        const element = document.createElement("a");
        const file = new Blob([studyPlan], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        const fileName = formData.documentId ? 
            documents.find(d => d._id === formData.documentId)?.title || 'StudyPlan' : 
            'StudyPlan';
        element.download = `${fileName}_Plan_${new Date().toLocaleDateString()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('Study plan exported successfully!');
    };



    const renderPlan = () => (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Roadmap to Success</h2>
                    <p className="text-slate-500 font-medium mt-1">AI-generated personalized study schedule</p>
                </div>
                <div className="flex items-center gap-3 no-print">
                    <Button 
                        variant="secondary" 
                        onClick={handlePrint}
                        className="hidden sm:flex items-center gap-2 px-6 rounded-xl border-slate-200"
                    >
                        <Share2 size={18} /> Print / PDF
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick={handleExport}
                        className="hidden sm:flex items-center gap-2 px-6 rounded-xl border-slate-200"
                    >
                        <Download size={18} /> Export Text
                    </Button>
                    <Button onClick={() => setStudyPlan(null)} className="flex items-center gap-2 px-6 rounded-xl bg-slate-900 hover:bg-emerald-600">
                        <Plus size={18} /> New Plan
                    </Button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-xl shadow-slate-200/50">
                <MarkdownRenderer content={studyPlan} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="bg-white border-b border-slate-200 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <PageHeader 
                        title="Personalized Study Architect" 
                        subtitle="Harness the power of AI to create your perfect learning schedule" 
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!studyPlan ? renderForm() : renderPlan()}
            </div>
        </div>
    );
};

export default StudyPlanPage;
