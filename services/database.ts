import mongoose, { ConnectOptions } from 'mongoose';

mongoose.set('strictQuery', false);

const connectDatabase = (url: string) => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  
  return mongoose.connect(url, options as ConnectOptions);
};

export default connectDatabase;
