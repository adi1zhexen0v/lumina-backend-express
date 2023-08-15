import express, { Express, Request, Response } from 'express';

import logger from './utils/logger.js';

import 'dotenv/config';
const { PORT } = process.env;

const app: Express = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello TypeScript');
});

const port = PORT || 4000;

const start = async () => {
	try {
		app.listen(port, () => logger.info(`Server is listening on port ${port}`));
	} catch (error) {
		logger.error(error);
	}
};
start();
