import morgan, { StreamOptions } from 'morgan';
import logger from '@utils/logger.js';
import 'dotenv/config';

const stream: StreamOptions = {
	write: (message: string) => logger.http(message.trimEnd())
};

const skip = () => {
	const env = process.env.NODE_ENV || 'development';
	return env !== 'development';
};

const morganMiddleware = morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', { stream, skip });

export default morganMiddleware;
