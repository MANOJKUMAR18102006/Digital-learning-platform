import React, { useState, useEffect } from "react";
import { Plus, X, Trash2, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Upload modal state
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploading, setUploading] = useState(false);

    // Delete modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const fetchDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data);
        } catch (error) {
            toast.error("Failed to fetch documents.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setUploadTitle(file.name.replace(/\..+$/, ""));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile || !uploadTitle) {
            toast.error("Please provide a title and select a file.");
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("title", uploadTitle);
        try {
            await documentService.uploadDocument(formData);
            toast.success("Document uploaded successfully!");
            setIsUploadModalOpen(false);
            setUploadFile(null);
            setUploadTitle("");
            setLoading(true);
            fetchDocuments();
        } catch (error) {
            toast.error(error.message || "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteRequest = (doc) => {
        setSelectedDoc(doc);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedDoc) return;
        setDeleting(true);
        try {
            await documentService.deleteDocument(selectedDoc._id);
            toast.success(`${selectedDoc.title} deleted.`);
            setIsDeleteModalOpen(false);
            setSelectedDoc(null);
            setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
        } catch (error) {
            toast.error(error.message || 'Failed to delete document.');
        } finally {
            setDeleting(false);
        }
    };

    const renderContent = () => {
        if (loading) return <Spinner />;

        if (documents.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-base font-medium mb-1">No documents yet</p>
                    <p className="text-sm mb-6">Upload your first document to get started</p>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Upload Document
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {documents?.map((doc) => (
                    <DocumentCard
                        key={doc._id}
                        document={doc}
                        onDelete={handleDeleteRequest}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">My Documents</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and organize your learning materials</p>
                </div>
                {documents.length > 0 && (
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Upload Document
                    </button>
                )}
            </div>

            {renderContent()}

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-slate-900">Upload Document</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            {/* Title Input */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                    Document Title
                                </label>
                                <input
                                    type="text"
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    required
                                    className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="e.g., React Interview Prep"
                                />
                            </div>

                            {/* File Upload */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                    PDF File
                                </label>
                                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-emerald-400 transition-colors text-center">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <p className="text-sm text-slate-500">
                                        {uploadFile ? (
                                            <span className="text-emerald-600 font-medium">{uploadFile.name}</span>
                                        ) : (
                                            <span className="text-emerald-500 font-medium">Click to upload</span>
                                        )} or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">PDF files only</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                        {/* Close button */}
                        <button onClick={() => setIsDeleteModalOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                            <X className="h-5 w-5" strokeWidth={2} />
                        </button>

                        {/* Modal Header */}
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-500 mb-3">
                                <Trash2 className="h-6 w-6" strokeWidth={2} />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Confirm Deletion</h2>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete <span className="font-medium text-slate-900">"{selectedDoc?.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 h-11 border-2 border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentListPage;