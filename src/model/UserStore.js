import { types } from 'mobx-state-tree';

export const User = types
  .model('user', {
    id: '',
    name: ''
  })
  .actions(
    (self) =>
      function LogUser(id, name) {
        // self.id.set(id, User.create({ id })),
        self.name.set(name, User.create({ name }));
      }
  )
  .views((self) => ({
    userData() {
      return self.user;
    }
  }));
