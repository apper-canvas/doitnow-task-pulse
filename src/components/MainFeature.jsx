import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

function MainFeature() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState('')
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('doitnow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('doitnow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTasks(prev => [task, ...prev])
    setNewTask('')
    toast.success('Task added successfully!')
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            updatedAt: new Date().toISOString()
          }
        : task
    ))
  }

const updateTask = (id, newTitle) => {
    if (!newTitle.trim()) {
      toast.error('Task title cannot be empty!')
      return
    }

    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            title: newTitle.trim(),
            updatedAt: new Date().toISOString()
          }
        : task
    ))
    setEditingTaskId(null)
    setEditingTaskTitle('')
    toast.success('Task updated successfully!')
  }

  const handleEditTask = (task) => {
    setEditingTaskId(task.id)
    setEditingTaskTitle(task.title)
  }

  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditingTaskTitle('')
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
    toast.success('Task deleted successfully!')
  }
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-card">
              <ApperIcon name="CheckSquare" className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              DoItNow
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400 text-lg sm:text-xl max-w-md mx-auto text-balance">
            Simple task management for productive minds
          </p>
        </motion.div>

        {/* Task Input Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={addTask}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done today?"
              className="task-input flex-1 text-base sm:text-lg"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="add-button disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base sm:text-lg shrink-0"
            >
              <span className="flex items-center justify-center gap-2">
                <ApperIcon name="Plus" className="h-5 w-5" />
                Add Task
              </span>
            </button>
          </div>
        </motion.form>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center sm:justify-start"
        >
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 capitalize text-sm sm:text-base ${
                filter === filterType
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600 hover:border-primary/50'
              }`}
            >
              {filterType} ({taskCounts[filterType]})
            </button>
          ))}
        </motion.div>

        {/* Task List */}
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="p-4 sm:p-6 bg-white dark:bg-surface-800 rounded-2xl shadow-soft border border-surface-200 dark:border-surface-700 max-w-md mx-auto">
                <ApperIcon 
                  name={filter === 'completed' ? 'Trophy' : 'Coffee'} 
                  className="h-12 w-12 sm:h-16 sm:w-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" 
                />
                <p className="text-surface-500 dark:text-surface-400 text-lg sm:text-xl font-medium">
                  {filter === 'completed' ? 'No completed tasks yet' : 
                   filter === 'active' ? 'No active tasks' : 
                   'No tasks yet'}
                </p>
                <p className="text-surface-400 dark:text-surface-500 text-sm sm:text-base mt-2">
                  {filter === 'all' ? 'Add your first task above to get started!' : 
                   filter === 'active' ? 'All caught up! Time for a break.' :
                   'Complete some tasks to see them here.'}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                  className="task-item"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="task-checkbox mt-1 shrink-0"
                    />
                    
<div className="flex-1 min-w-0">
                      {editingTaskId === task.id ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingTaskTitle}
                              onChange={(e) => setEditingTaskTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateTask(task.id, editingTaskTitle)
                                } else if (e.key === 'Escape') {
                                  cancelEdit()
                                }
                              }}
                              className="flex-1 px-3 py-2 text-base sm:text-lg font-medium bg-white dark:bg-surface-700 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                              autoFocus
                              maxLength={200}
                            />
                            <button
                              onClick={() => updateTask(task.id, editingTaskTitle)}
                              className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 shrink-0"
                              title="Save changes"
                            >
                              <ApperIcon name="Check" className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-2 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-300 dark:hover:bg-surface-500 transition-colors duration-200 shrink-0"
                              title="Cancel editing"
                            >
                              <ApperIcon name="X" className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span
                          onClick={() => handleEditTask(task)}
                          className={`text-base sm:text-lg font-medium leading-relaxed break-words cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700 px-2 py-1 rounded transition-colors duration-200 ${
                            task.completed 
                              ? 'line-through text-surface-400 dark:text-surface-500' 
                              : 'text-surface-900 dark:text-surface-100'
                          }`}
                          title="Click to edit"
                        >
                          {task.title}
                        </span>
                      )}
                      <p className="text-xs sm:text-sm text-surface-400 dark:text-surface-500 mt-1">
                        Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
                        {task.updatedAt !== task.createdAt && (
                          <span> • Updated {format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
                        )}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-button shrink-0"
                      title="Delete task"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Task Summary */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-surface-800 rounded-xl shadow-soft border border-surface-200 dark:border-surface-700">
              <ApperIcon name="BarChart3" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base text-surface-600 dark:text-surface-400">
                {taskCounts.completed} of {taskCounts.all} tasks completed
              </span>
              {taskCounts.completed > 0 && taskCounts.completed === taskCounts.all && (
                <ApperIcon name="PartyPopper" className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MainFeature