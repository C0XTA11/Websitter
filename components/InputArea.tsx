
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect } from 'react';
import { ArrowUpTrayIcon, SparklesIcon, CpuChipIcon, DocumentDuplicateIcon, XMarkIcon, PaperAirplaneIcon, DevicePhoneMobileIcon, StarIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, BeakerIcon as BeakerIconSolid } from '@heroicons/react/24/solid';

import { Creation } from './CreationHistory';

interface InputAreaProps {
  onGenerate: (prompt: string, files: File[], iosMode: boolean, starMode: boolean, deepMode: boolean, referenceHtml?: string) => void;
  isGenerating: boolean;
  disabled?: boolean;
  history?: Creation[];
}

const CyclingText = () => {
    const words = [
        "worksheet + answer key",
        "chapter notes (pg 1 & 2)",
        "vocab -> story generator",
        "quiz + study guide",
        "a napkin sketch",
        "a game level design"
    ];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // fade out
            setTimeout(() => {
                setIndex(prev => (prev + 1) % words.length);
                setFade(true); // fade in
            }, 500); // Wait for fade out
        }, 3000); // Slower cycle to read longer text
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className={`inline-block whitespace-nowrap transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-2 blur-sm'} text-white font-medium pb-1 border-b-2 border-blue-500/50`}>
            {words[index]}
        </span>
    );
};

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false, history = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [promptText, setPromptText] = useState("");
  const [iosMode, setIosMode] = useState(false);
  const [starMode, setStarMode] = useState(false);
  const [deepMode, setDeepMode] = useState(false);
  const [selectedReferenceId, setSelectedReferenceId] = useState<string>("");

  // Clear staged files when generation starts
  useEffect(() => {
    if (isGenerating) {
        setStagedFiles([]);
        setPromptText("");
    }
  }, [isGenerating]);

  const handleFiles = (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).filter(file => 
        file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (newFiles.length > 0) {
        setStagedFiles(prev => [...prev, ...newFiles]);
    } else {
        alert("Please upload images or PDFs.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, isGenerating]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        setIsDragging(true);
    }
  }, [disabled, isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setStagedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateClick = () => {
    if (stagedFiles.length > 0 || promptText.trim().length > 0 || selectedReferenceId) {
        const referenceHtml = history.find(c => c.id === selectedReferenceId)?.html;
        onGenerate(promptText, stagedFiles, iosMode, starMode, deepMode, referenceHtml);
    }
  };

  const hasFiles = stagedFiles.length > 0;
  const canGenerate = hasFiles || promptText.trim().length > 0 || !!selectedReferenceId;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 perspective-1000">
      <div 
        className={`relative group transition-all duration-300 ${isDragging ? 'scale-[1.01]' : ''}`}
      >
        <label
          className={`
            relative flex flex-col items-center justify-center
            h-56 sm:h-64 md:h-[22rem]
            bg-zinc-900/30 
            backdrop-blur-sm
            rounded-xl border border-dashed
            cursor-pointer overflow-hidden
            transition-all duration-300
            ${isDragging 
              ? 'border-blue-500 bg-zinc-900/50 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' 
              : hasFiles 
                ? 'border-blue-500/30 bg-zinc-900/60' 
                : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40'
            }
            ${isGenerating ? 'pointer-events-none' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
            {/* Technical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
            </div>
            
            {/* Corner Brackets */}
            <div className={`absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 transition-colors duration-300 ${isDragging || hasFiles ? 'border-blue-500' : 'border-zinc-600'}`}></div>
            <div className={`absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 transition-colors duration-300 ${isDragging || hasFiles ? 'border-blue-500' : 'border-zinc-600'}`}></div>
            <div className={`absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 transition-colors duration-300 ${isDragging || hasFiles ? 'border-blue-500' : 'border-zinc-600'}`}></div>
            <div className={`absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 transition-colors duration-300 ${isDragging || hasFiles ? 'border-blue-500' : 'border-zinc-600'}`}></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8 p-6 md:p-8 w-full">
                
                {/* State: Files Staged */}
                {hasFiles ? (
                    <div className="w-full max-w-lg flex flex-col items-center">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-6">
                            {stagedFiles.map((file, idx) => (
                                <div key={idx} className="relative group/file bg-zinc-800 border border-zinc-700 p-3 rounded-lg flex flex-col items-center justify-center text-center animate-in zoom-in-50 duration-300">
                                    <DocumentDuplicateIcon className="w-8 h-8 text-blue-400 mb-2" />
                                    <span className="text-xs text-zinc-300 truncate w-full px-2">{file.name}</span>
                                    <button 
                                        onClick={(e) => removeFile(idx, e)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/file:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {/* Add More Placeholder */}
                            <div className="border border-dashed border-zinc-700 rounded-lg flex items-center justify-center p-3 text-zinc-500 text-xs hover:bg-zinc-800/50 hover:border-zinc-600 transition-colors">
                                + Add more
                            </div>
                        </div>
                        <h3 className="text-xl text-white font-medium animate-pulse">Ready to generate</h3>
                    </div>
                ) : (
                /* State: Empty Drop Zone */
                <>
                    <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:-translate-y-1'}`}>
                        <div className={`absolute inset-0 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl flex items-center justify-center ${isGenerating ? 'animate-pulse' : ''}`}>
                            {isGenerating ? (
                                <CpuChipIcon className="w-8 h-8 md:w-10 md:h-10 text-blue-400 animate-spin-slow" />
                            ) : (
                                <div className="relative">
                                    <ArrowUpTrayIcon className={`w-8 h-8 md:w-10 md:h-10 text-zinc-300 transition-all duration-300 ${isDragging ? '-translate-y-1 text-blue-400' : ''}`} />
                                    {isDragging && <DocumentDuplicateIcon className="absolute -right-3 -bottom-2 w-6 h-6 text-blue-500" />}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 md:space-y-4 w-full max-w-3xl">
                        <h3 className="flex flex-col items-center justify-center text-xl sm:text-2xl md:text-4xl text-zinc-100 leading-none font-bold tracking-tighter gap-3">
                            <span>Bring</span>
                            <div className="h-8 sm:h-10 md:h-14 flex items-center justify-center w-full">
                            <CyclingText />
                            </div>
                            <span>to life</span>
                        </h3>
                        <p className="text-zinc-500 text-xs sm:text-base md:text-lg font-light tracking-wide">
                            <span className="hidden md:inline">Drag & Drop files (e.g. Worksheet + Answer Key)</span>
                            <span className="md:hidden">Tap to upload multiple files</span>
                        </p>
                    </div>
                </>
                )}
            </div>

            <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isGenerating || disabled}
                multiple
            />
        </label>
      </div>

      {/* Command Bar */}
      <div className={`
        relative w-full bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl p-3 
        flex gap-3 items-end transition-all duration-300
        ${hasFiles ? 'shadow-2xl shadow-blue-900/20 border-blue-500/30' : 'hover:border-zinc-700'}
      `}>
         <div className="flex-1 flex flex-col gap-2">
             <textarea 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={hasFiles ? "Add specific instructions (e.g., 'Focus on Chapter 4', 'Make a quiz')..." : "Optional: Add instructions or just drag & drop files above..."}
                className="w-full bg-transparent text-sm md:text-base text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none py-2 px-1 h-12 md:h-14"
                disabled={isGenerating}
                onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey && canGenerate) {
                        e.preventDefault();
                        handleGenerateClick();
                    }
                }}
             />
             {history.length > 0 && (
                 <div className="px-1 pb-1">
                     <select 
                         value={selectedReferenceId}
                         onChange={(e) => setSelectedReferenceId(e.target.value)}
                         className="bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 transition-colors w-full max-w-xs"
                         disabled={isGenerating}
                     >
                         <option value="">No reference (Start fresh)</option>
                         {history.map(item => (
                             <option key={item.id} value={item.id}>
                                 Use as reference: {item.name}
                             </option>
                         ))}
                     </select>
                 </div>
             )}
         </div>
         
         <div className="flex items-center gap-2">
            <button
                onClick={() => setDeepMode(!deepMode)}
                className={`
                   h-10 md:h-12 w-10 md:w-12 rounded-lg flex items-center justify-center transition-all border
                   ${deepMode 
                     ? 'bg-zinc-800 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                     : 'bg-zinc-800/50 border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                   }
                `}
                title={deepMode ? "Deep Thinking Mode ACTIVE: Double-checks logic, comprehensive generation (Slower)" : "Enable Deep Thinking Mode: Thorough analysis & self-correction"}
            >
               {deepMode ? <BeakerIconSolid className="w-5 h-5 md:w-6 md:h-6" /> : <BeakerIcon className="w-5 h-5 md:w-6 md:h-6" />}
            </button>

            <button
                onClick={() => setIosMode(!iosMode)}
                className={`
                   h-10 md:h-12 w-10 md:w-12 rounded-lg flex items-center justify-center transition-all border
                   ${iosMode 
                     ? 'bg-zinc-800 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                     : 'bg-zinc-800/50 border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                   }
                `}
                title={iosMode ? "iOS Optimization Active (Audio Unlock + Viewport Fixes)" : "Enable iOS Optimization for iPhones"}
            >
               <DevicePhoneMobileIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
                onClick={() => setStarMode(!starMode)}
                className={`
                   h-10 md:h-12 w-10 md:w-12 rounded-lg flex items-center justify-center transition-all border
                   ${starMode 
                     ? 'bg-zinc-800 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                     : 'bg-zinc-800/50 border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                   }
                `}
                title={starMode ? "High-Octane Visuals Active (Anime/Neon/Gamified)" : "Enable High-Quality Visuals"}
            >
               {starMode ? <StarIconSolid className="w-5 h-5 md:w-6 md:h-6" /> : <StarIcon className="w-5 h-5 md:w-6 md:h-6" />}
            </button>

            <button 
                onClick={handleGenerateClick}
                disabled={!canGenerate || isGenerating}
                className={`
                    h-10 md:h-12 px-6 rounded-lg font-medium text-sm md:text-base flex items-center gap-2 transition-all
                    ${canGenerate 
                        ? deepMode 
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20' 
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }
                `}
            >
                {isGenerating ? (
                    <>
                    <span className="animate-spin mr-1">⟳</span> {deepMode ? "Thinking..." : "Processing"}
                    </>
                ) : (
                    <>
                    <SparklesIcon className="w-4 h-4" />
                    Generate
                    </>
                )}
            </button>
         </div>
      </div>
    </div>
  );
};
