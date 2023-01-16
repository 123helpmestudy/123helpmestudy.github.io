
const subject1 = document.getElementById('subject-options-1');
const subject2 = document.getElementById('subject-options-2');
const subject3 = document.getElementById('subject-options-3');

export const setSubjects = () => {
  // Append the subject to each subject selector
  subjectList.forEach(subject => {
    const option = document.createElement('option');
    option.innerText = subject;
    subject1.appendChild(option);
  });
  subjectList.forEach(subject => {
    const option = document.createElement('option');
    option.innerText = subject;
    subject2.appendChild(option);
  });
  subjectList.forEach(subject => {
    const option = document.createElement('option');
    option.innerText = subject;
    subject3.appendChild(option);
  });
};

const subjectList = [
  'Accounting',
  'Art and Design',
  'Bengali',
  'Biology',
  'Business',
  'Chemistry',
  'Chinese (Mandarin)',
  'Citizenship Studies',
  'Computer programming in C',
  'Computer programming in Python',
  'Computer Science and IT',
  'Dance',
  'Design and Technology',
  'Drama',
  'Economics',
  'Engineering',
  'English as a Foreign Language',
  'English Language',
  'English Literature',
  'Entry Level Certificates (ELC)',
  'EPQ',
  'Entertainment Technology',
  'Food',
  'French',
  'Geography',
  'German',
  'Hebrew (Biblical)',
  'Hebrew (Modern)',
  'History',
  'History of Art',
  'ICT',
  'Italian',
  'Languages',
  'Law',
  'Mathematics',
  'Media Studies',
  'Music',
  'Panjabi',
  'Performing Arts',
  'Philosophy',
  'Physical Education',
  'Physics',
  'Polish',
  'Politics',
  'Programmes',
  'Projects',
  'Psychology',
  'Personal and Social Education',
  'Religious Studies',
  'Science',
  'Sociology',
  'Spanish',
  'Statistics',
  'Tech-levels',
  'Technical Awards',
  'Unit Award Scheme',
  'Urdu',
  'None',
];
