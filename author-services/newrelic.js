require('dotenv').config();
// console.log('New Relic configuration loaded',process.env.LICENSE_KEY);
'use strict';
exports.config = {
  app_name: [process.env.NEWRELLIC_APP_NAME], 
  license_key: process.env.LICENSE_KEY, 
  logging: {
    level: 'info', 
  },
  host: 'collector.newrelic.com',
  distributed_tracing: {
    enabled: true, // Enable distributed tracing for microservices
  },
  slow_sql: {
    enabled: true, // Monitor slow SQL queries if applicable
  },
  transaction_tracer: {
    enabled: true, // Enable detailed transaction tracing
  },
};