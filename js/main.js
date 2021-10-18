var Gamers = [
  { 'name': 'Tom', 'age': 1, points: 33, country: 'GB' },
  { 'name': 'Joe', 'age': 12, points: 210, country: 'US' },
  { 'name': 'Marc', 'age': 5, points: 11, country: 'GER' },
  { 'name': 'Bence', 'age': 9, points: 99, country: 'HU' },
  { 'name': 'Peti', 'age': 8, points: 201, country: 'HU' },
  { 'name': 'Levi', 'age': 15, points: 178, country: 'HU' }
];

// Innen jössz te:
for (var i = 0; i < Gamers.length; i++) {
  Gamers[i].age += 10;
  Gamers[i].loggedIn = Gamers[i].country === 'HU';
}

// Ez pedig a játékhoz kell ;-)
var gameParent = document.querySelector('.game-container');