async function seedFlats() {
  await fetch('http://localhost:5100/api/flats/seed')
    .then(r => r.json())
    .then(console.log)
    .catch(console.error);
}
seedFlats();
