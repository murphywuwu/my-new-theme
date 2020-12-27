const { getAvailablePortSeries } = require("@shopify/slate-tools/tools/utilities");

const { getAvailablePortSeries } = require('./utilities');

Promise.all([
  getAvailablePortSeries(config.get('network.startPort'), 3), 
  promptExternalTesting(),
])
  .then(([port, external]) => {
    
  });


