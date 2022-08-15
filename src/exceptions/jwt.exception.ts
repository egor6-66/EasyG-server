import { User } from '../users/users.model';


export default (user: User) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  lastName: user.lastName,
  roles: user.roles.map(i => i.value),
})
