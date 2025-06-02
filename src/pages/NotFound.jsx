import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <ApperIcon 
            name="AlertTriangle" 
            className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-accent"
          />
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-card hover:shadow-soft"
        >
          <ApperIcon name="Home" className="h-4 w-4" />
          Back to Tasks
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound