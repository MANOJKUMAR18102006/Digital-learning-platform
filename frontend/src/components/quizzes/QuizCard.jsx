import React from 'react'
import { Link } from 'react-router-dom'
import { Play, BarChart2, Trash2, Award } from 'lucide-react'
import moment from 'moment'

const QuizCard = ({ quiz, onDelete }) => {
    return (
        <div className="">
            <button onClick={(e) => {
                e.stopPropagation();
                onDelete(quiz);
            }}>
                <Trash2 className="strokeWidth={2}" />
            </button>
            <div className="">
                <div>Status Badge</div>
                <div className="">
                    <Award className="strokeWidth={2.5}" />
                    <span>Score: {quiz.score}</span>
                </div>
            </div>
            <div>
            <h3 className="">
                title={quiz.title}
                {quiz.title ||
                    `Quiz = ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
            </h3>
            <p className="">
                Created {moment(quiz.createdAt).format("MMM D, YYYY")}
            </p>

           {/* Quiz Info */}
            <div className="">
                <div className="">
                    <span className="">
                        {quiz.questions.length}
                        {quiz.questions.length === 1 ? "Question" : "Questions"}
                    </span>
                </div>
            </div>
        </div>
/* Action Button */
<div className="">
  {quiz?.userAnswers?.length > 0 ? (
    <Link to={`/quizzes/${quiz._id}/results`}>
      <button className="">
        <BarChart2 className="" strokeWidth={2.5} />
        View Results
      </button>
    </Link>
  ) : (
    <Link to={`/quizzes/${quiz._id}`}>
      <button className="">
        <span className="">
          <Play className="" strokeWidth={2.5} />
          Start Quiz
        </span>
      </button>
    </Link>
  )}
</div>
</div>
)
}
export default QuizCard;