import React from "react";
import { Zap } from "lucide-react";

const AuthCard = ({ children, title }) => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
        <div className="flex flex-col items-center mb-6">
          <Zap className="w-12 h-12 text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold text-gray-50">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
