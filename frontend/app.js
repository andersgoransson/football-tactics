class FootballTacticsBoard {
    constructor() {
        this.canvas = document.getElementById('tacticsBoard');
        this.ctx = this.canvas.getContext('2d');
        this.players = [];
        this.selectedPlayer = null;
        this.isDragging = false;
        
        this.initializeBoard();
        this.attachEventListeners();
    }
    
    initializeBoard() {
        this.drawPitch();
        this.addDefaultPlayers();
    }
    
    drawPitch() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.fillStyle = '#2d5a2d';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        ctx.strokeRect(0, 0, width, height);
        
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(width/2, height/2, 60, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(width/2, height/2, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeRect(0, height/2 - 80, 80, 160);
        ctx.strokeRect(width - 80, height/2 - 80, 80, 160);
        
        ctx.strokeRect(0, height/2 - 40, 20, 80);
        ctx.strokeRect(width - 20, height/2 - 40, 20, 80);
    }
    
    addDefaultPlayers() {
        const homeTeam = [
            {id: 1, name: 'GK', x: 50, y: 300, team: 'home'},
            {id: 2, name: 'RB', x: 150, y: 150, team: 'home'},
            {id: 3, name: 'CB', x: 150, y: 250, team: 'home'},
            {id: 4, name: 'CB', x: 150, y: 350, team: 'home'},
            {id: 5, name: 'LB', x: 150, y: 450, team: 'home'},
            {id: 6, name: 'CDM', x: 250, y: 300, team: 'home'},
            {id: 7, name: 'RM', x: 320, y: 200, team: 'home'},
            {id: 8, name: 'CM', x: 320, y: 300, team: 'home'},
            {id: 9, name: 'LM', x: 320, y: 400, team: 'home'},
            {id: 10, name: 'ST', x: 400, y: 250, team: 'home'},
            {id: 11, name: 'ST', x: 400, y: 350, team: 'home'}
        ];
        
        const awayTeam = [
            {id: 12, name: 'GK', x: 750, y: 300, team: 'away'},
            {id: 13, name: 'RB', x: 650, y: 150, team: 'away'},
            {id: 14, name: 'CB', x: 650, y: 250, team: 'away'},
            {id: 15, name: 'CB', x: 650, y: 350, team: 'away'},
            {id: 16, name: 'LB', x: 650, y: 450, team: 'away'},
            {id: 17, name: 'CDM', x: 550, y: 300, team: 'away'},
            {id: 18, name: 'RM', x: 480, y: 200, team: 'away'},
            {id: 19, name: 'CM', x: 480, y: 300, team: 'away'},
            {id: 20, name: 'LM', x: 480, y: 400, team: 'away'},
            {id: 21, name: 'ST', x: 400, y: 250, team: 'away'},
            {id: 22, name: 'ST', x: 400, y: 350, team: 'away'}
        ];
        
        this.ball = {id: 'ball', x: 400, y: 300};
        
        this.players = [...homeTeam, ...awayTeam];
        this.drawPlayers();
    }
    
    drawPlayers() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();
        
        this.players.forEach(player => {
            this.drawPlayer(player);
        });
        
        if (this.ball) {
            this.drawBall(this.ball);
        }
    }
    
    drawPlayer(player) {
        const ctx = this.ctx;
        const radius = 15;
        
        ctx.fillStyle = player.team === 'home' ? '#ff4444' : '#4444ff';
        ctx.beginPath();
        ctx.arc(player.x, player.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.name, player.x, player.y + 4);
    }
    
    drawBall(ball) {
        const ctx = this.ctx;
        const radius = 8;
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ball.x - radius/2, ball.y - radius/2);
        ctx.lineTo(ball.x + radius/2, ball.y + radius/2);
        ctx.moveTo(ball.x + radius/2, ball.y - radius/2);
        ctx.lineTo(ball.x - radius/2, ball.y + radius/2);
        ctx.stroke();
    }
    
    attachEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        document.getElementById('saveBtn').addEventListener('click', () => this.saveFormation());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadFormation());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearBoard());
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    getPlayerAt(x, y) {
        return this.players.find(player => {
            const dx = player.x - x;
            const dy = player.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= 15;
        });
    }
    
    getBallAt(x, y) {
        if (!this.ball) return null;
        const dx = this.ball.x - x;
        const dy = this.ball.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= 8 ? this.ball : null;
    }
    
    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        const player = this.getPlayerAt(pos.x, pos.y);
        const ball = this.getBallAt(pos.x, pos.y);
        
        if (player) {
            this.selectedPlayer = player;
            this.selectedBall = null;
            this.isDragging = true;
        } else if (ball) {
            this.selectedBall = ball;
            this.selectedPlayer = null;
            this.isDragging = true;
        }
    }
    
    handleMouseMove(e) {
        if (this.isDragging) {
            const pos = this.getMousePos(e);
            
            if (this.selectedPlayer) {
                this.selectedPlayer.x = pos.x;
                this.selectedPlayer.y = pos.y;
                this.drawPlayers();
            } else if (this.selectedBall) {
                this.selectedBall.x = pos.x;
                this.selectedBall.y = pos.y;
                this.drawPlayers();
            }
        }
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
        this.selectedPlayer = null;
        this.selectedBall = null;
    }
    
    async saveFormation() {
        const formation = {
            name: 'Current Formation',
            players: this.players,
            ball: this.ball
        };
        
        try {
            const response = await fetch('/api/formations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formation)
            });
            
            if (response.ok) {
                alert('Formation saved successfully!');
            }
        } catch (error) {
            console.error('Error saving formation:', error);
        }
    }
    
    async loadFormation() {
        try {
            const response = await fetch('/api/formations');
            const data = await response.json();
            console.log('Available formations:', data.formations);
        } catch (error) {
            console.error('Error loading formations:', error);
        }
    }
    
    clearBoard() {
        this.addDefaultPlayers();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FootballTacticsBoard();
});