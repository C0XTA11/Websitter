export const defaultReferenceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Be's English Dojo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --neon-pink: #FF0055;
            --neon-cyan: #00E5FF;
            --bg-dark: #18181b;
        }
        body {
            font-family: 'Fredoka', sans-serif;
            background-color: var(--bg-dark);
            color: #f4f4f5;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, .bangers {
            font-family: 'Bangers', cursive;
            letter-spacing: 2px;
            font-weight: normal;
        }
        
        /* Neon Styles & Glows */
        .text-neon-pink { color: var(--neon-pink); text-shadow: 0 0 8px rgba(255,0,85,0.6); }
        .text-neon-cyan { color: var(--neon-cyan); text-shadow: 0 0 8px rgba(0,229,255,0.6); }
        .border-neon-cyan { border-color: var(--neon-cyan); box-shadow: 0 0 12px rgba(0,229,255,0.3); }
        .border-neon-pink { border-color: var(--neon-pink); box-shadow: 0 0 12px rgba(255,0,85,0.3); }
        .bg-neon-pink { background-color: var(--neon-pink); box-shadow: 0 0 15px rgba(255,0,85,0.5); }
        .bg-neon-cyan { background-color: var(--neon-cyan); box-shadow: 0 0 15px rgba(0,229,255,0.5); color: #000; }
        
        /* Glassmorphism */
        .glass {
            background: rgba(24, 24, 27, 0.8);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .glass-card {
            background: rgba(39, 39, 42, 0.5);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }

        /* 3D Transforms */
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        .flashcard-inner, .memory-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
            transform-style: preserve-3d;
        }
        .flashcard-container.flipped .flashcard-inner,
        .memory-card.flipped .memory-card-inner {
            transform: rotateY(180deg);
        }

        /* Animations */
        .mode-section {
            animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-dark); }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--neon-cyan); }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* Utilities */
        .hide { display: none !important; }
        .interactive-word { 
            color: var(--neon-cyan); 
            cursor: pointer; 
            text-decoration: underline; 
            text-decoration-style: dotted;
            text-underline-offset: 4px;
            transition: all 0.2s;
        }
        .interactive-word:hover {
            color: #fff;
            background: rgba(0,229,255,0.2);
            border-radius: 4px;
        }
        
        /* Nav Active State */
        .nav-btn.active {
            background-color: var(--neon-cyan);
            color: #000;
            border-color: var(--neon-cyan);
            box-shadow: 0 0 12px rgba(0,229,255,0.4);
        }
        .nav-btn.active-pink {
            background-color: var(--neon-pink);
            color: #fff;
            border-color: var(--neon-pink);
            box-shadow: 0 0 12px rgba(255,0,85,0.4);
        }
    </style>
</head>
<body class="pt-24 pb-12 min-h-screen flex flex-col items-center selection:bg-neon-cyan selection:text-black">

    <!-- NAVIGATION -->
    <nav class="glass fixed top-0 left-0 w-full z-50 px-4 py-3 flex flex-wrap justify-between items-center shadow-lg">
        <div class="flex items-center gap-3 cursor-pointer" onclick="switchMode('study')" aria-label="Go to home">
            <span class="text-4xl drop-shadow-md hover:scale-110 transition-transform">⚡</span>
            <h1 class="text-3xl text-neon-cyan m-0 leading-none tracking-widest">BE\\'S DOJO</h1>
        </div>
        
        <div class="flex gap-3 overflow-x-auto py-2 scrollbar-hide w-full md:w-auto mt-3 md:mt-0">
            <button onclick="switchMode('study')" class="nav-btn bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg border border-zinc-600 font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan">📖 Study</button>
            <button onclick="switchMode('flashcards')" class="nav-btn bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg border border-zinc-600 font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan">⚡ Cards</button>
            <button onclick="switchMode('quiz')" class="nav-btn bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg border border-zinc-600 font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan">📝 Quiz</button>
            <button onclick="switchMode('game')" class="nav-btn bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg border border-zinc-600 font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan">🎮 Game</button>
            <button onclick="switchMode('reading')" class="nav-btn bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg border border-zinc-600 font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan">📚 Read</button>
            <button onclick="switchMode('extra')" class="nav-btn bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg border border-zinc-600 font-semibold text-sm text-neon-pink transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-pink">✨ Bonus</button>
        </div>

        <div class="flex gap-6 bangers text-2xl tracking-wide hidden md:flex">
            <div class="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-lg border border-zinc-700">
                <span class="text-yellow-400 drop-shadow-md">⭐</span> 
                <span id="xp-counter" class="transition-all duration-300 inline-block">0</span> XP
            </div>
            <div class="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-lg border border-zinc-700">
                <span class="text-orange-500 drop-shadow-md">🔥</span> 
                <span id="streak-counter" class="transition-all duration-300 inline-block">0</span>
            </div>
        </div>
    </nav>

    <!-- MAIN CONTAINER -->
    <main class="w-full max-w-5xl px-4 flex-grow flex flex-col relative">

        <!-- 1. STUDY MODE -->
        <section id="mode-study" class="mode-section w-full">
            <div class="text-center mb-10">
                <h2 class="text-5xl text-neon-pink mb-3 drop-shadow-lg">📖 Vocabulary Arsenal</h2>
                <p class="text-zinc-400 text-lg">Click any card to hear the pronunciation.</p>
            </div>
            <div id="study-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                <!-- Populated by JS -->
            </div>
        </section>

        <!-- 2. FLASHCARD MODE -->
        <section id="mode-flashcards" class="mode-section hide w-full min-h-[70vh] flex flex-col items-center justify-center relative">
            <div class="text-center mb-8">
                <h2 class="text-5xl text-neon-cyan mb-3 drop-shadow-lg">⚡ Power Cards</h2>
                <p class="text-zinc-400 text-lg">Click to flip. Use <kbd class="bg-zinc-800 px-2 py-1 rounded border border-zinc-600 text-sm">←</kbd> <kbd class="bg-zinc-800 px-2 py-1 rounded border border-zinc-600 text-sm">→</kbd> to navigate. <kbd class="bg-zinc-800 px-2 py-1 rounded border border-zinc-600 text-sm">Space</kbd> to flip.</p>
            </div>
            
            <div class="perspective-1000 w-full max-w-xl h-96 cursor-pointer flashcard-container group" id="flashcard-container" onclick="flipCard()" aria-label="Flashcard. Click to flip.">
                <div class="flashcard-inner rounded-3xl shadow-2xl border-2 border-zinc-700 group-hover:border-neon-cyan transition-colors duration-300 bg-zinc-800" id="flashcard-inner">
                    <!-- FRONT -->
                    <div class="backface-hidden absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-zinc-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
                        <span id="fc-emoji" class="text-7xl mb-6 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-300"></span>
                        <h3 id="fc-front" class="text-6xl bangers tracking-widest text-white drop-shadow-md"></h3>
                        <button onclick="playAudio(event, document.getElementById(\\'fc-front\\').innerText)" class="mt-8 bg-zinc-700 hover:bg-zinc-600 hover:text-neon-cyan px-6 py-3 rounded-full text-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan flex items-center gap-2 shadow-lg">
                            🔊 Listen
                        </button>
                    </div>
                    <!-- BACK -->
                    <div class="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-zinc-800 border-2 border-neon-pink shadow-[0_0_30px_rgba(255,0,85,0.2)]">
                        <h3 id="fc-back" class="text-4xl font-bold mb-6 text-neon-pink tracking-wide"></h3>
                        <p id="fc-example" class="text-2xl italic text-zinc-300 leading-relaxed"></p>
                    </div>
                </div>
            </div>

            <div class="flex gap-6 mt-10">
                <button onclick="prevCard()" class="bg-zinc-800 border-2 border-zinc-600 hover:border-neon-cyan hover:text-neon-cyan px-8 py-3 rounded-xl text-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan shadow-lg flex items-center gap-2">
                    ⬅️ Prev
                </button>
                <button onclick="nextCard()" class="bg-neon-cyan text-black px-8 py-3 rounded-xl text-xl font-bold hover:bg-cyan-400 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center gap-2">
                    Next ➡️
                </button>
            </div>
        </section>

        <!-- 3. QUIZ MODE -->
        <section id="mode-quiz" class="mode-section hide w-full max-w-3xl mx-auto">
            <div class="text-center mb-8">
                <h2 class="text-5xl text-neon-pink mb-3 drop-shadow-lg">📝 Battle Quiz</h2>
                <p class="text-zinc-400 text-lg">Test your knowledge and earn XP!</p>
            </div>
            <div class="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-zinc-700">
                    <div id="quiz-progress-bar" class="h-full bg-neon-pink transition-all duration-500" style="width: 0%"></div>
                </div>
                <div class="flex justify-between mb-6 text-zinc-400 font-bold text-lg">
                    <span id="quiz-progress" class="bg-zinc-800 px-4 py-1 rounded-full border border-zinc-700">Question 1/5</span>
                    <span id="quiz-score" class="bg-zinc-800 px-4 py-1 rounded-full border border-zinc-700 text-neon-cyan">Score: 0</span>
                </div>
                <h3 id="quiz-question" class="text-3xl mb-8 font-semibold min-h-[80px] leading-tight"></h3>
                <div id="quiz-options" class="flex flex-col gap-4">
                    <!-- Options -->
                </div>
                <div id="quiz-feedback" class="mt-8 text-center text-2xl font-bold h-10 transition-all duration-300"></div>
                <button id="quiz-next-btn" onclick="nextQuiz()" class="mt-6 w-full bg-neon-cyan text-black py-4 rounded-xl font-bold text-2xl hide hover:bg-cyan-400 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] focus:outline-none focus:ring-2 focus:ring-neon-cyan">
                    Next Question ⚡
                </button>
            </div>
        </section>

        <!-- 4. GAME MODE -->
        <section id="mode-game" class="mode-section hide w-full flex flex-col items-center">
            <div class="text-center mb-8">
                <h2 class="text-5xl text-neon-cyan mb-3 drop-shadow-lg">🎮 Training Simulator</h2>
                <p class="text-zinc-400 text-lg">Complete stages to unlock the ultimate challenge.</p>
            </div>
            
            <!-- Stage 1: Memory -->
            <div id="game-stage-1" class="w-full max-w-4xl glass-card p-8 rounded-3xl mb-10">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-3xl bangers text-white tracking-wide">Stage 1: Memory Match</h3>
                    <span class="bg-zinc-800 px-4 py-1 rounded-full border border-zinc-600 text-sm font-bold text-zinc-300">Find all pairs</span>
                </div>
                <div id="memory-grid" class="grid grid-cols-4 gap-4 perspective-1000">
                    <!-- Cards -->
                </div>
            </div>

            <!-- Stage 2: Scramble -->
            <div id="game-stage-2" class="w-full max-w-4xl hide">
                <div class="text-center mb-6">
                    <h3 class="text-4xl text-neon-pink bangers drop-shadow-lg animate-pulse">🔓 Stage 2 Unlocked: Sentence Scramble!</h3>
                </div>
                <div class="glass-card p-8 rounded-3xl text-center border-2 border-neon-pink shadow-[0_0_20px_rgba(255,0,85,0.1)]">
                    <p class="mb-6 text-zinc-300 text-xl">Rebuild the sentence: <br> <span class="italic font-semibold text-white text-2xl mt-2 inline-block">"Eu quero ter um McLaren"</span></p>
                    
                    <div id="scramble-dropzone" class="min-h-[80px] border-2 border-dashed border-zinc-500 rounded-xl mb-8 flex flex-wrap gap-3 p-4 justify-center items-center bg-zinc-900/50 transition-colors duration-300">
                        <!-- Dropped words -->
                    </div>
                    
                    <div id="scramble-words" class="flex flex-wrap gap-4 justify-center min-h-[60px]">
                        <!-- Words to click -->
                    </div>
                    
                    <button onclick="checkScramble()" class="mt-10 bg-neon-pink text-white px-10 py-4 rounded-xl font-bold text-2xl hover:bg-pink-600 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,0,85,0.4)] focus:outline-none focus:ring-2 focus:ring-neon-pink">
                        Check Answer
                    </button>
                    <div id="scramble-feedback" class="mt-6 h-8 transition-all duration-300"></div>
                </div>
            </div>
        </section>

        <!-- 5. READING PRACTICE -->
        <section id="mode-reading" class="mode-section hide w-full max-w-4xl mx-auto">
            <div class="text-center mb-8">
                <h2 class="text-5xl text-neon-pink mb-3 drop-shadow-lg">📚 Story Quest</h2>
                <p class="text-zinc-400 text-lg">Read, listen, and test your comprehension.</p>
            </div>
            
            <div class="glass-card p-8 md:p-10 rounded-3xl mb-10 relative border-t-4 border-t-neon-cyan">
                <div class="absolute top-6 right-6 flex gap-3">
                    <button id="btn-play-story" onclick="playStory()" class="bg-neon-cyan text-black px-5 py-2 rounded-lg font-bold hover:bg-cyan-400 hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan flex items-center gap-2">
                        ▶ Play
                    </button>
                    <button onclick="stopAudio()" class="bg-zinc-700 text-white px-5 py-2 rounded-lg font-bold hover:bg-zinc-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 flex items-center gap-2">
                        ⏹ Stop
                    </button>
                </div>
                <h3 class="text-4xl bangers text-neon-cyan mb-6 tracking-wide">Be\\'s Big Adventure</h3>
                <div class="text-xl leading-relaxed space-y-6 text-zinc-200" id="story-text">
                    <p>Hello! My name is Be. I am a 10-year-old student. Today I feel very <span class="interactive-word font-semibold" data-def="Animado / Muito feliz">excited</span>! I want to <span class="interactive-word font-semibold" data-def="Explorar (verbo)">explore</span> nature and ride my <span class="interactive-word font-semibold" data-def="Bicicleta">bicycle</span>.</p>
                    <p>My favorite animals are the <span class="interactive-word font-semibold" data-def="Lobo">wolf</span> and the <span class="interactive-word font-semibold" data-def="Hipopótamo (cavalo do rio)">hippo</span>. The hippo is known as the \\'horse of the river\\'. Sometimes, I play the <span class="interactive-word font-semibold" data-def="Bateria (instrumento)">drums</span> and make a lot of <span class="interactive-word font-semibold" data-def="Barulho">noise</span>, just like my dogs when they are barking!</p>
                    <p>At <span class="interactive-word font-semibold" data-def="Meia-noite (12:00 AM)">midnight</span>, I like to sleep because I get <span class="interactive-word font-semibold" data-def="Cansado">tired</span>. In the future, I want to drive a <span class="interactive-word font-semibold" data-def="Rápido">fast</span> McLaren and drink cold grape <span class="interactive-word font-semibold" data-def="Suco">juice</span>!</p>
                </div>
            </div>

            <div class="glass-card p-8 md:p-10 rounded-3xl border-t-4 border-t-neon-pink">
                <h3 class="text-3xl bangers text-neon-pink mb-8 tracking-wide">Comprehension Check</h3>
                <div id="reading-quiz" class="space-y-8">
                    <!-- Populated by JS -->
                </div>
                <div id="reading-feedback" class="hide mt-6"></div>
                <button id="btn-submit-reading" onclick="checkReadingQuiz()" class="w-full bg-neon-pink text-white py-4 rounded-xl font-bold text-2xl mt-8 hover:bg-pink-600 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(255,0,85,0.4)] focus:outline-none focus:ring-2 focus:ring-neon-pink">
                    Submit Answers
                </button>
            </div>
        </section>

        <!-- 6. EXTRA MODE -->
        <section id="mode-extra" class="mode-section hide w-full max-w-5xl mx-auto text-center">
            <div class="mb-12">
                <h2 class="text-6xl text-neon-cyan mb-4 bangers drop-shadow-lg">✨ Bonus Level Unlocked!</h2>
                <p class="text-2xl text-zinc-300">Advanced Gamer Lexicon - Expand your vocabulary!</p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <button class="glass-card p-8 rounded-2xl border border-neon-cyan hover:scale-105 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-cyan flex flex-col items-center group" onclick="speak('Level Up')" aria-label="Listen to Level Up">
                    <div class="text-6xl mb-4 drop-shadow-lg transform group-hover:-translate-y-2 transition-transform">⬆️</div>
                    <h3 class="text-3xl bangers text-neon-cyan tracking-wide mb-2">Level Up</h3>
                    <p class="text-zinc-300 text-lg font-medium">Subir de nível</p>
                </button>
                <button class="glass-card p-8 rounded-2xl border border-neon-pink hover:scale-105 hover:shadow-[0_0_25px_rgba(255,0,85,0.3)] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-pink flex flex-col items-center group" onclick="speak('Boss Fight')" aria-label="Listen to Boss Fight">
                    <div class="text-6xl mb-4 drop-shadow-lg transform group-hover:-translate-y-2 transition-transform">👹</div>
                    <h3 class="text-3xl bangers text-neon-pink tracking-wide mb-2">Boss Fight</h3>
                    <p class="text-zinc-300 text-lg font-medium">Luta contra o chefão</p>
                </button>
                <button class="glass-card p-8 rounded-2xl border border-yellow-400 hover:scale-105 hover:shadow-[0_0_25px_rgba(250,204,21,0.3)] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 flex flex-col items-center group" onclick="speak('Inventory')" aria-label="Listen to Inventory">
                    <div class="text-6xl mb-4 drop-shadow-lg transform group-hover:-translate-y-2 transition-transform">🎒</div>
                    <h3 class="text-3xl bangers text-yellow-400 tracking-wide mb-2">Inventory</h3>
                    <p class="text-zinc-300 text-lg font-medium">Inventário (mochila)</p>
                </button>
                <button class="glass-card p-8 rounded-2xl border border-green-400 hover:scale-105 hover:shadow-[0_0_25px_rgba(74,222,128,0.3)] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 flex flex-col items-center group" onclick="speak('Health Potion')" aria-label="Listen to Health Potion">
                    <div class="text-6xl mb-4 drop-shadow-lg transform group-hover:-translate-y-2 transition-transform">🧪</div>
                    <h3 class="text-3xl bangers text-green-400 tracking-wide mb-2">Health Potion</h3>
                    <p class="text-zinc-300 text-lg font-medium">Poção de vida</p>
                </button>
                <button class="glass-card p-8 rounded-2xl border border-purple-400 hover:scale-105 hover:shadow-[0_0_25px_rgba(192,132,252,0.3)] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 flex flex-col items-center group" onclick="speak('Multiplayer')" aria-label="Listen to Multiplayer">
                    <div class="text-6xl mb-4 drop-shadow-lg transform group-hover:-translate-y-2 transition-transform">👥</div>
                    <h3 class="text-3xl bangers text-purple-400 tracking-wide mb-2">Multiplayer</h3>
                    <p class="text-zinc-300 text-lg font-medium">Jogar com amigos</p>
                </button>
                <button class="glass-card p-8 rounded-2xl border border-orange-400 hover:scale-105 hover:shadow-[0_0_25px_rgba(251,146,60,0.3)] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 flex flex-col items-center group" onclick="speak('Quest')" aria-label="Listen to Quest">
                    <div class="text-6xl mb-4 drop-shadow-lg transform group-hover:-translate-y-2 transition-transform">📜</div>
                    <h3 class="text-3xl bangers text-orange-400 tracking-wide mb-2">Quest</h3>
                    <p class="text-zinc-300 text-lg font-medium">Missão</p>
                </button>
            </div>
        </section>

    </main>

    <!-- Modal for Reading Definitions -->
    <div id="def-modal" class="fixed inset-0 bg-black/90 hidden items-center justify-center z-[100] backdrop-blur-sm transition-opacity duration-300 opacity-0" onclick="closeModal()">
        <div class="bg-zinc-800 border-2 border-neon-cyan p-10 rounded-3xl text-center max-w-md w-full mx-4 shadow-[0_0_40px_rgba(0,229,255,0.2)] transform scale-95 transition-transform duration-300" id="def-modal-content" onclick="event.stopPropagation()">
            <h3 id="modal-word" class="text-5xl bangers text-neon-cyan mb-4 tracking-wide"></h3>
            <p id="modal-def" class="text-2xl text-white mb-8 font-medium"></p>
            <button onclick="closeModal()" class="bg-neon-pink text-white px-8 py-3 rounded-xl font-bold text-xl hover:bg-pink-600 hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-neon-pink w-full">
                Awesome!
            </button>
        </div>
    </div>

    <script>
        // --- DATA ---
        const vocabData = [
            { word: "Dinosaur", emoji: "🦖", pt: "Dinossauro", type: "animal" },
            { word: "Owl", emoji: "🦉", pt: "Coruja", type: "animal" },
            { word: "Pufferfish", emoji: "🐡", pt: "Baiacu", type: "animal" },
            { word: "Cow", emoji: "🐄", pt: "Vaca", type: "animal" },
            { word: "Fox", emoji: "🦊", pt: "Raposa", type: "animal" },
            { word: "Wolf", emoji: "🐺", pt: "Lobo", type: "animal" },
            { word: "Shark", emoji: "🦈", pt: "Tubarão", type: "animal" },
            { word: "Hippo", emoji: "🦛", pt: "Hipopótamo", type: "animal" },
            { word: "Fast", emoji: "⚡", pt: "Rápido", type: "adj" },
            { word: "Slow", emoji: "🐢", pt: "Lento", type: "adj" },
            { word: "Happy", emoji: "😀", pt: "Feliz", type: "feeling" },
            { word: "Sad", emoji: "☹️", pt: "Triste", type: "feeling" },
            { word: "Excited", emoji: "🥳", pt: "Animado", type: "feeling" },
            { word: "Tired", emoji: "😴", pt: "Cansado", type: "feeling" },
            { word: "Midnight", emoji: "🕛", pt: "Meia-noite", type: "time" },
            { word: "Drums", emoji: "🥁", pt: "Bateria", type: "misc" },
            { word: "Juice", emoji: "🧃", pt: "Suco", type: "misc" },
            { word: "Bicycle", emoji: "🚲", pt: "Bicicleta", type: "vehicle" }
        ];

        const flashcardsData = [
            { front: "Fastest", back: "A mais rápida", example: "It\\'s the fastest motorcycle in the world!", emoji: "🏍️" },
            { front: "Slowest", back: "O mais lento", example: "The slowest car is the Honda Civic.", emoji: "🚗" },
            { front: "Can", back: "Poder (verbo)", example: "I can pilot a kart and ride a motorcycle.", emoji: "💪" },
            { front: "How often", back: "Com que frequência", example: "How often does he visit?", emoji: "⏱️" },
            { front: "Godfather", back: "Padrinho", example: "My godfather\\'s name is Thiago.", emoji: "👨" },
            { front: "Play", back: "Tocar, jogar, brincar", example: "I play the drums and video games.", emoji: "🎮" },
            { front: "Noise", back: "Barulho", example: "My dogs make a lot of noise.", emoji: "🔊" }
        ];

        const quizData = [
            { q: "What is the translation for \\'How often\\'?", options: ["Como você diz", "Com que frequência", "Eu posso"], ans: 1 },
            { q: "Which animal is the \\'horse of the river\\'?", options: ["Shark", "Hippo", "Cow"], ans: 1 },
            { q: "Fill in the blank: I _____ pilot a kart.", options: ["can", "am", "play"], ans: 0 },
            { q: "What is \\'Midnight\\'?", options: ["12:00 PM", "12:00 AM", "6:30 AM"], ans: 1 },
            { q: "How do you say \\'Bateria\\' (instrument) in English?", options: ["Battery", "Drums", "Potato"], ans: 1 }
        ];

        const readingQuizData = [
            { q: "1. How does Be feel today?", options: ["Sad", "Excited", "Angry"], ans: 1 },
            { q: "2. What does Be want to ride?", options: ["A motorcycle", "A McLaren", "A bicycle"], ans: 2 },
            { q: "3. What is a hippo known as?", options: ["Horse of the river", "Big dog", "Fastest animal"], ans: 0 },
            { q: "4. What instrument does Be play?", options: ["Guitar", "Drums", "Piano"], ans: 1 },
            { q: "5. What does Be want to drink in the future?", options: ["Beer", "Cold grape juice", "Hot water"], ans: 1 }
        ];

        // --- STATE ---
        let xp = parseInt(localStorage.getItem('be_xp')) || 0;
        let streak = parseInt(localStorage.getItem('be_streak')) || 0;
        let currentFCIndex = 0;
        let currentQuizIndex = 0;
        let quizScore = 0;

        // --- INIT ---
        function init() {
            updateStats();
            renderStudyMode();
            renderFlashcard();
            renderReadingQuiz();
            setupInteractiveWords();
            initMemoryGame();
            
            // Keyboard shortcuts for flashcards
            document.addEventListener('keydown', (e) => {
                if(document.getElementById('mode-flashcards').classList.contains('hide')) return;
                // Prevent triggering if focused on a button
                if(document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'INPUT') return;
                
                if(e.code === 'Space') { e.preventDefault(); flipCard(); }
                if(e.code === 'ArrowRight') { e.preventDefault(); nextCard(); }
                if(e.code === 'ArrowLeft') { e.preventDefault(); prevCard(); }
            });
        }

        // --- GLOBAL LOGIC ---
        function updateStats() {
            document.getElementById('xp-counter').innerText = xp;
            document.getElementById('streak-counter').innerText = streak;
            localStorage.setItem('be_xp', xp);
            localStorage.setItem('be_streak', streak);
        }
        
        function addXP(amount) {
            xp += amount;
            updateStats();
            
            // Visual feedback
            const xpEl = document.getElementById('xp-counter');
            xpEl.classList.add('text-neon-cyan', 'scale-125');
            setTimeout(() => xpEl.classList.remove('text-neon-cyan', 'scale-125'), 300);
        }

        function switchMode(mode) {
            document.querySelectorAll('.mode-section').forEach(el => el.classList.add('hide'));
            document.getElementById(\`mode-\${mode}\`).classList.remove('hide');
            
            // Update Nav Buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active', 'active-pink');
                if(btn.innerText.includes('Bonus')) btn.classList.add('text-neon-pink');
            });
            
            const activeBtn = document.querySelector(\`[onclick="switchMode('\${mode}')"]\`);
            if(activeBtn) {
                if(mode === 'extra') {
                    activeBtn.classList.add('active-pink');
                    activeBtn.classList.remove('text-neon-pink');
                } else {
                    activeBtn.classList.add('active');
                }
            }
            
            stopAudio();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- AUDIO LOGIC (STRICT en-US) ---
        function speak(text) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'en-US';
            msg.rate = 0.9; 
            window.speechSynthesis.speak(msg);
        }
        function playAudio(e, text) {
            e.stopPropagation();
            speak(text);
        }
        function stopAudio() {
            window.speechSynthesis.cancel();
        }

        // --- 1. STUDY MODE ---
        function renderStudyMode() {
            const grid = document.getElementById('study-grid');
            grid.innerHTML = vocabData.map(v => \`
                <button class="glass-card p-6 rounded-2xl text-center cursor-pointer hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan flex flex-col items-center justify-center group" onclick="playAudio(event, '\${v.word}')" aria-label="Listen to \${v.word}">
                    <div class="text-6xl mb-4 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">\${v.emoji}</div>
                    <div class="font-bold text-2xl tracking-wide text-white">\${v.word}</div>
                    <div class="text-zinc-400 text-md mt-2 font-medium">\${v.pt}</div>
                </button>
            \`).join('');
        }

        // --- 2. FLASHCARD MODE ---
        function renderFlashcard() {
            const card = flashcardsData[currentFCIndex];
            document.getElementById('fc-emoji').innerText = card.emoji;
            document.getElementById('fc-front').innerText = card.front;
            document.getElementById('fc-back').innerText = card.back;
            document.getElementById('fc-example').innerText = \`"\${card.example}"\`;
            document.getElementById('flashcard-container').classList.remove('flipped');
        }
        function flipCard() {
            document.getElementById('flashcard-container').classList.toggle('flipped');
        }
        function nextCard() {
            currentFCIndex = (currentFCIndex + 1) % flashcardsData.length;
            renderFlashcard();
            addXP(1);
        }
        function prevCard() {
            currentFCIndex = (currentFCIndex - 1 + flashcardsData.length) % flashcardsData.length;
            renderFlashcard();
        }

        // --- 3. QUIZ MODE ---
        function startQuiz() {
            currentQuizIndex = 0;
            quizScore = 0;
            renderQuiz();
        }
        function renderQuiz() {
            const progressPct = (currentQuizIndex / quizData.length) * 100;
            document.getElementById('quiz-progress-bar').style.width = \`\${progressPct}%\`;
            
            if (currentQuizIndex >= quizData.length) {
                document.getElementById('quiz-progress-bar').style.width = \`100%\`;
                document.getElementById('quiz-question').innerText = \`Quiz Complete!\`;
                document.getElementById('quiz-options').innerHTML = '';
                
                const feedback = document.getElementById('quiz-feedback');
                feedback.innerText = \`Final Score: \${quizScore}/\${quizData.length}\`;
                feedback.className = "mt-8 text-center text-4xl font-bold h-10 text-neon-cyan bangers tracking-wider";
                
                document.getElementById('quiz-next-btn').classList.add('hide');
                streak++;
                addXP(50);
                speak("Quiz complete! Great job!");
                return;
            }
            
            const q = quizData[currentQuizIndex];
            document.getElementById('quiz-progress').innerText = \`Question \${currentQuizIndex + 1}/\${quizData.length}\`;
            document.getElementById('quiz-score').innerText = \`Score: \${quizScore}\`;
            document.getElementById('quiz-question').innerText = q.q;
            document.getElementById('quiz-feedback').innerText = '';
            document.getElementById('quiz-next-btn').classList.add('hide');
            
            document.getElementById('quiz-options').innerHTML = q.options.map((opt, i) => \`
                <button onclick="checkQuizAnswer(\${i})" class="w-full text-left p-5 bg-zinc-800/80 border-2 border-zinc-700 rounded-xl hover:bg-zinc-700 hover:border-zinc-500 transition-all duration-200 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-neon-cyan">
                    \${opt}
                </button>
            \`).join('');
        }
        
        function checkQuizAnswer(idx) {
            const q = quizData[currentQuizIndex];
            const btns = document.getElementById('quiz-options').children;
            
            for(let btn of btns) {
                btn.disabled = true;
                btn.classList.remove('hover:bg-zinc-700', 'hover:border-zinc-500');
                btn.classList.add('cursor-not-allowed', 'opacity-60');
            }
            
            const feedback = document.getElementById('quiz-feedback');
            
            if (idx === q.ans) {
                btns[idx].classList.replace('bg-zinc-800/80', 'bg-green-600/80');
                btns[idx].classList.replace('border-zinc-700', 'border-green-400');
                btns[idx].classList.remove('opacity-60');
                
                feedback.innerText = "✅ Correct!";
                feedback.className = "mt-8 text-center text-3xl font-bold h-10 text-green-400 bangers tracking-wider";
                quizScore++;
                addXP(10);
                speak("Correct!");
            } else {
                btns[idx].classList.replace('bg-zinc-800/80', 'bg-red-600/80');
                btns[idx].classList.replace('border-zinc-700', 'border-red-400');
                btns[idx].classList.remove('opacity-60');
                
                btns[q.ans].classList.replace('bg-zinc-800/80', 'bg-green-600/80');
                btns[q.ans].classList.replace('border-zinc-700', 'border-green-400');
                btns[q.ans].classList.remove('opacity-60');
                
                feedback.innerText = "❌ Incorrect!";
                feedback.className = "mt-8 text-center text-3xl font-bold h-10 text-red-400 bangers tracking-wider";
                speak("Oops!");
            }
            document.getElementById('quiz-next-btn').classList.remove('hide');
        }
        
        function nextQuiz() {
            currentQuizIndex++;
            renderQuiz();
        }

        // --- 4. GAME MODE (Memory + Scramble) ---
        let memoryCards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let isCheckingMemory = false;

        function initMemoryGame() {
            const items = [
                { id: 1, val: "Dinosaur", pair: "🦖" },
                { id: 2, val: "Owl", pair: "🦉" },
                { id: 3, val: "Fast", pair: "⚡" },
                { id: 4, val: "Midnight", pair: "🕛" },
                { id: 5, val: "Drums", pair: "🥁" },
                { id: 6, val: "Bicycle", pair: "🚲" },
                { id: 7, val: "Happy", pair: "😀" },
                { id: 8, val: "Wolf", pair: "🐺" }
            ];
            let deck = [];
            items.forEach(item => {
                deck.push({ id: item.id, content: item.val, type: 'text' });
                deck.push({ id: item.id, content: item.pair, type: 'emoji' });
            });
            // Shuffle
            deck = deck.sort(() => Math.random() - 0.5);
            
            const grid = document.getElementById('memory-grid');
            grid.innerHTML = deck.map((card, i) => \`
                <button class="memory-card h-28 sm:h-32 perspective-1000 focus:outline-none focus:ring-2 focus:ring-neon-cyan rounded-xl" onclick="flipMemoryCard(\${i}, \${card.id}, this)" aria-label="Memory Card">
                    <div class="memory-card-inner w-full h-full relative transition-transform duration-500 transform-style-3d cursor-pointer rounded-xl shadow-lg">
                        <div class="backface-hidden absolute inset-0 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 transition-colors rounded-xl text-4xl border-2 border-zinc-600 shadow-inner">❓</div>
                        <div class="backface-hidden rotate-y-180 absolute inset-0 flex items-center justify-center bg-zinc-800 rounded-xl border-2 border-neon-cyan text-2xl sm:text-3xl font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                            \${card.content}
                        </div>
                    </div>
                </button>
            \`).join('');
            matchedPairs = 0;
            flippedCards = [];
            isCheckingMemory = false;
        }

        function flipMemoryCard(index, id, el) {
            if (isCheckingMemory || el.classList.contains('flipped') || el.classList.contains('matched')) return;
            
            el.classList.add('flipped');
            flippedCards.push({ id, el });
            
            // Extract text/emoji for speech
            const content = el.querySelector('.rotate-y-180').innerText;
            speak(content);

            if (flippedCards.length === 2) {
                isCheckingMemory = true;
                setTimeout(() => {
                    if (flippedCards[0].id === flippedCards[1].id) {
                        // Match
                        flippedCards[0].el.classList.add('matched', 'opacity-40', 'scale-95');
                        flippedCards[1].el.classList.add('matched', 'opacity-40', 'scale-95');
                        flippedCards[0].el.querySelector('.rotate-y-180').classList.replace('border-neon-cyan', 'border-green-400');
                        flippedCards[1].el.querySelector('.rotate-y-180').classList.replace('border-neon-cyan', 'border-green-400');
                        
                        matchedPairs++;
                        addXP(15);
                        speak("Match!");
                        
                        if (matchedPairs === 8) {
                            document.getElementById('game-stage-2').classList.remove('hide');
                            initScramble();
                            setTimeout(() => {
                                document.getElementById('game-stage-2').scrollIntoView({behavior: 'smooth', block: 'start'});
                            }, 500);
                        }
                    } else {
                        // No match
                        flippedCards[0].el.classList.remove('flipped');
                        flippedCards[1].el.classList.remove('flipped');
                    }
                    flippedCards = [];
                    isCheckingMemory = false;
                }, 1000);
            }
        }

        // Scramble Logic
        const scrambleSentence = ["I", "want", "to", "have", "a", "McLaren"];
        let scrambleWordsData = [];
        let currentScramble = [];
        
        function initScramble() {
            const shuffled = [...scrambleSentence].sort(() => Math.random() - 0.5);
            scrambleWordsData = shuffled.map((w, i) => ({ id: i, word: w, used: false }));
            currentScramble = [];
            renderScrambleWords();
            renderDropzone();
            document.getElementById('scramble-feedback').innerText = '';
        }

        function renderScrambleWords() {
            document.getElementById('scramble-words').innerHTML = scrambleWordsData.map(item => 
                item.used ? \`<span class="invisible px-6 py-3"></span>\` : 
                \`<button class="scramble-word bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-xl border border-zinc-500 font-bold text-xl shadow-lg transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-cyan" onclick="moveToDropzone(\${item.id})">\${item.word}</button>\`
            ).join('');
        }

        function moveToDropzone(id) {
            const item = scrambleWordsData.find(x => x.id === id);
            if(!item || item.used) return;
            item.used = true;
            currentScramble.push(item);
            renderScrambleWords();
            renderDropzone();
            speak(item.word);
        }

        function renderDropzone() {
            const dropzone = document.getElementById('scramble-dropzone');
            if(currentScramble.length === 0) {
                dropzone.innerHTML = \`<span class="text-zinc-500 italic">Click words below to build the sentence</span>\`;
            } else {
                dropzone.innerHTML = currentScramble.map((item, index) => \`
                    <button class="bg-neon-cyan text-black px-6 py-3 rounded-xl font-bold text-xl shadow-[0_0_15px_rgba(0,229,255,0.4)] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white" onclick="removeFromDropzone(\${index})">\${item.word}</button>
                \`).join('');
            }
        }

        function removeFromDropzone(index) {
            const item = currentScramble[index];
            currentScramble.splice(index, 1);
            const originalItem = scrambleWordsData.find(x => x.id === item.id);
            if(originalItem) originalItem.used = false;
            renderScrambleWords();
            renderDropzone();
        }

        function checkScramble() {
            const answer = currentScramble.map(x => x.word).join(" ");
            const feedback = document.getElementById('scramble-feedback');
            
            if (answer === scrambleSentence.join(" ")) {
                feedback.innerText = "🎉 PERFECT! +100 XP";
                feedback.className = "mt-6 text-3xl font-bold text-neon-pink bangers tracking-wider animate-pulse";
                addXP(100);
                speak("Perfect! You are amazing!");
            } else {
                feedback.innerText = "❌ Try again!";
                feedback.className = "mt-6 text-2xl font-bold text-red-400 bangers tracking-wider";
                speak("Try again");
            }
        }

        // --- 5. READING PRACTICE ---
        function playStory() {
            const text = document.getElementById('story-text').innerText;
            speak(text);
        }

        function setupInteractiveWords() {
            document.querySelectorAll('.interactive-word').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.getElementById('modal-word').innerText = el.innerText;
                    document.getElementById('modal-def').innerText = el.getAttribute('data-def');
                    
                    const modal = document.getElementById('def-modal');
                    const content = document.getElementById('def-modal-content');
                    
                    modal.classList.replace('hidden', 'flex');
                    // Trigger reflow
                    void modal.offsetWidth;
                    modal.classList.replace('opacity-0', 'opacity-100');
                    content.classList.replace('scale-95', 'scale-100');
                    
                    speak(el.innerText);
                });
            });
        }
        
        function closeModal() {
            const modal = document.getElementById('def-modal');
            const content = document.getElementById('def-modal-content');
            
            modal.classList.replace('opacity-100', 'opacity-0');
            content.classList.replace('scale-100', 'scale-95');
            
            setTimeout(() => {
                modal.classList.replace('flex', 'hidden');
            }, 300);
        }

        function renderReadingQuiz() {
            const container = document.getElementById('reading-quiz');
            container.innerHTML = readingQuizData.map((q, i) => \`
                <div class="mb-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <p class="font-bold text-xl mb-4 text-white">\${q.q}</p>
                    <div class="flex flex-col gap-3">
                        \${q.options.map((opt, j) => \`
                            <label class="flex items-center gap-4 cursor-pointer bg-zinc-800/80 p-4 rounded-xl border border-zinc-700 hover:border-neon-pink hover:bg-zinc-700 transition-all duration-200 focus-within:ring-2 focus-within:ring-neon-pink">
                                <input type="radio" name="rq-\${i}" value="\${j}" class="w-5 h-5 accent-neon-pink cursor-pointer">
                                <span class="text-lg text-zinc-200">\${opt}</span>
                            </label>
                        \`).join('')}
                    </div>
                </div>
            \`).join('');
        }

        function checkReadingQuiz() {
            let score = 0;
            readingQuizData.forEach((q, i) => {
                const selected = document.querySelector(\`input[name="rq-\${i}"]:checked\`);
                if (selected && parseInt(selected.value) === q.ans) {
                    score++;
                }
            });
            
            const feedback = document.getElementById('reading-feedback');
            feedback.classList.remove('hide');
            feedback.innerText = \`You scored \${score} out of \${readingQuizData.length}!\`;
            
            if(score === readingQuizData.length) {
                feedback.className = "mt-6 text-center text-3xl font-bold text-neon-cyan bangers tracking-wider";
                speak("Perfect score! Great reading!");
            } else {
                feedback.className = "mt-6 text-center text-2xl font-bold text-yellow-400 bangers tracking-wider";
                speak(\`You scored \${score} out of \${readingQuizData.length}\`);
            }
            
            addXP(score * 20);
            
            // Disable inputs and button
            document.querySelectorAll('#reading-quiz input').forEach(inp => inp.disabled = true);
            const btn = document.getElementById('btn-submit-reading');
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.classList.remove('hover:scale-[1.02]', 'hover:bg-pink-600');
        }

        // Run Init
        init();
        // Start on study mode
        switchMode('study');
        startQuiz(); // prep quiz
    </script>
</body>
</html>`;
