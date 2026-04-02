import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import MarkdownRenderer from "../../common/MarkdownRenderer";

const AIActions = () => {
    const { id } = useParams();
    const [loadingAction, setLoadingAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [concept, setConcept] = useState("");

    const handleGenerateSummary = async () => {
        try {
            const summary = await aiService.generateSummary(documentId);
            setModalTitle("Generated Summary");
            setModalContent(summary);
            setIsModalOpen(true);
        } catch (error) {
            toast.error("Failed to generate summary");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExplainConcept = async (e) => {
        e.preventDefault();
        if (!concept.trim()) {
            toast.error("Please enter a concept to explain.");
            return;
        }
        setLoadingAction("explain");
        try {
            const { explanation } = await aiService.explainConcept(
                documentId,
                concept
            );
            setModalTitle(`Explanation of "${concept}"`);
            setModalContent(explanation);
            setIsModalOpen(true);
            setConcept("");
        } catch (error) {
            toast.error("Failed to explain concept.");
        } finally {
            setLoadingAction(null);
        }
    };


    return (
        <>
            <div className="">
                {/* Header */}
                <div className="">
                    <div className="">
                        <Sparkles className="" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="">AI Assistant</h3>
                        <p className="">Powered by advanced AI</p>
                    </div>
                </div>
                {/* Generate Summary */}
                <div className="">
                    <div className="">
                        <BookOpen className="" strokeWidth={2} />
                    </div>
                    <h4 className="">Generate Summary</h4>
                    <p className="">Get a concise summary of the entire document.</p>
                    <button onClick={handleGenerateSummary} disabled={loadingAction === "summary"} className="">

                        {loadingAction === "summary" ? (
                            <span className="">
                                <div className="" />
                                Loading...
                            </span>
                        ) : (
                            "Summarize"
                        )}
                    </button>
                </div>

                {/* Explain Concept */}
                <div className="">
                    <form onSubmit={(handleExplainConcept)}>
                        <div className="">
                            <div className="">
                                <Lightbulb
                                    className=""
                                    strokeWidth={2}
                                />
                            </div>
                            <h4 className="">
                                Explain a Concept
                            </h4>
                        </div>

                        <p className="">
                            Enter a topic or concept from the document to get a detailed explanation.
                        </p>
                        <div className="">
                            <input
                                type="text"
                                value={concept}
                                onChange={e => setConcept(e.target.value)}
                                placeholder='e.g., "React Hooks"'
                                className=""
                                disabled={loadingAction === "explain"}
                            />

                            <button
                                type="submit"
                                disabled={loadingAction === "explain" || !concept.trim()}
                                className=""
                            >
                                {loadingAction === "explain" ? (
                                    <span className="">
                                        <div className="">
                                            Loading...
                                        </div>
                                    </span>
                                ) : (
                                    "Explain"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* Result Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
            >
                <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate">
                    <MarkdownRenderer content={modalContent} />
                </div>
            </Modal>

        </>
    )

};
export default AIActions;