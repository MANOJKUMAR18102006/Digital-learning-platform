import React, { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import documentService from '../../services/documentService';
import PageHeader from '../../components/common/PageHeader';
import { FileText, Sparkles, Calendar, Clock, BookOpen, Target, Download, Share2, Plus, Minus } from 'lucide-react';
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
        <Card className="max-w-3xl mx-auto overflow-hidden border-none shadow-2xl shadow-emerald-500/5">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    <h2 className="text-2xl font-bold tracking-tight">AI Study Architect</h2>
                </div>
                <p className="text-emerald-50/80 font-medium">Transform your learning goals into a masterpiece with precision planning.</p>
            </div>
            
            <form onSubmit={handleGenerate} className="p-8 space-y-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Time Per Day */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                            <Clock className="w-4 h-4 text-emerald-500" />
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
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900 pr-12 group-hover:border-slate-200"
                                required
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Hrs</span>
                        </div>
                    </div>

                    {/* Number of Days */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                            <Calendar className="w-4 h-4 text-emerald-500" />
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
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900 pr-12 group-hover:border-slate-200"
                                required
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Days</span>
                        </div>
                    </div>
                </div>

                {/* Document Selection */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        Base Plan on Document
                    </label>
                    <select
                        name="documentId"
                        value={formData.documentId}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900 appearance-none cursor-pointer"
                        required
                    >
                        <option value="">Select a document...</option>
                        {documents.map(doc => (
                            <option key={doc._id} value={doc._id}>{doc.title}</option>
                        ))}
                    </select>
                </div>

                {/* Date Selection */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                        <Target className="w-4 h-4 text-emerald-500" />
                        Target Exam Date
                    </label>
                    <input
                        type="date"
                        name="examDate"
                        value={formData.examDate}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                        required
                    />
                </div>

                {/* Topics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                            <Plus className="w-4 h-4 text-rose-500" />
                            Weak Topics
                        </label>
                        <textarea
                            name="weakTopics"
                            value={formData.weakTopics}
                            onChange={handleInputChange}
                            placeholder="e.g. Calculus, Organic Chemistry"
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:bg-white transition-all outline-none min-h-[120px] resize-none text-slate-900 font-medium"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                            <Plus className="w-4 h-4 text-emerald-500" />
                            Strong Topics
                        </label>
                        <textarea
                            name="strongTopics"
                            value={formData.strongTopics}
                            onChange={handleInputChange}
                            placeholder="e.g. History, Basic Algebra"
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none min-h-[120px] resize-none text-slate-900 font-medium"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full group relative flex items-center justify-center gap-3 py-5 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                        {loading ? (
                            <Spinner className="w-5 h-5 border-white" />
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span>Architect My Plan</span>
                            </>
                        )}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
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
