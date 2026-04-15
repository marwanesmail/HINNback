import React from "react";
import { motion } from "framer-motion";

const StatsGrid = ({ stats, columns = 3 }) => {
  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Item variants for individual stat cards
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Determine grid classes based on column count
  const getGridClasses = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-5";
      case 6:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-6";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${getGridClasses()} gap-6`}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id || index}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`rounded-xl shadow-md overflow-hidden border-l-4 ${
            stat.borderLeft || "border-blue-500"
          }`}
        >
          <div className="p-5 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <p
                  className={`text-sm font-medium ${
                    stat.textColor || "text-gray-600"
                  }`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    stat.valueColor || "text-gray-900"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
              {stat.icon && (
                <div
                  className={`p-3 rounded-lg ${stat.iconBg || "bg-blue-100"}`}
                >
                  {stat.icon}
                </div>
              )}
            </div>

            {/* Optional trend indicator */}
            {stat.trend !== undefined && (
              <div className="mt-4 flex items-center">
                <stat.trendIcon
                  className={`text-sm ml-1 ${
                    stat.trend >= 0
                      ? stat.positiveTrendColor || "text-green-500"
                      : stat.negativeTrendColor || "text-red-500"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    stat.trend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend >= 0 ? "+" : ""}
                  {stat.trend}
                  {stat.trendUnit || "%"} {stat.trendText || "from last month"}
                </p>
              </div>
            )}

            {/* Optional subtitle */}
            {stat.subtitle && (
              <p
                className={`text-xs mt-2 ${
                  stat.subtitleColor || "text-gray-500"
                }`}
              >
                {stat.subtitle}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
