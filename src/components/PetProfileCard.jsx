import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Weight, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const PetProfileCard = ({ pet, isSelected, onSelect }) => {
  const getSpeciesIcon = (species) => {
    switch (species?.toLowerCase()) {
      case 'dog':
        return '🐕';
      case 'cat':
        return '🐱';
      case 'bird':
        return '🐦';
      case 'rabbit':
        return '🐰';
      default:
        return '🐾';
    }
  };

  const getAgeInYears = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMs = today - birth;
    const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(ageInYears);
  };

  const age = pet.birthDate ? getAgeInYears(pet.birthDate) : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
        isSelected
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Pet Avatar */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
          isSelected ? 'bg-orange-100 dark:bg-orange-800' : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          {pet.photo ? (
            <img 
              src={pet.photo} 
              alt={pet.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl">
              {getSpeciesIcon(pet.species)}
            </span>
          )}
        </div>

        {/* Pet Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-semibold truncate ${
              isSelected ? 'text-orange-900 dark:text-orange-100' : 'text-gray-900 dark:text-white'
            }`}>
              {pet.name}
            </h4>
            {isSelected && (
              <Heart className="h-4 w-4 text-orange-500 fill-current" />
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="capitalize">{pet.species}</span>
            {pet.breed && <span>• {pet.breed}</span>}
          </div>

          {age !== null && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <Calendar className="h-3 w-3" />
              <span>{age} year{age !== 1 ? 's' : ''} old</span>
            </div>
          )}

          {pet.weight && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <Weight className="h-3 w-3" />
              <span>{pet.weight} {pet.weightUnit || 'kg'}</span>
            </div>
          )}

          {pet.location && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{pet.location}</span>
            </div>
          )}
        </div>

        {/* Health Score Badge */}
        {pet.healthScore !== undefined && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            pet.healthScore >= 80 
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : pet.healthScore >= 60
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}>
            {pet.healthScore}
          </div>
        )}
      </div>

      {/* Adoption Date */}
      {pet.adoptionDate && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Adopted {format(new Date(pet.adoptionDate), 'MMM yyyy')}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PetProfileCard;