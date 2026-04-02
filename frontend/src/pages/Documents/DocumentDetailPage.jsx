import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';
import ChatInterface from '../../components/documents/ChatInterface';
import AIActions from 'components/ai/AIActions';

const DocumentDetailPage = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Content');

    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                const data = await documentService.getDocumentById(id);
                setDocument(data);
            } catch (error) {
                toast.error('Failed to fetch document details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDocumentDetails();
    }, [id]);

    const getPdfUrl = () => {
        if (!document?.data?.filePath) return null;
        const filePath = document.data.filePath;
        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            return filePath;
        }
        const baseUrl = 'http://localhost:8000';
        return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    };

    const renderContent = () => {
        if (!document || !document.data || !document.data.filePath) {
            return (
                <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                    PDF not available.
                </div>
            );
        }

        const pdfUrl = getPdfUrl();

        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 rounded-t-xl">
                    <span className="text-xs font-medium text-slate-500">Document Viewer</span>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        <ExternalLink size={14} />
                        Open in new tab
                    </a>
                </div>
                <div className="flex-1 rounded-b-xl overflow-hidden">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full min-h-[70vh]"
                        title="PDF Viewer"
                        frameBorder="0"
                        style={{ colorScheme: 'light' }}
                    />
                </div>
            </div>
        );
    };

    const renderChat = () => {
        return <ChatInterface />;
    };

    const renderAIActions = () => {
        return <AIActions />;
    };

    const renderFlashcardsTab = () => {
        return <FlashcardManager documentId={id} />;
    };

    const renderQuizzesTab = () => {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                Quizzes coming soon.
            </div>
        );
    };

    const tabs = [
        { name: 'Content', label: 'Content', content: renderContent() },
        { name: 'Chat', label: 'Chat', content: renderChat() },
        { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
        { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
        { name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
    ];

    if (loading) {
        return <Spinner />;
    }

    if (!document) {
        return (
            <div className="flex items-center justify-center h-screen text-slate-500 text-sm">
                Document not found.
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-4">
                <Link to="/documents" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-3">
                    <ArrowLeft size={16} />
                    Back to Documents
                </Link>
                <PageHeader
                    title={document.data.title}
                    subtitle={document.data.createdAt ? new Date(document.data.createdAt).toLocaleDateString() : ''}
                />
                <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    );
};

export default DocumentDetailPage;