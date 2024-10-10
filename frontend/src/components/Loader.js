import React from 'react';
import { Hourglass } from 'react-loader-spinner';


const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col gap-2">
      <Hourglass />
      <p className="text-[#306CCD] text-xl font-bold">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
