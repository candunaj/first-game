<script lang="ts">
    import { init, render } from '$lib/game';
    import { onMount } from 'svelte';
    import { createGameFunctions } from '$lib/types';

    let gameCanvas = $state<HTMLCanvasElement | null>(null);
    let fps = $state<number>(0);
    let pressedKeys = $state<Set<string>>(new Set());
    let gameStarted = $state<boolean>(false);
    let animationFrameId: number | null = null;
    let headerText = $state<string>("");
    let lastFrameTime = 0;
    let frameCount = 0;
    let fpsUpdateTime = 0;

    let gameFunctions = $derived(createGameFunctions(gameCanvas));

    function resizeCanvas(){
        if(gameCanvas){
            const rect = gameCanvas.getBoundingClientRect();
            gameCanvas.width = rect.width;
            gameCanvas.height = rect.height;
            return {width: rect.width, height: rect.height};
        }
        return {width: 0, height: 0};
    }

    onMount(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            pressedKeys.add(e.code);
        };
        
        const handleKeyUp = (e: KeyboardEvent) => {
            pressedKeys.delete(e.code);
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        const {width, height} = resizeCanvas();
        init((text)=>headerText = text, width, height);
        if(gameFunctions){
            render(gameFunctions, 0, pressedKeys, width, height);
        }
        
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    });

    function loop(currentTime: number){
        if (!gameStarted) {
            return;
        }
        
        // Calculate delta time in seconds
        const dt = lastFrameTime === 0 ? 0 : (currentTime - lastFrameTime) / 1000;
        
        // Calculate FPS
        frameCount++;
        if (currentTime - fpsUpdateTime >= 1000) { // Update FPS every second
            fps = Math.round((frameCount * 1000) / (currentTime - fpsUpdateTime));
            frameCount = 0;
            fpsUpdateTime = currentTime;
        }
        
        if (gameCanvas && gameFunctions) {
            const {width, height} = resizeCanvas();
            render(gameFunctions, dt, pressedKeys, width, height);
        }

        lastFrameTime = currentTime;
        animationFrameId = requestAnimationFrame(loop);
    }
    
    function startGame() {
        const {width, height} = resizeCanvas();
        init((text)=>headerText = text, width, height);
        gameStarted = true;
        lastFrameTime = 0;
        frameCount = 0;
        fpsUpdateTime = 0;
        animationFrameId = requestAnimationFrame(loop);
    }
    
    function resetGame() {
        const {width, height} = resizeCanvas();
        init((text)=>headerText = text, width, height);
        lastFrameTime = 0;
        frameCount = 0;
        fpsUpdateTime = 0;
        fps = 0;
    }
</script>

<div class="game-container">
    <div class="header-container">
        <h1>{headerText}</h1>
        <div class="controls">
            <button 
                onclick={startGame} 
                disabled={gameStarted}
                class="minecraft-btn"
            >
                Start
            </button>
            <button 
                onclick={resetGame}
                class="minecraft-btn"
            >
                Reset
            </button>
        </div>
    </div>
    <div class="fps-counter">FPS: {fps}</div>
    <div class="canvas-wrapper">
        <canvas id="gameCanvas" bind:this={gameCanvas}></canvas>
    </div>
</div>
<style>
    .game-container {
        position: relative;
        z-index: 1;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .header-container {
        display: flex;
        align-items: center;
        margin: 20px;
        padding: 15px 20px;
        gap: 20px;
        background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
        border: 3px solid #000;
        border-top-color: #555;
        border-left-color: #555;
        border-right-color: #1a1a1a;
        border-bottom-color: #1a1a1a;
        box-shadow: 
            inset 2px 2px 0 rgba(255, 255, 255, 0.1),
            inset -2px -2px 0 rgba(0, 0, 0, 0.5),
            4px 4px 0 rgba(0, 0, 0, 0.3);
    }

    h1 {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 32px;
        color: #ffffff;
        text-shadow: 
            3px 3px 0 #3f3f3f,
            2px 2px 0 rgba(0, 0, 0, 0.5);
        letter-spacing: 2px;
    }
    
    .controls {
        display: flex;
        gap: 10px;
    }
    
    .minecraft-btn {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 16px;
        padding: 10px 20px;
        background: linear-gradient(180deg, #c6c6c6 0%, #8b8b8b 100%);
        border: 2px solid #000;
        border-top-color: #fff;
        border-left-color: #fff;
        border-right-color: #555;
        border-bottom-color: #555;
        box-shadow: 
            inset 1px 1px 0 rgba(255, 255, 255, 0.5),
            inset -1px -1px 0 rgba(0, 0, 0, 0.5),
            2px 2px 0 rgba(0, 0, 0, 0.3);
        color: #3f3f3f;
        text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.4);
        cursor: pointer;
        position: relative;
        transition: all 0.1s;
    }
    
    .minecraft-btn:hover:not(:disabled) {
        background: linear-gradient(180deg, #d6d6d6 0%, #9b9b9b 100%);
        color: #4f4f1f;
    }
    
    .minecraft-btn:active:not(:disabled) {
        background: linear-gradient(180deg, #8b8b8b 0%, #c6c6c6 100%);
        box-shadow: 
            inset -1px -1px 0 rgba(255, 255, 255, 0.5),
            inset 1px 1px 0 rgba(0, 0, 0, 0.5);
        transform: translate(1px, 1px);
    }
    
    .minecraft-btn:disabled {
        background: linear-gradient(180deg, #7f7f7f 0%, #5f5f5f 100%);
        color: #3f3f3f;
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    .fps-counter {
        position: absolute;
        top: 30px;
        right: 30px;
        background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
        color: #55ff55;
        padding: 10px 16px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 18px;
        border: 3px solid #000;
        border-top-color: #555;
        border-left-color: #555;
        border-right-color: #1a1a1a;
        border-bottom-color: #1a1a1a;
        box-shadow: 
            inset 2px 2px 0 rgba(255, 255, 255, 0.1),
            inset -2px -2px 0 rgba(0, 0, 0, 0.5),
            4px 4px 0 rgba(0, 0, 0, 0.3);
        z-index: 1000;
        text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
    }
    
    .canvas-wrapper {
        flex-grow: 1;
        margin: 20px;
        padding: 8px;
        background: linear-gradient(135deg, #555 0%, #333 25%, #555 50%, #333 75%, #555 100%);
        background-size: 16px 16px;
        border: 4px solid #000;
        border-top-color: #1a1a1a;
        border-left-color: #1a1a1a;
        border-right-color: #555;
        border-bottom-color: #555;
        box-shadow: 
            inset 3px 3px 0 rgba(0, 0, 0, 0.6),
            inset -3px -3px 0 rgba(255, 255, 255, 0.1),
            6px 6px 0 rgba(0, 0, 0, 0.4);
        display: flex;
    }
    
    #gameCanvas {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        background: #87CEEB;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
</style>