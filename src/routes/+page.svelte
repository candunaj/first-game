<script lang="ts">
    import { render } from '$lib/game';
    import { onMount } from 'svelte';
    import { createGameFunctions } from '$lib/types';

    let gameCanvas = $state<HTMLCanvasElement | null>(null);
    let fps = $state<number>(0);
    let pressedKey = $state<string | null>(null);
    
    let lastFrameTime = 0;
    let frameCount = 0;
    let fpsUpdateTime = 0;

    let gameFunctions = $derived(createGameFunctions(gameCanvas));

    onMount(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            pressedKey = e.code;
        };
        
        const handleKeyUp = () => {
            pressedKey = null;
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        loop(0);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    });

    function loop(currentTime: number){
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
            // Set canvas internal resolution to match display size
            const rect = gameCanvas.getBoundingClientRect();
            gameCanvas.width = rect.width;
            gameCanvas.height = rect.height;
            
            render(gameFunctions, dt, pressedKey, rect.width, rect.height);
        }

        lastFrameTime = currentTime;
        requestAnimationFrame(loop);
    }
</script>

<h1>First Game</h1>
<div class="fps-counter">FPS: {fps}</div>
<canvas id="gameCanvas" bind:this={gameCanvas}></canvas>
<style>

    h1{
        margin:20px;
    }
    .fps-counter {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: #00ff00;
        padding: 8px 12px;
        font-family: monospace;
        font-size: 16px;
        border-radius: 4px;
        z-index: 1000;
    }
    #gameCanvas {
        flex-grow:1;
        flex-shrink: 1;
        border: 10px solid black;
        margin:20px;
    }
</style>