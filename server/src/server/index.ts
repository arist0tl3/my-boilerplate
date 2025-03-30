import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import NodeCache from 'node-cache';

import buildSchema from './utils/buildSchema';
import getUser from './utils/getUser';

import createDataLoaders from '../dataloaders/createDataLoaders';

import models from '../models';

import { IContext } from '../types';

const { MONGO_URI, PORT = '4000', NODE_ENV } = process.env;

const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    // Allow requests with no origin (like mobile apps or curl requests)
    const allowedOrigins = [
      'https://app.turtara.com',
      'https://www.turtara.com',
      'http://localhost:3000', // React default dev port
      'http://localhost:5173', // Vite default dev port
      'http://127.0.0.1:5173', // Alternative localhost reference for Vite
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

async function init(): Promise<void> {
  try {
    if (!MONGO_URI) throw new Error('Missing mongo config');

    await mongoose.connect(MONGO_URI);

    console.log('Connected to MongoDB');

    if (NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }

    const cache = new NodeCache();

    const schema = buildSchema();

    // Create Express app and HTTP server
    const app = express();
    const httpServer = http.createServer(app);

    // Create Apollo Server
    const server = new ApolloServer<IContext>({
      schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    // Start the server
    await server.start();

    // Apply middleware
    app.use(
      '/',
      cors(corsOptions),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          let currentUser;

          if (req?.headers?.authorization?.includes('Bearer')) {
            currentUser = await getUser(req?.headers?.authorization, models);
          }

          return {
            req,
            res,
            models,
            currentUser,
            cache,
            dataLoaders: createDataLoaders(models, currentUser?._id),
          };
        },
      }),
    );

    // Start the HTTP server
    await new Promise<void>((resolve) => httpServer.listen({ port: parseInt(PORT, 10) }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  } catch (err: any) {
    console.log(`Unable to start server: ${err.toString()}`);
  }
}

export default init;
