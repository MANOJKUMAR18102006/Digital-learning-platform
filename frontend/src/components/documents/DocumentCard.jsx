import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Clock } from 'lucide-react';

const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/documents/${document._id}`)}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500">
                    <FileText className="h-5 w-5" strokeWidth={2} />
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(document); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
            </div>
            <p className="text-sm font-semibold text-slate-900 truncate mb-1">{document.title}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                {document.fileSize && (
                    <span className="ml-auto">{formatFileSize(document.fileSize)}</span>
                )}
            </div>
        </div>
    );
};

export default DocumentCard;