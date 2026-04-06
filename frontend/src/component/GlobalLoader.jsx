import React, { useState, useEffect } from 'react';
import axios from 'axios';

let activeRequests = 0;
let subscribers = [];

const notify = () => {
  subscribers.forEach(sub => sub(activeRequests > 0));
};

// Intercept all Axios requests to show/hide the global loader
axios.interceptors.request.use(
  (config) => {
    activeRequests++;
    notify();
    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    notify();
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    notify();
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    notify();
    return Promise.reject(error);
  }
);

const GlobalLoader = () => {
  const [apiLoading, setApiLoading] = useState(activeRequests > 0);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show a premium loader effect for at least 1 second on initial load
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);

    const subscriber = (isLoading) => setApiLoading(isLoading);
    subscribers.push(subscriber);

    return () => {
      clearTimeout(timer);
      subscribers = subscribers.filter(s => s !== subscriber);
    };
  }, []);

  const showLoader = initialLoading || apiLoading;

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/30 dark:bg-black/40 backdrop-blur-sm flex justify-center items-center transition-all duration-300">
      <div className="relative flex flex-col items-center">
        {/* Glowing Aura Effect */}
        <div className="absolute inset-0 bg-[#F09619]/20 blur-[60px] w-40 h-40 rounded-full animate-pulse"></div>
        
        {/* Premium Concentric Spinner */}
        <div className="relative w-28 h-28 flex justify-center items-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-t-4 border-solid border-[#F09619]/80 animate-[spin_1.2s_ease-in-out_infinite]"></div>
          {/* Middle Ring */}
          <div className="absolute inset-3 rounded-full border-r-4 border-solid border-[#F09619]/60 animate-[spin_1.5s_linear_infinite_reverse]"></div>
          {/* Inner Ring */}
          <div className="absolute inset-6 rounded-full border-b-4 border-solid border-[#F09619]/40 animate-[spin_2s_ease-in-out_infinite]"></div>
          {/* Center Dot */}
          <div className="w-4 h-4 bg-[#F09619] rounded-full animate-ping opacity-80"></div>
        </div>
        
        {/* Loading Text */}
        <div className="mt-6 flex items-center space-x-1">
          <span className="text-gray-800 dark:text-white font-bold tracking-[0.2em] text-lg uppercase drop-shadow-md">
            Loading
          </span>
          <span className="flex space-x-1 mt-1 ml-1">
             <span className="w-1.5 h-1.5 bg-gray-800 dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
             <span className="w-1.5 h-1.5 bg-gray-800 dark:bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
             <span className="w-1.5 h-1.5 bg-gray-800 dark:bg-white rounded-full animate-bounce"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
