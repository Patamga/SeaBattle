const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');

const game = {
  ships: [],
  shipCount: 0,
  optionShip: {
    count: [1, 2, 3, 4],
    sise: [4, 3, 2, 1]
  },
  collision: new Set(),
  generateShip() {
    
    for (let i = 0; i < this.optionShip.count.length; i++) {
      
      for (let j = 0; j < this.optionShip.count[i]; j++) {
        const sise = this.optionShip.sise[i];
        const ship = this.generateOptionsShip(sise);
        this.ships.push(ship);
        this.shipCount++;
      }
    }
  },
  generateOptionsShip(shipSise) {
    const ship = {
      hit: [],
      location: []
    };
    const direction = Math.random() < 0.5;
    let x, y;

    if (direction) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * (10 - shipSise));
    } else {
      x = Math.floor(Math.random() * (10 - shipSise));
      y = Math.floor(Math.random() * 10);
    }

    for (let i = 0; i < shipSise; i++) {
      
      if (direction) {
        ship.location.push(x + '' + (y + i));
      } else {
        ship.location.push(x + i + '' + y);
      }
      ship.hit.push('');
    }
    
    if (this.checkCollision(ship.location)) {
      return this.generateOptionsShip(shipSise);
    }

    this.addCollision(ship.location);

    return ship;
  },
  checkCollision(location) {
    for (const coord of location) {
      
      if (this.collision.has(coord)) {
        return true;
      }
    }
  },
  addCollision(location) {
    
    for (let i = 0; i < location.length; i++) {
      const statCoordX = location[i][0] - 1;
      
      for (let j = statCoordX; j < statCoordX + 3; j++) {
        const statCoordY = location[i][1] - 1;
        
        for (let z = statCoordY; z < statCoordY + 3; z++) {
          
          if (j >= 0 && j < 10 && z >= 0 && z < 10) {
            const coord = j + '' + z;
            this.collision.add(coord);
          }
        }
      }
    }
  }
};

const play = {
  record: localStorage.getItem('seaBattleRecord') || 0,
  shot: 0,
  hit: 0,
  dead: 0,
  set updateData(data) {
    this[data] += 1;
    this.render();
  },
  render() {
    record.textContent = this.record;
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    dead.textContent = this.dead;
  }
};

const show = {
  hit: function(elem) {
    this.changeClass(elem, 'hit');
  },
  miss(elem) {
    this.changeClass(elem, 'miss');
  },
  dead(elem) {
    this.changeClass(elem, 'dead');
  },
  changeClass(elem, value) {
    elem.className = value;
  }
};

const fire = event => {
  const target = event.target;
  
  if (target.classList.length !== 0 ||
      target.tagName !== 'TD' ||
      !game.shipCount) {
    return;
  }
  
  show.miss(target);
  play.updateData = 'shot';

  for (let i = 0; i < game.ships.length; i++) {
    const ship = game.ships[i];
    const index = ship.location.indexOf(target.id);
    
    if (index >= 0) {
      show.hit(target);
      play.updateData = 'hit';
      ship.hit[index] = 'x';
      const live = ship.hit.indexOf('');
      
      if (live < 0) {
        play.updateData = 'dead';
        
        for (const id of ship.location) {
          show.dead(document.getElementById(id));
        }
        game.shipCount -= 1;

        if (game.shipCount < 1) {
          /* можно заменить проверку на ! в начале*/
          header.textContent = 'Игра окончена!';
          header.style.color = 'red';

          if (play.shot < play.record || play.record === 0) {
            localStorage.setItem('seaBattleRecord', play.shot);
            play.record = play.shot;
            play.render();
          }
        }
      }
    }
  }
};

const init = () => {
  enemy.addEventListener('click', fire);
  play.render();
  game.generateShip();
  again.addEventListener('click', () => {
    location.reload();
  });
  record.addEventListener('dblclick', () => {
    localStorage.clear();
    play.record = 0;
    play.render();
  });
};
init();
