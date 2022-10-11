import AdminJs from 'adminjs';
import AdminExpress from '@adminjs/express';
import AdminJsMongoose from '@adminjs/mongoose';
import bcrypt from 'bcrypt';
import CronSettings from '../../models/CronSetting';
import Users from '../../models/Users';
import { cookieName, cookiePassword } from '../environments';

// Add Mongoose adapter
AdminJs.registerAdapter(AdminJsMongoose);

// Access Control
const canModifyUser = ({ currentAdmin }) => currentAdmin && currentAdmin.super;

export const admin = new AdminJs({
  resources: [
    {
      resource: CronSettings,
      options: {
        properties: {
          account: {
            isVisible: false,
          },
          'lottery.contractAddress': { isVisible: false },
          'lottery.currency': { isVisible: false },
          'lottery.initialPotValue': { isVisible: false },
          'lottery.winners': {
            isVisible: false,
          },
          'lottery.updatedAt': { isVisible: false },
          createdAt: {
            isVisible: {
              list: true,
              edit: false,
              show: true,
              delete: false,
            },
          },
          updatedAt: {
            isVisible: {
              list: true,
              edit: false,
              show: true,
              delete: false,
            },
          },
          abi: {
            isVisible: false,
          },
          lottery: {
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: true,
              delete: false,
            },
          },
        },
        actions: {
          list: {
            showFilter: false,
          },
          new: {
            isAccessible: false,
          },
          delete: {
            isAccessible: false,
          },
          edit: {
            showDelete: false,
          },
          bulkDelete: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: Users,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          super: { isVisible: false },
          password: {
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            isAccessible: canModifyUser,
            // Hash the password.
            before: async (request) => {
              if (request?.payload?.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    10
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
          delete: {
            isVisible: canModifyUser,
          },
          edit: {
            isAccessible: canModifyUser,
            before: async (request) => {
              if (request?.payload?.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    10
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
        },
      },
    },
  ],
  branding: {
    companyName: 'Tombola-Wot',
    withMadeWithLove: false,
    logo: '',
  },
  dashboard: { component: AdminJs.bundle('./components/dashboard') },
  rootPath: '/admin',
});

export const adminRouter = AdminExpress.buildAuthenticatedRouter(
  admin,
  {
    cookieName: cookieName,
    cookiePassword: cookiePassword,
    authenticate: async (email, password) => {
      const user = await Users.findOne({ email });
      if (user) {
        const matched = await bcrypt.compare(password, user.encryptedPassword);
        if (matched) return user;
      }
      return false;
    },
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);
