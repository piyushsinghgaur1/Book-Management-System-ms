import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
// import dotenv from 'dotenv';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {User} from '../models/user.model';
// dotenv.config();
export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  value(): VerifyFunction.BearerFn {
    console.log('BearerTokenVerifyProvider value() called');
    return async token => {
      try {
        const user = verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
        }) as User;
        console.log('user from token', user);

        if (!user) {
          throw new HttpErrors.Unauthorized('Invalid token');
        }

        return user;
      } catch (err) {
        throw new HttpErrors.Unauthorized('Invalid or expired token');
      }
    };
  }
}
