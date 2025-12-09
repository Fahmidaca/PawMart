import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  FileText, 
  Pill, 
  Stethoscope, 
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

const HealthRecordCard = ({ record, onEdit, onDelete }) => {
  const getRecordIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-green-500" />;
      case 'checkup':
        return <Stethoscope className="h-5 w-5 text-purple-500" />;
      case 'illness':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRecordTypeColor = (type) => {
    switch (type) {
      case 'vaccination':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'medication':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'checkup':
        return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800';
      case 'illness':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed' || status === 'done') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'pending' || status === 'scheduled') {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`border rounded-lg p-4 transition-all hover:shadow-md ${getRecordTypeColor(record.type)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
            {getRecordIcon(record.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {record.title}
              </h4>
              {getStatusIcon(record.status)}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {record.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(record.date), 'MMM dd, yyyy')}
              </div>
              
              {record.veterinarian && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {record.veterinarian}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.type === 'vaccination' ? 'bg-blue-100 text-blue-800' :
                  record.type === 'medication' ? 'bg-green-100 text-green-800' :
                  record.type === 'checkup' ? 'bg-purple-100 text-purple-800' :
                  record.type === 'illness' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                </span>
              </div>
            </div>

            {/* Medications */}
            {record.medications && record.medications.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medications:
                </p>
                <div className="flex flex-wrap gap-1">
                  {record.medications.map((med, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded text-gray-700 dark:text-gray-300"
                    >
                      {med.name} - {med.dosage}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up Date */}
            {record.followUpDate && (
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                <Clock className="h-3 w-3" />
                Follow-up: {format(new Date(record.followUpDate), 'MMM dd, yyyy')}
              </div>
            )}

            {/* Attachments */}
            {record.attachments && record.attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attachments:
                </p>
                <div className="flex flex-wrap gap-1">
                  {record.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {attachment.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex space-x-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(record)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Edit record"
              >
                <FileText className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(record.id)}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete record"
              >
                <AlertCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HealthRecordCard;