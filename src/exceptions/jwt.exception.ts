import { User } from '../users/users.model';
import { IToken } from '../interfaces/token.interface';

export default (user: User): IToken => ({
  id: user.id,
  email: user.email,
  name: user.name,
  lastName: user.lastName,
  roles: user.roles.map(i => i.value),
})
