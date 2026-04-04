
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { Hero } from './components/Hero';
import { InputArea } from './components/InputArea';
import { LivePreview } from './components/LivePreview';
import { CreationHistory, Creation } from './components/CreationHistory';
import { bringToLife, updateCode } from './services/gemini';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { defaultReferenceHtml } from './data/defaultReference';

const App: React.FC = () => {
  const [activeCreation, setActiveCreation] = useState<Creation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<Creation[]>([]);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Load history from local storage or fetch examples on mount
  useEffect(() => {
    const initHistory = async () => {
      const saved = localStorage.getItem('gemini_app_history');
      let loadedHistory: Creation[] = [];

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          loadedHistory = parsed.map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp)
          }));
        } catch (e) {
          console.error("Failed to load history", e);
        }
      }

      const defaultCreation: Creation = {
        id: 'default-reference-bes-dojo',
        name: "Be's English Dojo",
        html: defaultReferenceHtml,
        timestamp: new Date('2026-03-24T00:00:00Z'),
      };

      if (!loadedHistory.some(c => c.id === defaultCreation.id)) {
        loadedHistory.push(defaultCreation);
      }

      if (loadedHistory.length > 0) {
        setHistory(loadedHistory);
      }
    };

    initHistory();
  }, []);

  // Save history when it changes
  useEffect(() => {
    if (history.length > 0) {
        try {
            localStorage.setItem('gemini_app_history', JSON.stringify(history));
        } catch (e) {
            console.warn("Local storage full or error saving history", e);
        }
    }
  }, [history]);

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = async (promptText: string, files: File[], iosMode: boolean = false, starMode: boolean = false, deepMode: boolean = false, referenceHtml?: string) => {
    setIsGenerating(true);
    // Clear active creation to show loading state
    setActiveCreation(null);

    try {
      let processedFiles: { mimeType: string; data: string }[] = [];
      let fileNamesContext = "";

      if (files && files.length > 0) {
        fileNamesContext = files.map(f => f.name).join(", ");
        processedFiles = await Promise.all(files.map(async (file) => {
            const base64 = await fileToBase64(file);
            return {
                mimeType: file.type.toLowerCase(),
                data: base64
            };
        }));
      }

      // Inject filenames into the prompt so the AI can name the app correctly
      const enhancedPrompt = `${promptText}\n\n[SYSTEM: The user uploaded these files: ${fileNamesContext}. Use these names to title the app (e.g. if file is 'Mariga.pdf', title it 'Mariga's Dojo').]`;

      const html = await bringToLife(enhancedPrompt, processedFiles, iosMode, starMode, deepMode, referenceHtml);
      
      if (html) {
        // Use the first file as the preview thumbnail for the history/UI
        const originalImage = processedFiles.length > 0 
            ? `data:${processedFiles[0].mimeType};base64,${processedFiles[0].data}` 
            : undefined;

        const newCreation: Creation = {
          id: crypto.randomUUID(),
          name: files.length > 1 ? `${files[0].name} + ${files.length - 1} more` : (files[0]?.name || 'New Creation'),
          html: html,
          originalImage: originalImage,
          timestamp: new Date(),
        };
        setActiveCreation(newCreation);
        setHistory(prev => [newCreation, ...prev]);
      }

    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Something went wrong while bringing your file to life. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!activeCreation) return;
    
    // We do NOT set isGenerating to true here for the whole app, 
    // because we want the refinement loop to happen inside LivePreview's internal state mostly,
    // but updating the activeCreation needs to propagate.
    
    try {
        const updatedHtml = await updateCode(activeCreation.html, instruction);
        
        // Update the active creation with new HTML
        const updatedCreation = { ...activeCreation, html: updatedHtml };
        setActiveCreation(updatedCreation);
        
        // Update history
        setHistory(prev => prev.map(item => item.id === updatedCreation.id ? updatedCreation : item));
        
    } catch (error) {
        console.error("Refinement failed:", error);
        throw error; // Re-throw for LivePreview to handle UI state
    }
  };

  const handleReset = () => {
    setActiveCreation(null);
    setIsGenerating(false);
  };

  const handleSelectCreation = (creation: Creation) => {
    setActiveCreation(creation);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = event.target?.result as string;
            const parsed = JSON.parse(json);
            
            // Basic validation
            if (parsed.html && parsed.name) {
                const importedCreation: Creation = {
                    ...parsed,
                    timestamp: new Date(parsed.timestamp || Date.now()),
                    id: parsed.id || crypto.randomUUID()
                };
                
                // Add to history if not already there (by ID check)
                setHistory(prev => {
                    const exists = prev.some(c => c.id === importedCreation.id);
                    return exists ? prev : [importedCreation, ...prev];
                });

                // Set as active immediately
                setActiveCreation(importedCreation);
            } else {
                alert("Invalid creation file format.");
            }
        } catch (err) {
            console.error("Import error", err);
            alert("Failed to import creation.");
        }
        // Reset input
        if (importInputRef.current) importInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const isFocused = !!activeCreation || isGenerating;

  return (
    <div className="h-[100dvh] bg-zinc-950 bg-dot-grid text-zinc-50 selection:bg-blue-500/30 overflow-y-auto overflow-x-hidden relative flex flex-col">
      
      {/* Centered Content Container */}
      <div 
        className={`
          min-h-full flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 
          transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
          ${isFocused 
            ? 'opacity-0 scale-95 blur-sm pointer-events-none h-[100dvh] overflow-hidden' 
            : 'opacity-100 scale-100 blur-0'
          }
        `}
      >
        {/* Main Vertical Centering Wrapper */}
        <div className="flex-1 flex flex-col justify-center items-center w-full py-12 md:py-20">
          
          {/* 1. Hero Section */}
          <div className="w-full mb-8 md:mb-16">
              <Hero />
          </div>

          {/* 2. Input Section */}
          <div className="w-full flex justify-center mb-8">
              <InputArea onGenerate={handleGenerate} isGenerating={isGenerating} disabled={isFocused} history={history} />
          </div>

        </div>
        
        {/* 3. History Section & Footer - Stays at bottom */}
        <div className="flex-shrink-0 pb-6 w-full mt-auto flex flex-col items-center gap-6">
            <div className="w-full px-2 md:px-0">
                <CreationHistory history={history} onSelect={handleSelectCreation} />
            </div>
            
            <a 
              href="https://x.com/ammaar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-zinc-400 text-xs font-mono transition-colors pb-2"
            >
              Created by @ammaar
            </a>
        </div>
      </div>

      {/* Live Preview - Always mounted for smooth transition */}
      <LivePreview
        creation={activeCreation}
        isLoading={isGenerating}
        isFocused={isFocused}
        onReset={handleReset}
        onRefine={handleRefine}
      />

      {/* Subtle Import Button (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
            onClick={handleImportClick}
            className="flex items-center space-x-2 p-2 text-zinc-500 hover:text-zinc-300 transition-colors opacity-60 hover:opacity-100"
            title="Import Artifact"
        >
            <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">Upload previous artifact</span>
            <ArrowUpTrayIcon className="w-5 h-5" />
        </button>
        <input 
            type="file" 
            ref={importInputRef} 
            onChange={handleImportFile} 
            accept=".json" 
            className="hidden" 
        />
      </div>
    </div>
  );
};

export default App;
