import React from 'react';
import { motion } from 'framer-motion';
import { useBlog } from '../../context/BlogContext';
import KnowledgePlanet from '../../components/common/KnowledgePlanet';

export default function KnowledgePlanetPage() {
  const { categories } = useBlog();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-black pt-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 mb-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-[4rem] font-bold text-white tracking-[0.2em] uppercase mb-4">
            GALAXY
          </h1>
          <p className="text-gray-400 font-sans tracking-[0.3em] text-xs uppercase opacity-60">
            Interactive 3D Knowledge Map • Powered by WebGL
          </p>
        </motion.div>
      </div>

      <div className="w-full h-[700px]">
         <KnowledgePlanet categories={categories} />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500 font-sans leading-loose tracking-widest text-sm">
           拖动鼠标旋转银河 • 点击星球进入特定领域探索细节
        </p>
      </div>
    </div>
  );
}
