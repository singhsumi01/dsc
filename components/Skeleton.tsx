import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-indigo-50/50 rounded-2xl border border-indigo-50/30 ${className}`} />
  );
};

export default Skeleton;
