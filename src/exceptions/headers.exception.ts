export default (req, needs) => {
  if (needs === 'session-info') {
    return {
      ip: req.ip || req.header['x-forwarded-for'],
      device: req.headers['x-device'],
      lat: req.headers['x-lat'],
      lon: req.headers['x-lon'],

    };
  }
}
