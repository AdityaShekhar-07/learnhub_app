// Local storage utilities for courses
export const getCourses = async () => {
  try {
    const response = await fetch('/courses.json');
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading courses:', error);
    return [];
  }
};

export const saveCourses = async (courses) => {
  try {
    // In a real app, this would save to a backend
    // For now, we'll use localStorage as a fallback
    localStorage.setItem('courses', JSON.stringify(courses));
    return true;
  } catch (error) {
    console.error('Error saving courses:', error);
    return false;
  }
};

export const addCourse = async (courseData) => {
  try {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const newCourse = {
      id: Date.now().toString(),
      ...courseData,
      createdAt: new Date().toISOString()
    };
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));
    return newCourse;
  } catch (error) {
    console.error('Error adding course:', error);
    return null;
  }
};

export const getCoursesFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('courses') || '[]');
  } catch (error) {
    console.error('Error getting courses from storage:', error);
    return [];
  }
};