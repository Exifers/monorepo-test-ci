import express, { Request, Response } from 'express'
import { getMessage } from 'message'

const app = express();
const PORT = 3000;


app.get('/', (req: Request, res: Response) => {
	res.send('hello world' + getMessage());
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
