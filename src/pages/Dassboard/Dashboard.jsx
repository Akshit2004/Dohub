import React, { useState, useEffect } from "react";
import "./Dassboard.css";
import Navbar from "../../components/NavBar/Navbar";
import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [swipingTask, setSwipingTask] = useState(null);
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [swipeTranslate, setSwipeTranslate] = useState({});

  // Add function to toggle task completion status
  const toggleTaskCompletion = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    const user = auth.currentUser;
    if (!user) return;
    const taskId = updatedTasks[index].id;
    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    await updateDoc(taskRef, { completed: updatedTasks[index].completed });
  };

  // Handle swipe start
  const handleSwipeStart = (e, idx) => {
    setSwipingTask(idx);
    setSwipeStartX(e.touches ? e.touches[0].clientX : e.clientX);
  };

  // Handle swipe move
  const handleSwipeMove = (e, idx) => {
    if (swipingTask !== idx) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - swipeStartX;
    if (deltaX > 0) {
      setSwipeTranslate(prev => ({ ...prev, [idx]: deltaX }));
    }
  };

  // Handle swipe end
  const handleSwipeEnd = async (e, idx) => {
    if (swipingTask !== idx) return;
    const threshold = 120; // px to trigger delete
    if (swipeTranslate[idx] > threshold) {
      // Animate out, then delete
      setSwipeTranslate(prev => ({ ...prev, [idx]: 500 }));
      setTimeout(() => handleDeleteTask(idx), 300);
    } else {
      // Snap back
      setSwipeTranslate(prev => ({ ...prev, [idx]: 0 }));
    }
    setSwipingTask(null);
    setSwipeStartX(null);
  };

  // Delete task from Firestore and state
  const handleDeleteTask = async (idx) => {
    const user = auth.currentUser;
    if (!user) return;
    const taskId = tasks[idx].id;
    // Remove from Firestore
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await updateDoc(taskRef, { deleted: true }); // Or use deleteDoc if you want permanent delete
    } catch (e) {}
    // Remove from UI
    setTasks(tasks => tasks.filter((_, i) => i !== idx));
    setSwipeTranslate(prev => {
      const newObj = { ...prev };
      delete newObj[idx];
      return newObj;
    });
  };

  // Custom checkbox styling
  const checkboxStyle = {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #6366f1',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    outline: 'none',
    marginRight: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  };

  const checkedStyle = {
    ...checkboxStyle,
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  };

  // Checkmark style
  const checkmarkStyle = {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  useEffect(() => {
    // Set time-based greeting
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
    
    // Set current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, options));

    // Listen for auth state and fetch tasks for the user
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        const snapshot = await getDocs(tasksRef);
        const userTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(userTasks);
      } else {
        setTasks([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Add new task to Firestore
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const user = auth.currentUser;
    if (!user) return;
    const taskData = {
      title: newTaskTitle,
      notes: newTaskNotes,
      deadline: newTaskDeadline,
      completed: false
    };
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const docRef = await addDoc(tasksRef, taskData);
    setTasks([...tasks, { id: docRef.id, ...taskData }]);
    setNewTaskTitle("");
    setNewTaskNotes("");
    setNewTaskDeadline("");
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header glass">
          <div className="header-content">
            <div className="header-left">
              <span className="greeting">{greeting},</span>
              <h1 className="username">Akshit!</h1>
              <p className="date-display">{currentDate}</p>
            </div>
            <div className="dashboard-actions">
              <div className="search-container">
                <input type="text" placeholder="Search tasks..." className="search-input" />
                <button className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <button className="primary-button" onClick={() => setShowModal(true)}>
                <span className="button-icon">+</span>
                <span className="button-text">New Task</span>
              </button>
            </div>
          </div>
        </header>

        {/* Modal for adding a new task */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal glass-modal">
              <div className="modal-glow"></div>
              
              <div className="modal-header">
                <div className="modal-title-group">
                  <div className="modal-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </div>
                  <h3>Create New Task</h3>
                </div>
                <button className="close-button" onClick={() => setShowModal(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group animate-in" style={{"--delay": "0.1s"}}>
                  <label htmlFor="taskTitle">What needs to be done?</label>
                  <div className="input-container">
                    <input
                      id="taskTitle"
                      type="text"
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title"
                      className="modal-input"
                      autoFocus
                    />
                    <div className="input-highlight"></div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="taskNotes">Additional Details</label>
                  <textarea
                    id="taskNotes"
                    value={newTaskNotes}
                    onChange={e => setNewTaskNotes(e.target.value)}
                    placeholder="Add any supporting details or notes..."
                    className="modal-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="taskDeadline">Due Date</label>
                  <input
                    id="taskDeadline"
                    type="date"
                    value={newTaskDeadline}
                    onChange={e => setNewTaskDeadline(e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="secondary-button glass-button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="primary-button glass-button"
                  onClick={handleAddTask}
                >
                  <span>Add Task</span>
                  <svg className="icon-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Widgets */}
        <section className="dashboard-widgets">
          <div className="widget glass">
            <h2>Tasks</h2>
            <ul className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <p>No tasks yet. Click the "Add Task" button to get started.</p>
                </div>
              ) : (
                tasks.map((task, idx) => (
                  <li
                    key={idx}
                    className={task.completed ? "completed" : ""}
                    style={{
                      transform: swipeTranslate[idx] ? `translateX(${swipeTranslate[idx]}px)` : undefined,
                      transition: swipingTask === idx ? 'none' : 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    onTouchStart={e => handleSwipeStart(e, idx)}
                    onTouchMove={e => handleSwipeMove(e, idx)}
                    onTouchEnd={e => handleSwipeEnd(e, idx)}
                    onMouseDown={e => handleSwipeStart(e, idx)}
                    onMouseMove={e => swipingTask === idx && handleSwipeMove(e, idx)}
                    onMouseUp={e => handleSwipeEnd(e, idx)}
                    onMouseLeave={e => swipingTask === idx && handleSwipeEnd(e, idx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={task.completed ? checkedStyle : checkboxStyle}
                        onClick={() => toggleTaskCompletion(idx)}
                      >
                        {task.completed && <span style={checkmarkStyle}>✔</span>}
                      </div>
                      <div style={{fontWeight:600, color: task.completed ? '#999' : '#3730a3', textDecoration: task.completed ? 'line-through' : 'none'}}>{task.title}</div>
                    </div>
                    {task.notes && <div style={{fontSize:'0.97em', color: task.completed ? '#999' : '#555', marginTop:'2px', marginLeft: '28px', textDecoration: task.completed ? 'line-through' : 'none'}}>{task.notes}</div>}
                    {task.deadline && <div style={{fontSize:'0.93em', color: task.completed ? '#999' : '#6366f1', marginTop:'2px', marginLeft: '28px'}}>{task.completed ? 'Completed' : 'Deadline:'} {task.deadline}</div>}
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="widget glass">
            <h2>Statistics</h2>
            <div className="stats">
              <div>
                <span className="stat-number">{tasks.filter(t => t.completed).length}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div>
                <span className="stat-number">{tasks.filter(t => !t.completed).length}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div>
                <span className="stat-number">0</span>
                <span className="stat-label">Overdue</span>
              </div>
            </div>
          </div>
          <div className="widget glass">
            <h2>Profile</h2>
            <div className="profile-summary">
              <img src="https://i.pravatar.cc/80?img=3" alt="User" className="profile-avatar" />
              <div>
                <div className="profile-name">Akshit</div>
                <div className="profile-email">akshit@email.com</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
