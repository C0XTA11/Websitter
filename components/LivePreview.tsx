
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useRef } from 'react';
import { ArrowDownTrayIcon, PlusIcon, ViewColumnsIcon, CodeBracketIcon, XMarkIcon, GlobeAltIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon, DevicePhoneMobileIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { Creation } from './CreationHistory';

interface LivePreviewProps {
  creation: Creation | null;
  isLoading: boolean;
  isFocused: boolean;
  onReset: () => void;
  onRefine: (instruction: string) => Promise<void>; // New prop for refinement
}

const LoadingStep = ({ text, active, completed }: { text: string, active: boolean, completed: boolean }) => (
    <div className={`flex items-center space-x-3 transition-all duration-500 ${active || completed ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
        <div className={`w-4 h-4 flex items-center justify-center ${completed ? 'text-green-400' : active ? 'text-blue-400' : 'text-zinc-700'}`}>
            {completed ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : active ? (
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            ) : (
                <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
            )}
        </div>
        <span className={`font-mono text-xs tracking-wide uppercase ${active ? 'text-zinc-200' : completed ? 'text-zinc-400 line-through' : 'text-zinc-600'}`}>{text}</span>
    </div>
);

export const LivePreview: React.FC<LivePreviewProps> = ({ creation, isLoading, isFocused, onReset, onRefine }) => {
    const [loadingStep, setLoadingStep] = useState(0);
    const [showChat, setShowChat] = useState(true); // Default to showing chat
    const [chatInput, setChatInput] = useState("");
    const [isRefining, setIsRefining] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    // Simple local chat history state for the session
    const [chatHistory, setChatHistory] = useState<{role: 'user' | 'system', text: string}[]>([]);

    // Handle loading animation steps
    useEffect(() => {
        if (isLoading) {
            setLoadingStep(0);
            const interval = setInterval(() => {
                setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
            }, 2000); 
            return () => clearInterval(interval);
        } else {
            setLoadingStep(0);
        }
    }, [isLoading]);

    // Add initial system message when creation loads
    useEffect(() => {
        if (creation && !isLoading && chatHistory.length === 0) {
            setChatHistory([{role: 'system', text: 'Website generated! You can ask me to make changes here. (e.g., "Make the font bigger", "Add a contact form")'}]);
        }
    }, [creation, isLoading]);

    // Scroll to bottom of chat
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, showChat]);

    const handleExportJson = () => {
        if (!creation) return;
        const dataStr = JSON.stringify(creation, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${creation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_artifact.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadHtml = () => {
        if (!creation) return;
        const blob = new Blob([creation.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Standard download for desktop/android
        a.download = `${creation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadIos = () => {
        if (!creation) return;
        
        // 1. Encode the HTML into Base64 (Unicode safe)
        const base64Html = btoa(
            encodeURIComponent(creation.html).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode(parseInt(p1, 16));
            })
        );
        
        // 2. Create a Data URI
        const dataUri = `data:text/html;charset=utf-8;base64,${base64Html}`;

        // 3. Create a .webloc file (macOS/iOS web shortcut)
        // This forces iOS to open the "link" (our data URI) in Safari, bypassing the Files app previewer (which blocks JS)
        const content = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>URL</key>
	<string>${dataUri}</string>
</dict>
</plist>`;

        const blob = new Blob([content], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${creation.name.replace(/[^a-z0-9]/gi, '_')}.webloc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleEnhance = async () => {
        if (isRefining) return;
        
        const prompt = `**META-COGNITIVE CODE REVIEW & ENHANCEMENT PROTOCOL**
        
        Act as a Principal Frontend Architect. Your goal is to critically analyze the existing codebase and apply a "Deep Polish & Fix" pass.
        
        1. **META-COGNITIVE ANALYSIS**:
           - Look for "lazy" implementation details (e.g., standard browser alerts, default fonts, lack of hover states).
           - Identify potential logic bugs (e.g., undefined variables, array index out of bounds).
           - Check for mobile responsiveness issues (e.g., horizontal scrollbars, touch targets too small).

        2. **EXECUTE COMPREHENSIVE FIXES**:
           - Repair any identified bugs immediately.
           - Ensure all interactive elements (buttons, inputs, cards) have proper \`cursor: pointer\` and feedback states.
           - Ensure accessibility (contrast, aria-labels).

        3. **VISUAL & UX OVERHAUL (AGENCY QUALITY)**:
           - **Typography**: Improve hierarchy, line-height, and tracking. Use the existing fonts more effectively.
           - **Spacing**: Enforce a consistent spacing rhythm (4px/8px grid).
           - **Micro-interactions**: Add subtle transitions (\`transition-all duration-300\`) to interactive elements.
           - **Polish**: Add subtle shadows, refined borders, and glassmorphism where appropriate to modernize the look.

        4. **FEATURE ROBUSTNESS**:
           - Do not remove features. Refactor them to be more reliable.
           - If a "Study Mode" or "Quiz" exists, ensure it feels premium and bug-free.

        Rewrite the code to be the definitive, polished version of this application.`;

        setChatHistory(prev => [...prev, {role: 'user', text: "✨ Auto-Enhance: analyzing code, fixing bugs, and polishing UX..."}]);
        setIsRefining(true);

        try {
            await onRefine(prompt);
            setChatHistory(prev => [...prev, {role: 'system', text: 'Enhancement complete! The code has been polished and fixed.'}]);
        } catch (error) {
            setChatHistory(prev => [...prev, {role: 'system', text: 'Enhancement process encountered an error.'}]);
        } finally {
            setIsRefining(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isRefining) return;
        
        const message = chatInput;
        setChatInput("");
        setChatHistory(prev => [...prev, {role: 'user', text: message}]);
        setIsRefining(true);

        try {
            await onRefine(message);
            setChatHistory(prev => [...prev, {role: 'system', text: 'Code updated successfully!'}]);
        } catch (error) {
            setChatHistory(prev => [...prev, {role: 'system', text: 'Error updating code. Please try again.'}]);
        } finally {
            setIsRefining(false);
        }
    };

    return (
    <div
      className={`
        fixed z-40 flex flex-col
        rounded-lg overflow-hidden border border-zinc-800 bg-[#0E0E10] shadow-2xl
        transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)
        ${isFocused
          ? 'inset-2 md:inset-4 opacity-100 scale-100'
          : 'top-1/2 left-1/2 w-[90%] h-[60%] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none'
        }
      `}
    >
      {/* Minimal Technical Header */}
      <div className="bg-[#121214] px-4 py-3 flex items-center justify-between border-b border-zinc-800 shrink-0">
        {/* Left: Controls */}
        <div className="flex items-center space-x-3 w-32">
           <div className="flex space-x-2 group/controls">
                <button 
                  onClick={onReset}
                  className="w-3 h-3 rounded-full bg-zinc-700 group-hover/controls:bg-red-500 hover:!bg-red-600 transition-colors flex items-center justify-center focus:outline-none"
                  title="Close Preview"
                >
                  <XMarkIcon className="w-2 h-2 text-black opacity-0 group-hover/controls:opacity-100" />
                </button>
                <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover/controls:bg-yellow-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover/controls:bg-green-500 transition-colors"></div>
           </div>
        </div>
        
        {/* Center: Title */}
        <div className="flex items-center space-x-2 text-zinc-500">
            <CodeBracketIcon className="w-3 h-3" />
            <span className="text-[11px] font-mono uppercase tracking-wider truncate max-w-[200px]">
                {isLoading ? 'System Processing...' : isRefining ? 'Refining Code...' : creation ? creation.name : 'Preview Mode'}
            </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end space-x-2 min-w-[140px]">
            {!isLoading && creation && (
                <>
                    <button 
                        onClick={() => setShowChat(!showChat)}
                        title={showChat ? "Hide Chat" : "Show Chat"}
                        className={`p-1.5 rounded-md transition-all ${showChat ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                    >
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    </button>
                    
                    <button 
                        onClick={handleExportJson}
                        title="Save Project (JSON)"
                        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-md hover:bg-zinc-800"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleDownloadIos}
                        className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ml-2 border border-zinc-700"
                        title="Download .webloc file (Best for iPhone/iPad)"
                    >
                        <DevicePhoneMobileIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">iPhone</span>
                        <span className="sm:hidden">iOS</span>
                    </button>

                    <button
                        onClick={handleEnhance}
                        disabled={isRefining}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-md transition-colors text-xs font-medium border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                        title="Enhance & Fix: Deep code analysis and polish"
                    >
                        {isRefining ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                        ) : (
                            <WrenchScrewdriverIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        )}
                        <span className="hidden sm:inline">Enhance & Fix</span>
                    </button>

                    <button
                        onClick={handleDownloadHtml}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors text-xs font-medium"
                        title="Download .html file (Desktop/Android)"
                    >
                        <GlobeAltIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">HTML</span>
                    </button>

                    <button 
                        onClick={onReset}
                        title="New Upload"
                        className="ml-2 flex items-center space-x-1 text-xs font-bold bg-white text-black hover:bg-zinc-200 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <PlusIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">New</span>
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full flex-1 bg-[#09090b] flex overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 w-full">
             {/* Technical Loading State */}
             <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 mb-6 text-blue-500 animate-spin-slow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-zinc-100 font-mono text-lg tracking-tight">Constructing Environment</h3>
                    <p className="text-zinc-500 text-sm mt-2">Interpreting visual data...</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-[loading_3s_ease-in-out_infinite] w-1/3"></div>
                </div>

                 {/* Terminal Steps */}
                 <div className="border border-zinc-800 bg-black/50 rounded-lg p-4 space-y-3 font-mono text-sm">
                     <LoadingStep text="Analyzing visual inputs" active={loadingStep === 0} completed={loadingStep > 0} />
                     <LoadingStep text="Identifying UI patterns" active={loadingStep === 1} completed={loadingStep > 1} />
                     <LoadingStep text="Generating functional logic" active={loadingStep === 2} completed={loadingStep > 2} />
                     <LoadingStep text="Compiling preview" active={loadingStep === 3} completed={loadingStep > 3} />
                 </div>
             </div>
          </div>
        ) : creation?.html ? (
          <>
            {/* Split View: Left Panel (Refinement Chat) */}
            <div className={`
                border-r border-zinc-800 bg-[#0c0c0e] relative flex flex-col shrink-0 transition-all duration-500 ease-in-out
                ${showChat ? 'w-80 md:w-96 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden border-none'}
            `}>
                <div className="p-4 border-b border-zinc-800/50 bg-[#121214]">
                    <h3 className="text-xs font-mono font-bold uppercase text-zinc-400">Creation Assistant</h3>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                                msg.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-zinc-800 text-zinc-300'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isRefining && (
                        <div className="flex justify-start">
                             <div className="bg-zinc-800 rounded-lg px-3 py-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-150"></div>
                             </div>
                        </div>
                    )}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-zinc-800 bg-[#121214]">
                    <div className="relative">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a change (e.g., 'Fix the title')"
                            disabled={isRefining}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 pl-3 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || isRefining}
                            className="absolute right-1 top-1 p-1.5 text-zinc-400 hover:text-blue-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                        >
                            <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* App Preview Panel */}
            <div className="relative flex-1 h-full bg-[#18181b] flex flex-col">
                 {/* Iframe with key to force remount on code change to prevent blank screen issues */}
                 <iframe
                    key={creation.html.length + creation.id}
                    title="Gemini Live Preview"
                    srcDoc={creation.html}
                    className="w-full h-full border-none block bg-[#18181b]"
                    sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
                    allow="microphone; camera; midi; encrypted-media; autoplay"
                />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
