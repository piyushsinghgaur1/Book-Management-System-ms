import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import dotenv from 'dotenv';
import {
  AuthenticationBindings,
  AuthenticationComponent,
  Strategies,
} from 'loopback4-authentication';
import path from 'path';
import {User} from './models';
import {BearerTokenVerifyProvider} from './providers/bearer-token-verify.provider';
import {MySequence} from './sequence';
dotenv.config();
export {ApplicationConfig};

export class AuthTestApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    console.log(process.env.JWT_SECRET);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page password
    this.static('/', path.join(__dirname, '../public'));
    this.component(AuthenticationComponent);
    this.bind(AuthenticationBindings.USER_MODEL).to(User as any);
    // Bind bearer token verifier
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );
    this.sequence(MySequence);

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
