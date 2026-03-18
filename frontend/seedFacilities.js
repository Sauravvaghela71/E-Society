const facilities = [
  { name: 'Olympic Swimming Pool', location: 'Clubhouse, Ground Floor', price: 200, status: 'Available', openingTime: '06:00', closingTime: '22:00' },
  { name: 'Grand Fitness Gym', location: 'Wing B, Basement', price: 300, status: 'Available', openingTime: '05:00', closingTime: '23:00' },
  { name: 'Indoor Badminton Court', location: 'Sports Arena', price: 150, status: 'Available', openingTime: '08:00', closingTime: '21:00' },
  { name: 'Community Theater', location: 'Clubhouse, 2nd Floor', price: 500, status: 'Available', openingTime: '10:00', closingTime: '23:00' },
  { name: 'Yoga & Meditation Studio', location: 'Zen Garden Rooftop', price: 100, status: 'Available', openingTime: '05:00', closingTime: '11:00' },
  { name: 'Open Terrace Party Hall', location: 'Wing A Rooftop', price: 1500, status: 'Available', openingTime: '18:00', closingTime: '23:59' },
  { name: 'Tennis Court', location: 'Outdoor Sports Complex', price: 250, status: 'Available', openingTime: '07:00', closingTime: '20:00' },
];

async function seed() {
  for (const fac of facilities) {
    await fetch('http://localhost:5100/api/facilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fac)
    }).then(r => console.log(fac.name, r.status)).catch(e => console.log(fac.name, e.message));
  }
}

seed();
