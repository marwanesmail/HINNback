import React from "react";

const PlaceholderSection = ({ icon, title }) => {
  const IconComponent = icon;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
      {IconComponent && (
        <IconComponent className="text-6xl text-gray-300 mb-4" />
      )}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">هذا القسم قيد التطوير</p>
    </div>
  );
};

export default PlaceholderSection;
