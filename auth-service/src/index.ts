import {ApplicationConfig, AuthTestApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new AuthTestApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);
  console.log(`Signup: POST ${url}/signup`);
  console.log(`Login: POST ${url}/login`);
  console.log(`Users: GET ${url}/users (requires token)`);
  console.log(`Me: GET ${url}/me (requires token)`);

  return app;
}

if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3004),
      host: process.env.HOST ?? 'localhost',
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
