import express, { Application } from 'express';
import routes from './app/routes/routes.js';
import morganMiddleware from './app/middlewares/morgan.middleware.js';
import connectDatabase from './services/database.js';
import logger from './utils/logger.js';
import 'dotenv/config';

const { PORT, DB_URL } = process.env;

const app: Application = express();

app.use(express.json());
app.use(morganMiddleware);
app.use(routes);

const port = PORT || 4000;

const start = async () => {
	try {
		await connectDatabase(DB_URL!);
		app.listen(port, () => {
			logger.info(`Server is listening on port ${port}`);
		});
	} catch (error) {
		logger.error(error);
	}
};
start();