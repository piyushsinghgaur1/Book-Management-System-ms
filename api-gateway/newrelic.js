// import dotenv from 'dotenv';
require('dotenv').config();

'use strict';
exports.config = {
  app_name: ['api-gateway'],
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