function findAPortInUse() {
  
}

function getAvailablePortSeries(start, quantity,  increment = 1) {
  const startPort = start;
  const endPort = start + (quantity - 1);

  return findAportInUse(startPort, endPort, '127.0.0.0').then((port) => {

  })
}