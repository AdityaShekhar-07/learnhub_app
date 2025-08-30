import './CourseCard.css';

function CourseCard({ course, onBuy }) {
  return (
    <div className="course-card">
      <div className="course-image">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <div className="placeholder-image">📚</div>
        )}
      </div>
      <div className="course-content">
        <h3>{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <p className="course-instructor">By: {course.instructorName}</p>
        <div className="course-details">
          <span className="course-duration">{course.duration || 'N/A'}</span>
          <span className="course-level">{course.level || 'Beginner'}</span>
        </div>
        <div className="course-footer">
          <span className="course-price">₹{course.price}</span>
          <button className="buy-btn" onClick={onBuy}>
            Buy Course
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;